import _ from 'lodash';
import { IGameRow, IGameState, SetState, TGameStage } from '../types';

interface IGameQueryOptions {
  admin?: number;
  participant?: number;
  stages?: TGameStage[];
}

export const checkForGames =
  // (ev: MouseEvent<HTMLButtonElement>) =>
  (
    setGameQueryResult: SetState<IGameRow | null>,
    options: IGameQueryOptions,
    setGameState?: SetState<IGameState>
  ) => {
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
      .then((result: IGameRow[]) => {
        if (!_.isEmpty(result)) {
          console.log('checkForGames result', result);
          setGameQueryResult(result[0]);
          if (setGameState) {
            setGameState((prevState: IGameState) => ({
              ...prevState,
              stage: result[0].stage,
              round: result[0].round
            }));
          }
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

export const getParticipantsByGame = (
  gameId: number,
  setParticipantNames: SetState<string[]>
) => {
  fetch('http://localhost:8008/get-participants-by-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId
    })
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return await response.json();
    })
    .then((result: { username: string }[]) => {
      console.log('getParticipantsByGame result', result);
      setParticipantNames(
        result.map((result: { username: string }) => result.username)
      );
    });
};

export const updateGame = (gameId: number, newStage: TGameStage) => {
  fetch('http://localhost:8008/update-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      newStage
    })
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return await response.json();
    })
    .then((result: { username: string }[]) => {
      console.log('updateGame result', result);
    });
};

export const addParticipantToGame = (gameId: number, userId: number) => {
  console.log('addParticipantToGame query hit');
  fetch('http://localhost:8008/add-participant-to-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      userId
    })
  });
};
