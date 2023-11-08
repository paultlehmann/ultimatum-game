import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';

type TGameStage = 'pre' | 'offer' | 'accept' | 'post';

interface IGameQueryOptions {
  admin?: number;
  id?: number;
  participant?: number;
  stages?: TGameStage[];
}

interface IAdjustedValues extends Record<number, string> {
  admin?: number;
  id?: number;
  stage?: string;
}

export const checkForGamesResolver = () => (req: Request, res: Response) => {
  const { admin, id, participant, stages }: IGameQueryOptions = req.body;

  const adjustedValues: IAdjustedValues = {};

  if (admin) {
    adjustedValues.admin = admin;
  }

  if (id) {
    adjustedValues.id = id;
  }

  if (participant) {
    adjustedValues[participant] = 'ANY(participants)';
  }

  if (stages) {
    adjustedValues.stage = `(${stages
      .map((stage: TGameStage) => `'${stage}'`)
      .join(',')})`;
  }

  const wheres = Object.keys(adjustedValues)
    .map(
      (key: string, index: number) =>
        `${index === 0 ? 'where' : ' and'} ${key} ${
          key === 'stage' ? 'IN' : '='
          // @ts-ignore
        } ${adjustedValues[key]}`
    )
    ?.join('');

  const checkForGamesQuery = `SELECT * FROM games ${wheres} order by id desc`;

  pool.query(checkForGamesQuery).then((result: QueryResult) => {
    return res.status(200).send(result.rows);
  });
};

export const createGameResolver = () => (req: Request, res: Response) => {
  const { admin, participants } = req.body;

  const insertQuery = `insert into games (admin, participants)
  values (${admin}, '{${participants.join(',')}}')
  returning id`;

  pool
    .query(insertQuery)
    .then((result: QueryResult) => res.status(200).send(result.rows[0]));
};

export const getParticipantsByGameResolver =
  () => (req: Request, res: Response) => {
    const { gameId } = req.body;

    const getParticipantNamesQuery = `
  with participant_ids as (
    select unnest(participants) as id from games where id = ${gameId}
    )
    select username from users
    join participant_ids on users.id = participant_ids.id
    `;

    pool
      .query(getParticipantNamesQuery)
      .then((result: QueryResult) => res.status(200).send(result.rows));
  };

export const updateGameResolver = () => (req: Request, res: Response) => {
  const { gameId, newStage, assignOffers, participantNames, round } = req.body;

  if (assignOffers) {
    participantNames.forEach((participantName: string, index: number) => {
      const participantNamesCopy = _.clone(participantNames);
      const participantNamesCopy2 = _.clone(participantNames);
      participantNamesCopy.splice(0, index);
      participantNamesCopy2.splice(index, participantNames.length);
      const reorderedNames = participantNamesCopy.concat(participantNamesCopy2);
      reorderedNames.shift();

      const relevantOpponent =
        reorderedNames[(round - 1) % reorderedNames.length];

      // const query = `
      // update offers
      // set recipient_id = (
      //   select id from users where username = '${relevantOpponent}'
      // )
      // where game_id = ${gameId} and round_number = ${round} and offerer_id = (select id from users where username = '${participantName}')
      // `;

      const query = `
        insert into offers (game_id, round_number, offerer_id, recipient_id)
        values (${gameId}, ${round}, (select id from users where username = '${participantName}'), (select id from users where username = '${relevantOpponent}'))
        `;

      pool.query(query);
      // .then((result: QueryResult) => res.status(200).send());
    });
  }

  const updateGameQuery = `
    update games
    set stage = '${newStage}'
    where id = ${gameId}
    returning stage
    `;

  pool
    .query(updateGameQuery)
    .then((result: QueryResult) => res.status(200).send(result.rows[0]));
};

export const addParticipantToGameResolver =
  () => (req: Request, res: Response) => {
    const { gameId, userId } = req.body;

    const addParticipantQuery = `
  update games
  set participants = array_append(participants, ${userId})
  where id = ${gameId}
  `;

    pool
      .query(addParticipantQuery)
      .then((result: QueryResult) => res.status(200).send());
  };

export const advanceRoundResolver = () => (req: Request, res: Response) => {
  const { gameId, currentRound } = req.body;

  const updateRoundQuery = `
    update games
    set stage = 'offer', round = ${currentRound + 1}
    where id = ${gameId}
    `;
  pool
    .query(updateRoundQuery)
    .then((result: QueryResult) => res.status(200).send());
};
