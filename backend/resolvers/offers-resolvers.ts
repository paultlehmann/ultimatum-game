import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '..';
import { IOffer } from '../types';

export const getOffersResolver = () => (req: Request, res: Response) => {
  //   console.log('resolver hit');

  const getTestData = async () => {
    return pool
      .query('SELECT * FROM offers ORDER BY id ASC')
      .then((result: QueryResult) => {
        //   console.log('result', result);
        return result.rows;
      });
  };

  getTestData()
    .then((offers: IOffer[]) => {
      //   console.log('dataGotten:', offers);
      return res.status(200).send(offers);
    })
    .catch((error) => {
      console.error('failure');
      return res.status(500).send(error);
    });
};

export const saveOfferResolver = () => (req: Request, res: Response) => {
  const { amount, game_id, offerer_id, round_number } = req.body;

  pool.query(`insert into offers (game_id, round_number, offerer_id, amount)
      values (${game_id}, ${round_number}, ${offerer_id}, ${amount})`);

  return res.status(200).send('Data Received: ' + JSON.stringify(req.body));
};

export const checkOfferStatusesResolver =
  () => (req: Request, res: Response) => {
    const { gameId, round } = req.body;

    const checkStatusesQuery = `
  select users.username from offers 
  join users on offers.offerer_id = users.id
  where game_id = ${gameId} and round_number = ${round}
  `;

    pool
      .query(checkStatusesQuery)
      .then((result: QueryResult) => res.status(200).send(result));
  };
