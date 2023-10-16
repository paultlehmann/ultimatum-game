import express, { Express, NextFunction, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import { IOffer } from './types';

const app: Express = express();
const port = 8008;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432
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
  //   console.log('getTestData hit')
  //   console.log('pool',pool)
  return pool
    .query('SELECT * FROM offers ORDER BY id ASC')
    .then((result: QueryResult) => {
      console.log('result', result);
      return result.rows;
    });
  // console.log('test',test)
  // return test.rows
  // .then((result: any) => console.log('result',result))
};

// getTestData()
//   .then((offers: IOffer[]) => {
//     console.log('dataGotten:', offers);
//   })
//   .catch((error) => {
//     console.log('failure');
//   });

// const passthrough = async () => await getTestData()
// async () => await passthrough().then((rez: any) => console.log('rez',rez))

// console.log('GTD return',(async () => await getTestData())());
// console.log('GTD return',getTestData())

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/test', (req: Request, res: Response) => {
  //   merchant_model.getMerchants()
  //   .then(response => {
  //     res.status(200).send(response);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   })

  console.log('resolver hit');

  getTestData()
    .then((offers: IOffer[]) => {
      console.log('dataGotten:', offers);
      return res.status(200).send(offers);
    })
    .catch((error) => {
      console.log('failure');
      return res.status(500).send(error);
    });
});

app.get('/test2', (req, res) => {
  console.log('test2 hit');
  return res.send({ text: 'Received a GET HTTP method' });
});

app.post('/test3', (req, res) => {
  const data = req.body;
  console.log('data', data);

  const { amount, game_id, offerer_id, round_number } = data;

  pool.query(`insert into offers (game_id, round_number, offerer_id, amount)
    values (${game_id}, ${round_number}, ${offerer_id}, ${amount})`);

  return res.send('Data Received: ' + JSON.stringify(data));
  // console.log('test3 req',req)
  // return res.send('Received a POST HTTP method');
});

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
//   });
