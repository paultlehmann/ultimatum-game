import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import _ from 'lodash';
import { pool } from '..';

// console.log('serverInfo',serverInfo)

// const { pool } = serverInfo

export const createUserResolver = () => (req: Request, res: Response) => {
  const { admin, username } = req.body;

  pool
    .query(`SELECT * FROM users where username = '${username}'`)
    .then((result: QueryResult) => {
      // console.log('user result', result);
      if (_.isEmpty(result.rows)) {
        pool.query(`insert into users (username, admin)
      values ('${username}',${admin})`);
        console.log(`new user ${username} created`);
        return res.status(200).send({ isAdmin: false });
      } else {
        console.log(`user ${username} already exists`);
        console.log('and is an admin? ', result.rows[0].admin);
        return res
          .status(200)
          .send({
            id: result.rows[0].id,
            isAdmin: result.rows[0].admin === 'true'
          });
      }
      // if(result.rows)
    });

  // pool.query(`insert into users (username, admin)
  // values (${username},${admin})`);

  // return res.send('Data Received: ' + JSON.stringify(data));
};
