import _ from 'lodash';
import {
  IGameState,
  IOffer,
  IOpponentHistory,
  IStandingsRow,
  SetState
} from '../types';

export const getOffers = (
  setOffer: SetState<IOffer | null>,
  gameId: number,
  round: number,
  id?: number,
  recipient?: number
) => {
  fetch('http://localhost:8008/get-offers', {
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
  fetch('http://localhost:8008/save-offer', {
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
  fetch('http://localhost:8008/check-offer-statuses', {
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
  fetch('http://localhost:8008/check-accept-statuses', {
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
  fetch('http://localhost:8008/shuffle-and-assign-offers', {
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
  fetch('http://localhost:8008/accept-or-reject-offer', {
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
  fetch('http://localhost:8008/get-offer-history', {
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
  fetch('http://localhost:8008/get-all-offers', {
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
