import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';

const GameLobby = (props: any) => {
  const admin = 6;
  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh
        onClick={() => checkForGames({ admin })}
        text={'Check Again'}
      />
    </>
  );
};

export default GameLobby;
