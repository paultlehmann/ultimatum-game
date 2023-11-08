import _ from 'lodash';
import {
  IGameState,
  ILastOfferStatus,
  IOffer,
  IOpponentHistory,
  IStandingsRow,
  SetState
} from '../types';

interface ILastRoundOffer {
  accepted: boolean;
  amount: number;
  role: 'offerer' | 'recipient';
}

const dbHost = import.meta.env.VITE_REACT_APP_DB_HOST;
const backendPort = import.meta.env.VITE_REACT_APP_BACKEND_PORT;

export const getOffers = (
  setOffer: SetState<IOffer | null>,
  gameId: number,
  round: number,
  id?: number,
  recipient?: number
) => {
  fetch(`http://${dbHost}:${backendPort}/get-offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round,
      id,
      recipient
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((data: any) => {
      const { id, amount } = data.rows[0];
      setOffer({
        id,
        amount
      });
    });
};

export const saveOffer = (
  amount: number,
  gameId: number,
  round: number,
  userId: number
) => {
  fetch(`http://${dbHost}:${backendPort}/save-offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      game_id: gameId,
      offerer_id: userId,
      round_number: round
    })
  });
};

export const checkOfferStatuses = (
  gameId: number,
  round: number,
  setOffersIn: SetState<string[]>
) => {
  fetch(`http://${dbHost}:${backendPort}/check-offer-statuses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((usersWithOffersMade: any) => {
      setOffersIn(
        usersWithOffersMade.rows.map(
          (user: { username: string }) => user.username
        )
      );
    });
};

export const checkAcceptStatuses = (
  gameId: number,
  round: number,
  setAcceptsIn: SetState<string[]>
) => {
  fetch(`http://${dbHost}:${backendPort}/check-accept-statuses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((usersWhoHaveAccepted: any) => {
      setAcceptsIn((existingAccepts: string[]) => {
        const existingAcceptsAsUserObjects = existingAccepts?.map(
          (existingAccept: string) => ({
            username: existingAccept,
            accepted: true
          })
        );
        const mergedArray = _.uniqBy(
          [...existingAcceptsAsUserObjects, ...usersWhoHaveAccepted.rows],
          'username'
        );

        return mergedArray
          .filter((user: { username: string; accepted?: boolean }) => {
            return !_.isNull(user.accepted) && !_.isUndefined(user.accepted);
          })
          ?.map((user: { username: string; accepted?: boolean }) => {
            return user.username;
          });
      });
    });
};

export const shuffleAndAssignOffers = (
  gameId: number,
  round: number,
  participantNames: string[],
  setGameState: SetState<IGameState>
) => {
  fetch(`http://${dbHost}:${backendPort}/shuffle-and-assign-offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round,
      participantNames
    })
  }).then(async () => {
    setGameState((prevState: IGameState) => ({
      ...prevState,
      stage: 'accept'
    }));
  });
};

export const acceptOrRejectOffer = (
  userId: number,
  gameId: number,
  round: number,
  acceptOrReject: 'accept' | 'reject'
) => {
  fetch(`http://${dbHost}:${backendPort}/accept-or-reject-offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      acceptOrReject,
      gameId,
      round,
      userId
    })
  });
};

export const getOfferHistory = (
  setOpponentHistory: SetState<IOpponentHistory[]>,
  userId: number,
  gameId: number,
  round: number
) => {
  fetch(`http://${dbHost}:${backendPort}/get-offer-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round,
      userId
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((data: any) => {
      setOpponentHistory(data.rows);
    });
};

export const getAllOffers = (
  setResults: SetState<IStandingsRow[]>,
  gameId: number
) => {
  fetch(`http://${dbHost}:${backendPort}/get-all-offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((data: IStandingsRow[]) => {
      setResults(_.orderBy(data, ['winnings'], ['desc']));
    });
};

export const checkIfSingleOfferAccepted = (
  gameId: number,
  userId: number,
  round: number,
  setLastOfferStatus: SetState<ILastOfferStatus | null>
) => {
  console.log('checkIfSingleOfferAccepted hit');
  fetch(`http://${dbHost}:${backendPort}/check-if-single-offer-accepted`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      userId,
      round
    })
  })
    .then(async (response: Response) => {
      return response.json();
    })
    .then((data: ILastRoundOffer[]) => {
      console.log('offer check data', data);

      // @ts-ignore
      const myOfferRow: ILastRoundOffer = data.rows.find(
        (row: ILastRoundOffer) => row.role === 'offerer'
      );

      // @ts-ignore
      const offerToMeRow: ILastRoundOffer = data.rows.find(
        (row: ILastRoundOffer) => row.role === 'recipient'
      );

      setLastOfferStatus({
        myOfferAccepted: myOfferRow.accepted,
        myOfferAmount: myOfferRow.amount,
        offerToMeAccepted: offerToMeRow.accepted,
        offerToMeAmount: offerToMeRow.amount
      });
    });
};
