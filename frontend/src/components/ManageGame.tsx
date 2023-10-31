import { useState } from 'react';
import { Button, Card, CardContent, Grid } from '@mui/material';
import _ from 'lodash';
import ButtonWithRefresh from './ButtonWithRefresh';
import {
  advanceRound,
  checkForGames,
  createGame,
  getParticipantsByGame,
  updateGame
} from '../queries/games';
import { IGameRow, IGameState, SetState, TGameStage } from '../types';
import {
  checkAcceptStatuses,
  checkOfferStatuses,
  shuffleAndAssignOffers
} from '../queries/offers';
import Standings from './Standings';

interface IProps {
  gameState: IGameState;
  setGameState: SetState<IGameState>;
  userId: number;
}

const ManageGame = (props: IProps) => {
  const { gameState, setGameState, userId } = props;

  const [checkedForGames, setCheckedForGames] = useState<boolean>(false);
  const [gameQueryResult, setGameQueryResult] = useState<IGameRow | null>(null);
  const [offersIn, setOffersIn] = useState<string[]>([]);
  const [acceptsIn, setAcceptsIn] = useState<string[]>([]);

  const participantNames = gameState.participantNames || [];

  const stages: TGameStage[] = ['pre', 'offer', 'accept'];

  const getStageName = (shortForm: TGameStage) => {
    switch (shortForm) {
      case 'pre':
        return 'Pre-Game';
      case 'offer':
        return 'Making Offers';
      case 'accept':
        return 'Accepting/Rejecting Offers';
      case 'post':
        return 'Post-Game';
    }
  };

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
              onClick={() => getParticipantsByGame(gameState.id, setGameState)}
              size={'medium'}
              text={'Refresh Player List'}
            />
            {participantNames.length > 2 && (
              <>
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
            )}
          </>
        );
      case 'offer':
        return (
          <>
            <div>Offers In: {offersIn.join(', ') || 'None'}</div>
            <div>
              Waiting For:{' '}
              {_.pullAll([...participantNames], [...offersIn]).join(', ') ||
                'None'}
            </div>
            {_.pullAll([...participantNames], [...offersIn]).join(', ') ||
            'None' !== 'None' ? (
              <ButtonWithRefresh
                onClick={() =>
                  checkOfferStatuses(gameState.id, gameState.round, setOffersIn)
                }
                text={'Refresh'}
              />
            ) : (
              <>
                <div>All Offers In!</div>
                <Button
                  variant={'contained'}
                  onClick={() => {
                    shuffleAndAssignOffers(
                      gameState.id,
                      gameState.round,
                      participantNames,
                      setGameState
                    );

                    updateGame(gameState.id, 'accept');

                    setOffersIn([]);
                  }}
                >
                  Start Accept/Reject Phase
                </Button>
              </>
            )}
          </>
        );
      case 'accept':
        return (
          <>
            <div>Has Accepted/Rejected: {acceptsIn.join(', ') || 'None'}</div>
            <div>
              Waiting For:{' '}
              {_.pullAll([...participantNames], [...acceptsIn]).join(', ') ||
                'None'}
            </div>
            {_.pullAll([...participantNames], [...acceptsIn]).join(', ') ||
            'None' !== 'None' ? (
              <ButtonWithRefresh
                onClick={() => {
                  checkAcceptStatuses(
                    gameState.id,
                    gameState.round,
                    setAcceptsIn
                  );
                }}
                text={'Refresh'}
              />
            ) : (
              <>
                <div>All Offers Accepted/Rejected!</div>
                <Grid
                  container={true}
                  direction={'row'}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '5px'
                  }}
                >
                  <Grid item={true}>
                    <Button
                      variant={'contained'}
                      color={'success'}
                      onClick={() => {
                        advanceRound(
                          gameState.id,
                          gameState.round,
                          setGameState
                        );
                        setAcceptsIn([]);
                      }}
                    >
                      Next Round
                    </Button>
                  </Grid>
                  <Grid item={true}>
                    <Button
                      variant={'contained'}
                      color={'error'}
                      onClick={() => {
                        updateGame(gameState.id, 'post');
                        setGameState({ ...gameState, stage: 'post' });
                      }}
                    >
                      End Game
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        );
    }
  };

  if (gameState.stage === 'post') {
    return (
      <>
        <Standings
          gameId={gameState.id}
          setCheckedForGames={setCheckedForGames}
          setGameQueryResult={setGameQueryResult}
          setGameState={setGameState}
        />
      </>
    );
  }

  if (gameState.id) {
    return (
      <Card>
        <CardContent>
          <div>Game ID: {gameState.id}</div>
          <div>Round: {gameState.round}</div>
          <div>Stage: {getStageName(gameState.stage)}</div>
          {getGameBoxContent()}
        </CardContent>
      </Card>
    );
  }

  if (gameQueryResult) {
    const { admin, id, round, stage } = gameQueryResult;
    return (
      <>
        <div>In-progress game found. Continue?</div>
        <Button
          variant={'contained'}
          style={{ margin: '10px 0px' }}
          onClick={() => {
            getParticipantsByGame(id, setGameState);
            setGameState({
              ...gameState,
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
          variant={'contained'}
          onClick={() => {
            updateGame(id, 'post');
            setGameQueryResult(null);
          }}
        >
          No (ends game without winner)
        </Button>
      </>
    );
  } else if (!checkedForGames) {
    return (
      <ButtonWithRefresh
        onClick={() => {
          setCheckedForGames(true);
          checkForGames({ admin: userId, stages }, setGameQueryResult);
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
        <Button variant={'contained'} onClick={() => setCheckedForGames(false)}>
          No
        </Button>
      </>
    );
  }
};

export default ManageGame;
