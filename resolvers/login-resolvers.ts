import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';

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
