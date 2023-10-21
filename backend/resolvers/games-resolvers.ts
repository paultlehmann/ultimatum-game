import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '..';

// const { app, pool } = serverInfo

export const checkForGamesResolver = () => (req: Request, res: Response) => {
  // console.log('resolver hit');

  const checkForGames = async () => {
    return pool
      .query("SELECT * FROM games WHERE stage = 'pre'")
      .then((result: QueryResult) => {
        console.log('checkForGames result', result);
        return res.status(200).send(result.rows);
      });
  };

  return checkForGames();
};
