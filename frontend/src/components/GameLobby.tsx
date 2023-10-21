import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';
import { TGameStage } from '../types';

const GameLobby = (props: any) => {
  const admin = 6;
  const participant = 1;
  const stages: TGameStage[] = ['pre'];

  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh
        onClick={() => checkForGames({ admin, participant, stages })}
        text={'Check Again'}
      />
    </>
  );
};

export default GameLobby;
