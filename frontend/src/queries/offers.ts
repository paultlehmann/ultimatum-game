import _ from 'lodash';
import { IGameState, IOffer, SetState } from '../types';

// export const getOffers = (setOfferData: (newVal: any) => void) => {
//   fetch('http://localhost:8008/get-offers')
//     .then(async (response: Response) => {
//       // console.log('response', response);
//       // console.log('response.text()', await response.text());
//       return response.text();
//     })
//     .then((data) => {
//       setOfferData(data);
//     });
// };

export const getOffers = (
  setOffer: SetState<IOffer | null>,
  gameId: number,
  round: number,
  id?: number,
  recipient?: number
) => {
  console.log('getOffers hit');
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
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.json();
    })
    .then((data: any) => {
      const { id, amount } = data.rows[0];
      setOffer({
        id,
        amount
      });
      // console.log('getOffers return', data);
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
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.json();
    })
    .then((usersWhoHaveAccepted: any) => {
      console.log('checkAcceptStatuses return', usersWhoHaveAccepted);
      setAcceptsIn((existingAccepts: string[]) => {
        console.log('existingAccepts', existingAccepts);
        // return usersWhoHaveAccepted.rows &&
        // [...existingAccepts, usersWhoHaveAccepted.rows]
        // return existingAccepts.concat(usersWhoHaveAccepted.rows.map((user: { username: string; accepted?: boolean }) => user.username))
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
        console.log('mergedArray', mergedArray);
        return (
          mergedArray
            // .filter((user: { username: string; accepted?: boolean }, index: number) => [...existingAcceptsAsUserObjects, ...usersWhoHaveAccepted.rows].indexOf(user) === index)
            .filter(
              // (user: { username: string; accepted?: boolean }) => {
              (user: { username: string; accepted?: boolean }) => {
                console.log('filter hit', user);
                return (
                  !_.isNull(user.accepted) && !_.isUndefined(user.accepted)
                );
              }
              // )?.map((user: { username: string; accepted?: boolean }) => {
            )
            ?.map((user: { username: string; accepted?: boolean }) => {
              console.log('map hit', user);
              // if (!_.isNull(user.accepted)) {
              return user.username;
              // }
            })
        );
      });
    });
};

export const shuffleAndAssignOffers = (
  gameId: number,
  round: number,
  userName: string,
  setGameState: SetState<IGameState>
) => {
  console.log('shuffleAndAssignOffers hit');
  fetch('http://localhost:8008/shuffle-and-assign-offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      round,
      userName
    })
  }).then(async () => {
    // console.log('response', response);
    // console.log('response.text()', await response.text());
    // return response.text();
    setGameState((prevState: IGameState) => ({
      ...prevState,
      stage: 'accept'
    }));
  });
  // .then((data: any) => {
  //   console.log('shuffleAndAssignOffers data', data);
  // });
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
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.json();
    })
    .then((data: any) => {
      console.log('acceptOrRejectOffer data', data);
    });
};
