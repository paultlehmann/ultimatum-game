import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';

const GameLobby = (props: any) => {
  return (
    <>
      <h1>No games found!</h1>
      <ButtonWithRefresh onClick={checkForGames} text={'Check Again'} />
    </>
  );
};

export default GameLobby;
