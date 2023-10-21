import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';

const GameLobby = (props: any) => {
  const admin = 6;
  const participant = 1;
  const stage = 'pre';
  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh
        onClick={() => checkForGames({ admin, participant, stage })}
        text={'Check Again'}
      />
    </>
  );
};

export default GameLobby;
