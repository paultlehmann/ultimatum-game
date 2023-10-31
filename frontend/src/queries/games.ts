import _ from 'lodash';
import { IGameRow, IGameState, SetState, TGameStage } from '../types';

interface IGameQueryOptions {
  admin?: number;
  id?: number;
  participant?: number;
  stages?: TGameStage[];
}

const dbHost = import.meta.env.VITE_REACT_APP_DB_HOST;
const backendPort = import.meta.env.VITE_REACT_APP_BACKEND_PORT;

export const checkForGames = (
  options: IGameQueryOptions,
  setGameQueryResult?: SetState<IGameRow | null>,
  setGameState?: SetState<IGameState>
) => {
  fetch(`http://${dbHost}:${backendPort}/check-for-games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((result: IGameRow[]) => {
      if (!_.isEmpty(result)) {
        if (setGameQueryResult) {
          setGameQueryResult(result[0]);
        }
        if (setGameState) {
          setGameState((prevState: IGameState) => ({
            ...prevState,
            stage: result[0].stage,
            round: result[0].round
          }));
        }
      }
    });
};

export const createGame = (
  admin: number,
  participants: number[],
  setGameState: SetState<IGameState>
) => {
  fetch(`http://${dbHost}:${backendPort}/create-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      participants
    })
  })
    .then(async (response: Response) => {
      return await response.json();
    })
    .then((result: any) => {
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
  setGameState: SetState<IGameState>
) => {
  fetch(`http://${dbHost}:${backendPort}/get-participants-by-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId
    })
  })
    .then(async (response: Response) => {
      return await response.json();
    })
    .then((result: { username: string }[]) => {
      const participantNames = result.map(
        (result: { username: string }) => result.username
      );

      if (!_.isEmpty(participantNames)) {
        setGameState((prevState: IGameState) => ({
          ...prevState,
          participantNames
        }));
      }
    });
};

export const updateGame = (gameId: number, newStage: TGameStage) => {
  fetch(`http://${dbHost}:${backendPort}/update-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      newStage
    })
  });
};

export const addParticipantToGame = (gameId: number, userId: number) => {
  fetch(`http://${dbHost}:${backendPort}/add-participant-to-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      userId
    })
  });
};

export const advanceRound = (
  gameId: number,
  currentRound: number,
  setGameState: SetState<IGameState>
) => {
  fetch(`http://${dbHost}:${backendPort}/advance-round`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId,
      currentRound
    })
  }).then(async () => {
    setGameState((prevState: IGameState) => ({
      ...prevState,
      stage: 'offer',
      round: currentRound + 1
    }));
  });
};
