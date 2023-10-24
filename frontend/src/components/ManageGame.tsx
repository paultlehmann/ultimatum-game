import { useEffect, useState } from 'react';
import {
  // Box,
  Button,
  Card,
  CardContent
} from '@mui/material';
import _ from 'lodash';
import ButtonWithRefresh from './ButtonWithRefresh';
import {
  checkForGames,
  createGame,
  getParticipantsByGame,
  updateGame
} from '../queries/games';
import { IGameRow, IGameState, SetState, TGameStage } from '../types';

interface IProps {
  gameState: IGameState;
  setGameState: SetState<IGameState>;
  userId: number;
}

const ManageGame = (props: IProps) => {
  const { gameState, setGameState, userId } = props;

  const [checkedForGames, setCheckedForGames] = useState<boolean>(false);
  const [gameQueryResult, setGameQueryResult] = useState<IGameRow | null>(null);
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  useEffect(
    () => console.log('new ManageGame gameQueryResult', gameQueryResult),
    [gameQueryResult]
  );

  const stages: TGameStage[] = ['pre', 'offer', 'accept'];

  //  checkForGames(setGameQueryResult, { admin: userId, stages });

  const getGameBoxContent = () => {
    switch (gameState.stage) {
      case 'pre':
        return (
          <>
            <div style={{ marginBottom: '5px' }}>
              Players ({participantNames.length}):{' '}
              {participantNames.join(', ') || 'None'}
            </div>
            <ButtonWithRefresh
              onClick={() =>
                getParticipantsByGame(gameState.id, setParticipantNames)
              }
              size={'medium'}
              text={'Refresh Player List'}
            />
            <br />
            <Button
              onClick={() => {
                updateGame(gameState.id, 'offer');
                setGameState({ ...gameState, stage: 'offer' });
              }}
              style={{ marginTop: '5px' }}
              variant={'contained'}
            >
              Start Game with Current Players
            </Button>
          </>
        );
    }
  };

  if (gameState.id) {
    return (
      <Card>
        <CardContent>
          <div>Game ID: {gameState.id}</div>
          <div>Round: {gameState.round}</div>
          <div>Stage: {gameState.stage}</div>
          {getGameBoxContent()}
        </CardContent>
      </Card>
    );
  }

  if (gameQueryResult) {
    console.log('secondhit');
    console.log('gameQueryResult', gameQueryResult);
    const { admin, id, round, stage } = gameQueryResult;
    return (
      <>
        <div>In-progress game found. Continue?</div>
        <Button
          variant={'contained'}
          style={{ margin: '10px 0px' }}
          onClick={() => {
            getParticipantsByGame(id, setParticipantNames);
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
        <Button variant={'contained'}>No</Button>
      </>
    );
  } else if (!checkedForGames) {
    return (
      <ButtonWithRefresh
        onClick={() => {
          setCheckedForGames(true);
          checkForGames(setGameQueryResult, { admin: userId, stages });
        }}
        text={'Check For Games'}
      />
    );
  } else {
    return (
      <>
        <div>No games found. Start new game?</div>
        <Button
          variant={'contained'}
          style={{ margin: '10px 0px' }}
          onClick={() => createGame(userId, [], setGameState)}
        >
          Yes
        </Button>
        <Button variant={'contained'}>No</Button>
      </>
    );
  }
};

export default ManageGame;
