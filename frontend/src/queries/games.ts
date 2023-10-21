// import { MouseEvent } from 'react'
import { TGameStage } from '../types';

interface IGameQueryOptions {
  admin?: string;
  participant?: number;
  stage?: TGameStage;
}

export const checkForGames =
  // (ev: MouseEvent<HTMLButtonElement>) =>
  (options: IGameQueryOptions) => {
    console.log('checkForGames hit');
    fetch('http://localhost:8008/check-for-games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     admin,
      //     participants,
      //     stage
      //   })
      // })
      body: JSON.stringify(options)
    })
      .then(async (response: Response) => {
        // console.log('response', response);
        // console.log('response.text()', await response.text());
        return response.text();
      })
      .then((result: any) => {
        console.log('checkForGames result', result);
      });
  };

export const createGame = (admin: number, participants: number[]) => {
  fetch('http://localhost:8008/create-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      participants
    })
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return await response.text();
    })
    .then((result: any) => {
      console.log('createGame result', result);
    });
};
