import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '..';
import { IOffer } from '../types';

// export const getOffersResolver = () => (req: Request, res: Response) => {
//   //   console.log('resolver hit');

//   const getTestData = async () => {
//     return pool
//       .query('SELECT * FROM offers ORDER BY id ASC')
//       .then((result: QueryResult) => {
//         //   console.log('result', result);
//         return result.rows;
//       });
//   };

//   getTestData()
//     .then((offers: IOffer[]) => {
//       //   console.log('dataGotten:', offers);
//       return res.status(200).send(offers);
//     })
//     .catch((error) => {
//       console.error('failure');
//       return res.status(500).send(error);
//     });
// };

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

export const checkAcceptStatusesResolver =
  () => (req: Request, res: Response) => {
    const { gameId, round } = req.body;

    const checkStatusesQuery = `
    select users.username, offers.accepted from offers 
    join users on offers.recipient_id = users.id
    where game_id = ${gameId} and round_number = ${round}
  `;

    console.log('checkStatusesQuery', checkStatusesQuery);

    pool
      .query(checkStatusesQuery)
      .then((result: QueryResult) => res.status(200).send(result));
  };

export const shuffleAndAssignOffersResolver =
  () => (req: Request, res: Response) => {
    const { gameId, round, userName } = req.body;

    const query = `
  update offers
  set recipient_id = (
  select coalesce(participants[(array_position(participants, (select id from users where username = '${userName}')) + ${round})], participants[1])
  from games
  where id = ${gameId}
  )
  where game_id = ${gameId} and round_number = ${round} and offerer_id = (select id from users where username = '${userName}')
  `;

    pool.query(query).then((result: QueryResult) => res.status(200).send());

    console.log('shuffleAndAssignOffersResolver query', query);
  };

export const getOffersResolver = () => (req: Request, res: Response) => {
  const { gameId, id, recipient, round } = req.body;

  const query = `
  select id, amount from offers where game_id = ${gameId} and round_number = ${round} ${
    id ? `and id = ${id}` : ''
  } ${recipient ? `and recipient_id = ${recipient}` : ''}
  `;

  console.log('getOffers query', query);

  pool.query(query).then((result: QueryResult) => res.status(200).send(result));
};

export const acceptOrRejectOfferResolver =
  () => (req: Request, res: Response) => {
    const { acceptOrReject, gameId, round, userId } = req.body;

    const query = `
  update offers
  set accepted = ${acceptOrReject === 'accept' ? 'true' : 'false'}
  where game_id = ${gameId} and round_number = ${round} and recipient_id = ${userId}
  `;

    console.log('AOR query', query);

    pool
      .query(query)
      .then((result: QueryResult) => res.status(200).send(result));
  };
