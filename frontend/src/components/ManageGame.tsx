import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import _ from 'lodash';
import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';
import { IGameState, SetState, TGameStage } from '../types';

interface IProps {
  setGameState: SetState<IGameState>;
  userId: number;
}

const ManageGame = (props: IProps) => {
  const { setGameState, userId } = props;

  const [checkedForGames, setCheckedForGames] = useState<boolean>(false);
  const [gameQueryResult, setGameQueryResult] = useState<IGameState | null>(
    null
  );

  useEffect(
    () => console.log('new ManageGame gameQueryResult', gameQueryResult),
    [gameQueryResult]
  );

  const stages: TGameStage[] = ['pre', 'offer', 'accept'];

  //  checkForGames(setGameQueryResult, { admin: userId, stages });

  if (gameQueryResult) {
    console.log('secondhit');
    console.log('gameQueryResult', gameQueryResult);
    const { admin, id, stage } = gameQueryResult;
    return (
      <>
        <div>In-progress game found. Continue?</div>
        <Button
          variant={'contained'}
          style={{ margin: '10px 0px' }}
          onClick={() =>
            setGameState({
              admin,
              id,
              round: 0,
              stage
            })
          }
        >
          Yes
        </Button>
        <Button variant={'contained'}>No</Button>
      </>
    );
  } else if (!checkedForGames) {
    return (
      <>
        <ButtonWithRefresh
          onClick={() => {
            setCheckedForGames(true);
            checkForGames(setGameQueryResult, { admin: userId, stages });
          }}
          text={'Check For Games'}
        />
      </>
    );
  } else {
    return (
      <>
        <div>No games found. Start new game?</div>
      </>
    );
  }
};

export default ManageGame;
