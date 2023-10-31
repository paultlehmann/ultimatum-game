import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';
import { IExtendedOffer, IOffer } from '../types';

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

interface IUserForStandings {
  id: number;
  name: string;
}

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
    const {
      gameId,
      participantNames,
      round
      //userName
    } = req.body;

    // const round = 7

    participantNames.forEach((participantName: string, index: number) => {
      // console.log(`original names for ${participantName} index ${index}`,participantNames)
      const participantNamesCopy = _.clone(participantNames);
      const participantNamesCopy2 = _.clone(participantNames);
      // participantNamesCopy.shift(index)
      participantNamesCopy.splice(0, index);
      // console.log('post-shift names',participantNamesCopy)
      participantNamesCopy2.splice(index, participantNames.length);
      // participantNamesCopy2.slice(1)
      // participantNamesCopy2.reverse()
      // console.log('participantNamesCopy2',participantNamesCopy2)
      const reorderedNames = participantNamesCopy.concat(participantNamesCopy2);
      reorderedNames.shift();
      // const reorderedNames = [...participantNames].push(participantNames.shift(index))
      // console.log(`reordered names for ${participantName}: ${reorderedNames}`)

      // const relevantIndex = round % reorderedNames.length

      // console.log('relevantIndex',{round,reorderedNames,relevantIndex})

      const relevantOpponent =
        reorderedNames[(round - 1) % reorderedNames.length];

      // console.log(`opponent for ${participantName} in round ${round}: ${relevantOpponent}`)

      const query = `
      update offers
      set recipient_id = (
        select id from users where username = '${relevantOpponent}'
      )
      where game_id = ${gameId} and round_number = ${round} and offerer_id = (select id from users where username = '${participantName}')
      `;

      // console.log('update query',query)

      pool.query(query).then((result: QueryResult) => res.status(200).send());
    });

    //   const query = `
    // update offers
    // set recipient_id = (
    // select coalesce(participants[(array_position(participants, (select id from users where username = '${userName}')) + ${round})], participants[1])
    // from games
    // where id = ${gameId}
    // )
    // where game_id = ${gameId} and round_number = ${round} and offerer_id = (select id from users where username = '${userName}')
    // `;

    //   pool.query(query).then((result: QueryResult) => res.status(200).send());

    //   console.log('shuffleAndAssignOffersResolver query', query);
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

export const getOfferHistoryResolver = () => (req: Request, res: Response) => {
  const { userId, gameId, round } = req.body;

  const query = `
  select round_number, amount, accepted from offers
  where recipient_id = (select offerer_id from offers where recipient_id = ${userId} and game_id = ${gameId} and round_number = ${round})
  and game_id = ${gameId}
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

  console.log('getAllOffers query', query);

  pool.query(query).then((result: QueryResult) => {
    // console.log('result rows',result.rows)
    const users = _.uniqBy(
      result.rows.map((row: IExtendedOffer) => ({
        id: row.offerer,
        name: row.offerer_name
      })),
      'id'
    );

    console.log('users', users);

    const getUserWinningsTotal = (userId: number) => {
      const relevantRows = result.rows.filter(
        (row: IExtendedOffer) =>
          row.accepted && (row.offerer === userId || row.recipient === userId)
      );
      // console.log(`relevant rows for ${userId}: `,relevantRows)
      const totalWinnings = relevantRows.reduce(
        (runningTotal: number, currentRow: IExtendedOffer) => {
          // console.log('reduce stuff,',{runningTotal, currentRow, relevantRows})
          return (
            runningTotal +
            (currentRow.recipient === userId
              ? currentRow.amount
              : 10 - currentRow.amount)
          );
        },
        0
      );

      console.log(`total winnings for ${userId}: `);
      console.log(totalWinnings);
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
    // res.status(200).send(result)
  });
};
