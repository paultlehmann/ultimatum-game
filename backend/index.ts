import express, { Express, NextFunction, Request, Response } from 'express';
import {
  Pool
  // QueryResult
} from 'pg';
// import _ from 'lodash';
// import { IOffer } from './types';
import {
  addParticipantToGameResolver,
  advanceRoundResolver,
  checkForGamesResolver,
  createGameResolver,
  getParticipantsByGameResolver,
  updateGameResolver
} from './resolvers/games-resolvers';
import { createUserResolver } from './resolvers/login-resolvers';
import {
  acceptOrRejectOfferResolver,
  checkAcceptStatusesResolver,
  checkOfferStatusesResolver,
  getAllOffersResolver,
  getOfferHistoryResolver,
  getOffersResolver,
  saveOfferResolver,
  shuffleAndAssignOffersResolver
} from './resolvers/offers-resolvers';

const app: Express = express();
const backendPort = 8008;
const dbPort = 5432;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: dbPort
});

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

app.post('/check-for-games', checkForGamesResolver());

app.post('/get-offers', getOffersResolver());

app.post('/create-user', createUserResolver());

app.post('/save-offer', saveOfferResolver());

app.post('/create-game', createGameResolver());

app.post('/get-participants-by-game', getParticipantsByGameResolver());

app.post('/update-game', updateGameResolver());

app.post('/add-participant-to-game', addParticipantToGameResolver());

app.post('/check-offer-statuses', checkOfferStatusesResolver());

app.post('/check-accept-statuses', checkAcceptStatusesResolver());

app.post('/shuffle-and-assign-offers', shuffleAndAssignOffersResolver());

app.post('/accept-or-reject-offer', acceptOrRejectOfferResolver());

app.post('/advance-round', advanceRoundResolver());

app.post('/get-offer-history', getOfferHistoryResolver());

app.post('/get-all-offers', getAllOffersResolver());

// app.get('/get-offers', (req: Request, res: Response) => {
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
// });

// app.get('/test2', (req, res) => {
//   console.log('test2 hit');
//   return res.send({ text: 'Received a GET HTTP method' });
// });

// app.get('/check-for-games', (req: Request, res: Response) => {
//     // console.log('resolver hit');

//   const checkForGames = async () => {
//     return pool
//       .query("SELECT * FROM games WHERE stage = 'pre'")
//       .then((result: QueryResult) => {
//           console.log('checkForGames result', result);
//         return result.rows;
//       });
//   };
//   checkForGames();
// })

// app.post('/save-offer', (req: Request, res: Response) => {
//   const { amount, game_id, offerer_id, round_number } = req.body;

//   pool.query(`insert into offers (game_id, round_number, offerer_id, amount)
//     values (${game_id}, ${round_number}, ${offerer_id}, ${amount})`);

//   return res.send('Data Received: ' + JSON.stringify(req.body));
// });

// app.post('/create-user', (req: Request, res: Response) => {
//   const { admin, username } = req.body;

//   pool
//     .query(`SELECT * FROM users where username = '${username}'`)
//     .then((result: QueryResult) => {
//       console.log('user result', result);
//       if (_.isEmpty(result.rows)) {
//         pool.query(`insert into users (username, admin)
//     values ('${username}',${admin})`);
//         console.log(`new user ${username} created`);
//         return res.send(false);
//       } else {
//         console.log(`user ${username} already exists`);
//         console.log('and is an admin? ', result.rows[0].admin);
//         return res.send(result.rows[0].admin);
//       }
//       // if(result.rows)
//     });

//   // pool.query(`insert into users (username, admin)
//   // values (${username},${admin})`);

//   // return res.send('Data Received: ' + JSON.stringify(data));
// });

app.listen(backendPort, () => {
  console.log(`Server is running at http://localhost:${backendPort}`);
});
