import { checkForGames } from '../queries/games';

const ManageGame = (props: any) => {
  const gameResults = checkForGames({ admin: 6 });
  console.log('gameResults', gameResults);
  return null;
};

export default ManageGame;
