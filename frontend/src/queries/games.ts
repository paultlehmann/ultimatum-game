import _ from 'lodash';
import { IGameState, SetState, TGameStage } from '../types';

interface IGameQueryOptions {
  admin?: number;
  participant?: number;
  stages?: TGameStage[];
}

export const checkForGames =
  // (ev: MouseEvent<HTMLButtonElement>) =>
  (setResult: SetState<IGameState | null>, options: IGameQueryOptions) => {
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
      .then((response: Response) => {
        // console.log('response', response);
        // console.log('hit1');
        return response.json();
      })
      .then((result: IGameState[]) => {
        if (!_.isEmpty(result)) {
          // console.log('hit2');
          setResult(result[0]);
        }
        // return result;
      });
  };

export const createGame = (
  admin: number,
  participants: number[],
  setGameState: SetState<IGameState>
) => {
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
      return await response.json();
    })
    .then((result: any) => {
      console.log('createGame result', result);
      setGameState({
        admin,
        id: result.id,
        round: 1,
        stage: 'pre'
      });
    });
};
