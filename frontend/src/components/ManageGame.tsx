import { checkForGames } from '../queries/games';
import { TGameStage } from '../types';

interface IProps {
  userId: number;
}

const ManageGame = (props: IProps) => {
  const { userId } = props;
  const stages: TGameStage[] = ['pre', 'offer', 'accept'];

  const gameResults = checkForGames({ admin: userId, stages });
  console.log('gameResults', gameResults);
  return null;
};

export default ManageGame;
