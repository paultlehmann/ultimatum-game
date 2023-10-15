import express, { Express, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import { IOffer } from './types';

const app: Express = express();
const port = 5432;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port
});

// const getTestData = async () => {
//   return new Promise((resolve, reject) => {
//     pool.query("SELECT * FROM offers ORDER BY id ASC", (error, results) => {
//       if (error) {
//         return reject(error);
//       }
//       if (results) {
//         // console.log('results',results)
//         console.log("results.rows", results.rows);
//         return resolve(results.rows);
//       }
//     });
//   });
// };

// const getTestData = () => {
//     return new Promise(function(resolve, reject) {
//       pool.query('SELECT * FROM offers ORDER BY id ASC', (error, results) => {
//         if (error) {
//           reject(error)
//         }
//         resolve(results.rows);
//       })
//     })
//   }

const getTestData = async () => {
  // const test = await pool.query('SELECT * FROM offers ORDER BY id ASC')
  // await pool.query('SELECT * FROM offers ORDER BY id ASC').then((response: any) => {
  //     console.log('response',response)
  //     return response.rows
  // })
  return pool
    .query('SELECT * FROM offers ORDER BY id ASC')
    .then((response: QueryResult) => {
      // console.log('response',response)
      return response.rows;
    });
  // console.log('test',test)
  // return test.rows
  // .then((result: any) => console.log('result',result))
};

getTestData()
  .then((offers: IOffer[]) => {
    console.log('dataGotten:', offers);
  })
  .catch((error) => {
    console.log('failure');
  });

// const passthrough = async () => await getTestData()
// async () => await passthrough().then((rez: any) => console.log('rez',rez))

// console.log('GTD return',(async () => await getTestData())());
// console.log('GTD return',getTestData())
