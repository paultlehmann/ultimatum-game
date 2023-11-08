import { useState } from 'react';
import { Button } from '@mui/material';
import ButtonWithRefresh from './ButtonWithRefresh';
import AcceptOffer from './AcceptOffer';
import MakeOffer from './MakeOffer';
import { addParticipantToGame, checkForGames } from '../queries/games';
import {
  IGameRow,
  IGameState,
  ILastOfferStatus,
  IUser,
  SetState,
  TGameStage
} from '../types';
import Standings from './Standings';

interface IProps {
  gameState: IGameState;
  setGameState: SetState<IGameState>;
  setLastOfferStatus: SetState<ILastOfferStatus | null>;
  setWinnings: SetState<number>;
  user: IUser;
}

const GameLobby = (props: IProps) => {
  const { gameState, setGameState, setLastOfferStatus, setWinnings, user } =
    props;

  const { id: userId, userName } = user;

  const [checkedForGames, setCheckedForGames] = useState<boolean>(false);
  const [gameQueryResult, setGameQueryResult] = useState<IGameRow | null>(null);

  const stagesToCheck: TGameStage[] = ['pre', 'offer', 'accept'];

  if (gameState.id) {
    switch (gameState.stage) {
      case 'pre':
        return (
          <>
            <div>Host has not started game yet.</div>
            <ButtonWithRefresh
              onClick={() =>
                checkForGames(
                  { participant: userId, stages: stagesToCheck },
                  setGameQueryResult,
                  setGameState
                )
              }
              text={'Check Again'}
            />
          </>
        );
      case 'offer':
        return (
          <MakeOffer
            gameState={gameState}
            setGameState={setGameState}
            setLastOfferStatus={setLastOfferStatus}
            setWinnings={setWinnings}
            userId={userId}
          />
        );
      case 'accept':
        return (
          <AcceptOffer
            gameState={gameState}
            setGameState={setGameState}
            userId={userId}
          />
        );
      case 'post':
      default:
        return (
          <Standings
            gameId={gameState.id}
            setCheckedForGames={setCheckedForGames}
            setGameQueryResult={setGameQueryResult}
            setGameState={setGameState}
            setLastOfferStatus={setLastOfferStatus}
            setWinnings={setWinnings}
            userName={userName}
          />
        );
    }
  }

  if (gameQueryResult) {
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
  } else {
    return (
      <ButtonWithRefresh
        onClick={() => {
          setCheckedForGames(true);
          checkForGames({ stages: stagesToCheck }, setGameQueryResult);
        }}
        text={checkedForGames ? 'Check Again' : 'Check For Games'}
      />
    );
  }
};

export default GameLobby;
