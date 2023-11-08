import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';
import { IExtendedOffer } from '../types';

export const getUserWinningsTotal = (result: QueryResult, userId: number) => {
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

export const createUserResolver = () => (req: Request, res: Response) => {
  const { admin, username } = req.body;

  pool
    .query(`SELECT * FROM users where username = '${username}'`)
    .then((result: QueryResult) => {
      if (_.isEmpty(result.rows)) {
        pool
          .query(
            `insert into users (username, admin)
      values ('${username}',${admin})
      returning id`
          )
          .then((result: QueryResult) => {
            return res
              .status(200)
              .send({ isAdmin: false, id: result.rows[0].id });
          });
      } else {
        return res.status(200).send({
          id: result.rows[0].id,
          isAdmin: result.rows[0].admin
        });
      }
    });
};

export const updateWinningsResolver = () => (req: Request, res: Response) => {
  const { gameId, userId } = req.body;

  const query = `
    select accepted, amount, offerer_id offerer, recipient_id recipient
    from offers
    where game_id = ${gameId}
    and accepted is not null
  `;

  pool
    .query(query)
    .then((result: QueryResult) =>
      res.status(200).send({ total: getUserWinningsTotal(result, userId) })
    );
};
