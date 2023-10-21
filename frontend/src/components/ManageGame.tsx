import { checkForGames } from '../queries/games';

const ManageGame = (props: any) => {
  const gameResults = checkForGames({ admin: 'an' });
  console.log('gameResults', gameResults);
  return null;
};

export default ManageGame;
