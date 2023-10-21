import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '..';

// const { app, pool } = serverInfo

export const checkForGamesResolver = () => (req: Request, res: Response) => {
  // console.log('resolver hit');
  const { admin, participants, stage } = req.body;

  const wheres = Object.keys(req.body).map(
    (key: string, index: number) =>
      `${index === 0 ? 'where' : ' and'} ${key} = ${req.body[key]}`
  );

  console.log('wheres', wheres);

  // const checkForGames = async () => {
  pool
    .query("SELECT * FROM games WHERE stage = 'pre'")
    .then((result: QueryResult) => {
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
