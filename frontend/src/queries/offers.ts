import { SetState } from '../types';

export const getOffers = (setOfferData: (newVal: any) => void) => {
  fetch('http://localhost:8008/get-offers')
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.text();
    })
    .then((data) => {
      setOfferData(data);
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
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.json();
    })
    .then((usersWithOffersMade: any) => {
      console.log('checkOfferStatuses return', usersWithOffersMade);
      setOffersIn(
        usersWithOffersMade.rows.map(
          (user: { username: string }) => user.username
        )
      );
    });
};

export const shuffleAndAssignOffers = (
  gameId: number,
  round: number,
  userName: string
) => {
  fetch('http://localhost:8008/shuffle-and-assign-offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round,
      userName
    })
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.json();
    })
    .then((data: any) => {
      console.log('shuffleAndAssignOffers data', data);
    });
};
