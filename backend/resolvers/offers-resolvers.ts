import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';
import { IExtendedOffer, IOffer } from '../types';

interface IUserForStandings {
  id: number;
  name: string;
}

export const saveOfferResolver = () => (req: Request, res: Response) => {
  const { amount, game_id, offerer_id, round_number } = req.body;

  try {
    const query = `
      update offers
      set amount = ${amount}
      where game_id = ${game_id} and round_number = ${round_number} and offerer_id = ${offerer_id}
    `;

    // pool.query(`insert into offers (game_id, round_number, offerer_id, amount)
    //   values (${game_id}, ${round_number}, ${offerer_id}, ${amount})
    //   on conflict on constraint unique_offer do nothing
    //   `);

    pool
      .query(query)
      .then((result: QueryResult) => res.status(200).send(result));

    // return res.status(200).send('Data Received: ' + JSON.stringify(req.body));
  } catch {
    console.error(
      'ERROR - Offer not saved! Offer probably already found for this round.'
    );
  }
};

export const checkOfferStatusesResolver =
  () => (req: Request, res: Response) => {
    const { gameId, round } = req.body;

    const checkStatusesQuery = `
  select users.username from offers 
  join users on offers.offerer_id = users.id
  where game_id = ${gameId} and round_number = ${round} and amount is not null
  `;

    console.log('checkOfferStatusesQuery', checkStatusesQuery);

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

    console.log('checkAcceptStatusesQuery', checkStatusesQuery);

    pool
      .query(checkStatusesQuery)
      .then((result: QueryResult) => res.status(200).send(result));
  };

export const shuffleAndAssignOffersResolver =
  () => (req: Request, res: Response) => {
    const { gameId, participantNames, round } = req.body;

    participantNames.forEach((participantName: string, index: number) => {
      const participantNamesCopy = _.clone(participantNames);
      const participantNamesCopy2 = _.clone(participantNames);
      participantNamesCopy.splice(0, index);
      participantNamesCopy2.splice(index, participantNames.length);
      const reorderedNames = participantNamesCopy.concat(participantNamesCopy2);
      reorderedNames.shift();

      const relevantOpponent =
        reorderedNames[(round - 1) % reorderedNames.length];

      const query = `
      update offers
      set recipient_id = (
        select id from users where username = '${relevantOpponent}'
      )
      where game_id = ${gameId} and round_number = ${round} and offerer_id = (select id from users where username = '${participantName}')
      `;

      pool.query(query).then((result: QueryResult) => res.status(200).send());
    });
  };

export const getOffersResolver = () => (req: Request, res: Response) => {
  const { gameId, id, recipient, round } = req.body;

  const query = `
  select id, amount from offers where game_id = ${gameId} and round_number = ${round} ${
    id ? `and id = ${id}` : ''
  } ${recipient ? `and recipient_id = ${recipient}` : ''}
  `;

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

    pool
      .query(query)
      .then((result: QueryResult) => res.status(200).send(result));
  };

export const getOfferHistoryResolver = () => (req: Request, res: Response) => {
  const { userId, gameId, round } = req.body;

  const query = `
  select round_number, amount, accepted from offers
  where recipient_id = (select offerer_id from offers where recipient_id = ${userId} and game_id = ${gameId} and round_number = ${round})
  and game_id = ${gameId}
  and round_number < ${round}
  and accepted is not null
  order by round_number asc
  `;

  pool.query(query).then((result: QueryResult) => res.status(200).send(result));
};

export const getAllOffersResolver = () => (req: Request, res: Response) => {
  const { gameId } = req.body;

  const query = `
select accepted, amount, offerer_id offerer, recipient_id recipient, users.username offerer_name from offers
join users on users.id = offerer_id
where game_id = ${gameId}
and accepted is not null
order by round_number asc
`;

  pool.query(query).then((result: QueryResult) => {
    const users = _.uniqBy(
      result.rows.map((row: IExtendedOffer) => ({
        id: row.offerer,
        name: row.offerer_name
      })),
      'id'
    );

    const getUserWinningsTotal = (userId: number) => {
      const relevantRows = result.rows.filter(
        (row: IExtendedOffer) =>
          row.accepted && (row.offerer === userId || row.recipient === userId)
      );
      const totalWinnings = relevantRows.reduce(
        (runningTotal: number, currentRow: IExtendedOffer) => {
          return (
            runningTotal +
            (currentRow.recipient === userId
              ? currentRow.amount
              : 10 - currentRow.amount)
          );
        },
        0
      );

      return totalWinnings;
    };

    const getOffersIAcceptedCount = (userId: number) =>
      result.rows.filter(
        (row: IExtendedOffer) => row.accepted && row.recipient === userId
      ).length;

    const getOffersIRejectedCount = (userId: number) =>
      result.rows.filter(
        (row: IExtendedOffer) => !row.accepted && row.recipient === userId
      ).length;

    const getMyOffersAcceptedCount = (userId: number) =>
      result.rows.filter(
        (row: IExtendedOffer) => row.accepted && row.offerer === userId
      ).length;

    const getMyOffersRejectedCount = (userId: number) =>
      result.rows.filter(
        (row: IExtendedOffer) => !row.accepted && row.offerer === userId
      ).length;

    const getAverageOffer = (userId: number) => {
      const relevantRows = result.rows.filter(
        (row: IExtendedOffer) => row.offerer === userId
      );
      return (
        relevantRows.reduce(
          (runningTotal: number, currentRow: IExtendedOffer) =>
            runningTotal + currentRow.amount,
          0
        ) / relevantRows.length
      );
    };

    const returnData = users.map((user: IUserForStandings) => {
      const { id, name } = user;
      return {
        username: name,
        winnings: getUserWinningsTotal(id),
        offersIAccepted: getOffersIAcceptedCount(id),
        offersIRejected: getOffersIRejectedCount(id),
        myOffersAccepted: getMyOffersAcceptedCount(id),
        myOffersRejected: getMyOffersRejectedCount(id),
        averageOffer: getAverageOffer(id)
      };
    });

    res.status(200).send(returnData);
  });
};
