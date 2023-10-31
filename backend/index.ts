import express, { Express, NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';
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

app.listen(backendPort, () => {
  console.log(`Server is running at http://localhost:${backendPort}`);
});
