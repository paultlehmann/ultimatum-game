import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '..';

// const { app, pool } = serverInfo

type TGameStage = 'pre' | 'offer' | 'accept' | 'post';

interface IGameQueryOptions {
  admin?: number;
  participants?: number[];
  stage?: TGameStage;
}

interface IAdjustedValues {
  admin?: number;
  participants?: string;
  stage?: `'${TGameStage}'`;
}

export const checkForGamesResolver = () => (req: Request, res: Response) => {
  // console.log('resolver hit');
  const { admin, participants, stage }: IGameQueryOptions = req.body;

  const adjustedValues: IAdjustedValues = {
    admin,
    participants: `'{${participants?.join(',')}}'`,
    stage: stage && `'${stage}'`
  };

  const wheres = Object.keys(req.body)
    .map(
      (key: string, index: number) =>
        // @ts-ignore
        `${index === 0 ? 'where' : ' and'} ${key} = ${adjustedValues[key]}`
    )
    ?.join('');

  console.log('wheres', wheres);
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
