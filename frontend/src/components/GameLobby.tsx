import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';

const GameLobby = (props: any) => {
  const admin = 6;
  const participants = [1, 2, 3, 4, 5];
  const stage = 'pre';
  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh
        onClick={() => checkForGames({ admin, participants, stage })}
        text={'Check Again'}
      />
    </>
  );
};

export default GameLobby;
