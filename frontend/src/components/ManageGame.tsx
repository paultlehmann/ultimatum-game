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
import {
  checkAcceptStatuses,
  checkOfferStatuses,
  shuffleAndAssignOffers
} from '../queries/offers';

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
  const [offersIn, setOffersIn] = useState<string[]>([]);
  const [acceptsIn, setAcceptsIn] = useState<string[]>([]);

  useEffect(
    () => console.log('new participantNames', participantNames),
    [participantNames]
  );

  // const participantNames = gameState.participants

  useEffect(
    () => console.log('new ManageGame gameQueryResult', gameQueryResult),
    [gameQueryResult]
  );

  // useEffect(() => {
  //   console.log('participantNames UE outerhit');
  //   if (checkedForGames && _.isEmpty(participantNames) && gameState.id) {
  //     console.log('participantNames UE innerhit');
  //     getParticipantsByGame(gameState.id, setParticipantNames);
  //   }
  // }, [gameState.id, checkedForGames, JSON.stringify(participantNames)]);

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
              {_.pullAll(participantNames, offersIn).join(', ') || 'None'}
            </div>
            {_.isEmpty(offersIn) ||
            _.isEmpty(_.pullAll(participantNames, offersIn)) ? (
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
                    participantNames.forEach((participantName: string) =>
                      shuffleAndAssignOffers(
                        gameState.id,
                        gameState.round,
                        participantName
                      )
                    );

                    updateGame(gameState.id, 'accept');

                    setGameState({ ...gameState, stage: 'accept' });
                  }}
                >
                  Start Accept/Reject Phase
                </Button>
                {/* <ButtonWithRefresh
                  text={'Start Accept/Reject Phase'}
                  onClick={() => {
                    participantNames.forEach((participantName: string) =>
                      shuffleAndAssignOffers(
                        gameState.id,
                        gameState.round,
                        participantName
                      )
                    );

                    updateGame(gameState.id, 'accept');

                    setGameState({ ...gameState, stage: 'accept' });
                  }}
                /> */}
              </>
            )}
          </>
        );
      case 'accept':
        console.log('pullall result', _.pullAll(participantNames, acceptsIn));
        // console.log('participantNames', participantNames);
        console.log('acceptsIn', acceptsIn);
        return (
          <>
            <div>Has Accepted/Rejected: {acceptsIn.join(', ') || 'None'}</div>
            <div>
              Waiting For:{' '}
              {_.pullAll(participantNames, acceptsIn).join(', ') || 'None'}
            </div>
            {
              // _.isEmpty(acceptsIn) ||
              // _.isEmpty(_.pullAll(participantNames, acceptsIn))
              !_.isEqual(participantNames, acceptsIn) ? (
                <ButtonWithRefresh
                  onClick={() => {
                    console.log('calling checkAcceptStatuses');
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
                  <Button
                    onClick={() => {
                      participantNames.forEach((participantName: string) =>
                        shuffleAndAssignOffers(
                          gameState.id,
                          gameState.round,
                          participantName
                        )
                      );

                      updateGame(gameState.id, 'accept');

                      setGameState({ ...gameState, stage: 'accept' });
                    }}
                  >
                    Start Accept/Reject Phase
                  </Button>
                </>
              )
            }
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
        <Button variant={'contained'}>No</Button>
      </>
    );
  }
};

export default ManageGame;
