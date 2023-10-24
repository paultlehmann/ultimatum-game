import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ButtonWithRefresh from './ButtonWithRefresh';
import { addParticipantToGame, checkForGames } from '../queries/games';
import { IGameRow, IGameState, SetState, TGameStage } from '../types';

interface IProps {
  setGameState: SetState<IGameState>;
  userId: number;
}

const GameLobby = (props: IProps) => {
  const { setGameState, userId } = props;

  const [checkedForGames, setCheckedForGames] = useState<boolean>(false);
  const [gameQueryResult, setGameQueryResult] = useState<IGameRow | null>(null);

  useEffect(
    () => console.log('new GameLobby gameQueryResult', gameQueryResult),
    [gameQueryResult]
  );

  const stagesToCheck: TGameStage[] = ['pre', 'offer', 'accept'];

  // return (
  //   <>
  //     <h1>No games found!</h1>
  //     <ButtonWithRefresh
  //       onClick={() =>
  //         checkForGames(setGameQueryResult, { participant: userId, stages: stagesToCheck })
  //       }
  //       text={'Check Again'}
  //     />
  //   </>
  // );

  if (gameQueryResult) {
    // console.log('secondhit');
    console.log('gameQueryResult', gameQueryResult);
    const { admin, id, participants, round, stage } = gameQueryResult;

    if (participants.includes(userId)) {
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
                round,
                stage
              })
            }
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setCheckedForGames(false);
              setGameQueryResult(null);
            }}
            variant={'contained'}
          >
            No
          </Button>
        </>
      );
    } else if (stage === 'pre') {
      return (
        <>
          <div>Game available. Join game?</div>
          <Button
            variant={'contained'}
            style={{ margin: '10px 0px' }}
            onClick={() => {
              console.log('addParticipantToGame onClick hit');
              addParticipantToGame(id, userId);
              setGameState({
                admin,
                id,
                round,
                stage
              });
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setCheckedForGames(false);
              setGameQueryResult(null);
            }}
            variant={'contained'}
          >
            No
          </Button>
        </>
      );
    }
  }
  //  if (!checkedForGames)
  else {
    return (
      <ButtonWithRefresh
        onClick={() => {
          setCheckedForGames(true);
          checkForGames(setGameQueryResult, { stages: stagesToCheck });
        }}
        text={checkedForGames ? 'Check Again' : 'Check For Games'}
      />
    );
  }
};

export default GameLobby;
