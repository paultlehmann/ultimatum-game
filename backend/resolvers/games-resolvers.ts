import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';

type TGameStage = 'pre' | 'offer' | 'accept' | 'post';

interface IGameQueryOptions {
  admin?: number;
  participant?: number;
  stages?: TGameStage[];
}

interface IAdjustedValues extends Record<number, string> {
  admin?: number;
  // participants?: string;
  // stage?: `'${TGameStage}'`;
  stage?: string;
}

export const checkForGamesResolver = () => (req: Request, res: Response) => {
  // console.log('resolver hit');
  const { admin, participant, stages }: IGameQueryOptions = req.body;

  console.log('checkForGamesResolver args', req.body);

  const adjustedValues: IAdjustedValues = {};

  if (admin) {
    // adjustedValues.admin = `(select id from users where username = '${admin}')`;
    adjustedValues.admin = admin;
  }

  if (participant) {
    adjustedValues[participant] = 'ANY(participants)';
  }

  if (stages) {
    adjustedValues.stage = `(${stages
      .map((stage: TGameStage) => `'${stage}'`)
      .join(',')})`;
  }

  // const adjustedValues: IAdjustedValues = !_.isUndefined(participant) ? {
  //   admin,
  //   // participants: `'{${participants?.join(',')}}'`,
  //   [participant]: 'ANY(participants)',
  //   stage: stage && `'${stage}'`
  // } : {
  //   admin,
  //   stage: stage && `'${stage}'`
  // };

  const wheres = Object.keys(adjustedValues)
    .map(
      (key: string, index: number) =>
        // @ts-ignore
        `${index === 0 ? 'where' : ' and'} ${key} ${
          key === 'stage' ? 'IN' : '='
        } ${adjustedValues[key]}`
    )
    ?.join('');

  // console.log('wheres', wheres);
  console.log('query', `SELECT * FROM games ${wheres}`);

  // const checkForGames = async () => {
  pool.query(`SELECT * FROM games ${wheres}`).then((result: QueryResult) => {
    // console.log('checkForGames result', result);
    return res.status(200).send(result.rows);
  });
  // };

  // return checkForGames();
};

export const createGameResolver = () => (req: Request, res: Response) => {
  const { admin, participants } = req.body;

  const insertQuery = `insert into games (admin, participants)
  values (${admin}, '{${participants.join(',')}}')`;

  pool.query(insertQuery);

  return res
    .status(200)
    .send('createGameResolver Data Received: ' + JSON.stringify(req.body));
};
