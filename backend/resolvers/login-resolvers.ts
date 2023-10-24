import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';

export const createUserResolver = () => (req: Request, res: Response) => {
  const { admin, username } = req.body;
  console.log('createUserResolver args', req.body);

  pool
    .query(`SELECT * FROM users where username = '${username}'`)
    .then((result: QueryResult) => {
      // console.log('user result', result);
      if (_.isEmpty(result.rows)) {
        pool
          .query(
            `insert into users (username, admin)
      values ('${username}',${admin})
      returning id`
          )
          .then((result: QueryResult) => {
            // console.log('create user result',result)
            console.log(`new user ${username} created`);
            return res
              .status(200)
              .send({ isAdmin: false, id: result.rows[0].id });
          });
        // console.log(`new user ${username} created`);
        // return res.status(200).send({ isAdmin: false });
      } else {
        // console.log('result.rows[0]', result.rows[0]);
        console.log(`user ${username} already exists`);
        console.log('and is an admin? ', result.rows[0].admin);
        return res.status(200).send({
          id: result.rows[0].id,
          isAdmin: result.rows[0].admin
        });
      }
    });

  // pool.query(`insert into users (username, admin)
  // values (${username},${admin})`);

  // return res.send('Data Received: ' + JSON.stringify(data));
};
