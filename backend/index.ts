import express, { Express, NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';
import 'dotenv/config';
import {
  addParticipantToGameResolver,
  advanceRoundResolver,
  checkForGamesResolver,
  createGameResolver,
  getParticipantsByGameResolver,
  updateGameResolver
} from './resolvers/games-resolvers';
import {
  createUserResolver,
  updateWinningsResolver
} from './resolvers/login-resolvers';
import {
  acceptOrRejectOfferResolver,
  checkAcceptStatusesResolver,
  checkIfSingleOfferAcceptedResolver,
  checkOfferStatusesResolver,
  getAllOffersResolver,
  getOfferHistoryResolver,
  getOffersResolver,
  saveOfferResolver,
  shuffleAndAssignOffersResolver
} from './resolvers/offers-resolvers';

const app: Express = express();
const backendPort = process.env.VITE_REACT_APP_BACKEND_PORT;

export const pool = new Pool({
  user: process.env.VITE_REACT_APP_DB_USER,
  host: process.env.VITE_REACT_APP_DB_HOST,
  database: process.env.VITE_REACT_APP_DB_NAME,
  password: process.env.VITE_REACT_APP_DB_PASSWORD,
  port: Number(process.env.VITE_REACT_APP_DB_PORT)
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

app.post(
  '/check-if-single-offer-accepted',
  checkIfSingleOfferAcceptedResolver()
);

app.post('/update-winnings', updateWinningsResolver());

app.listen(backendPort, () => {
  console.log(
    `Server is running at http://${process.env.VITE_REACT_APP_DB_HOST}:${backendPort}`
  );
});
