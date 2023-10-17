import express, { Express, NextFunction, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import _ from 'lodash';
import { IOffer } from './types';

const app: Express = express();
const port = 8008;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432
});

const getTestData = async () => {
  return pool
    .query('SELECT * FROM offers ORDER BY id ASC')
    .then((result: QueryResult) => {
      //   console.log('result', result);
      return result.rows;
    });
};

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers'
  );
  next();
});

app.get('/get-offers', (req: Request, res: Response) => {
  //   console.log('resolver hit');

  getTestData()
    .then((offers: IOffer[]) => {
      //   console.log('dataGotten:', offers);
      return res.status(200).send(offers);
    })
    .catch((error) => {
      console.error('failure');
      return res.status(500).send(error);
    });
});

// app.get('/test2', (req, res) => {
//   console.log('test2 hit');
//   return res.send({ text: 'Received a GET HTTP method' });
// });

app.post('/save-offer', (req: Request, res: Response) => {
  const data = req.body;
  //   console.log('data', data);

  const { amount, game_id, offerer_id, round_number } = data;

  pool.query(`insert into offers (game_id, round_number, offerer_id, amount)
    values (${game_id}, ${round_number}, ${offerer_id}, ${amount})`);

  return res.send('Data Received: ' + JSON.stringify(data));
});

app.post('/create-user', (req: Request, res: Response) => {
  const data = req.body;
  // console.log('data', data);

  const { admin, username } = data;

  pool
    .query(`SELECT * FROM users where username = '${username}'`)
    .then((result: QueryResult) => {
      // console.log('user result',result)
      if (_.isEmpty(result.rows)) {
        pool.query(`insert into users (username, admin)
    values ('${username}',${admin})`);
        console.log(`new user ${username} created`);
      } else {
        console.log(`user ${username} already exists`);
      }
      // if(result.rows)
    });

  // pool.query(`insert into users (username, admin)
  // values (${username},${admin})`);

  // return res.send('Data Received: ' + JSON.stringify(data));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
