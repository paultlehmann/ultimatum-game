import { useEffect, useState } from 'react';
import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';
import { IGameState, TGameStage } from '../types';

const GameLobby = (props: any) => {
  const [gameQueryResult, setGameQueryResult] = useState<IGameState | null>(
    null
  );

  useEffect(
    () => console.log('new GameLobby gameQueryResult', gameQueryResult),
    [gameQueryResult]
  );

  const admin = 6;
  const participant = 1;
  const stages: TGameStage[] = ['pre'];

  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh
        onClick={() =>
          checkForGames(setGameQueryResult, { admin, participant, stages })
        }
        text={'Check Again'}
      />
    </>
  );
};

export default GameLobby;
