import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField
} from '@mui/material';
import _ from 'lodash';
import ButtonWithRefresh from './ButtonWithRefresh';
import { getOfferHistory, saveOffer } from '../queries/offers';
import { checkForGames } from '../queries/games';
import { updateWinnings } from '../queries/login';
import { IGameState, IOpponentHistory, SetState } from '../types';

interface IProps {
  gameState: IGameState;
  setGameState: SetState<IGameState>;
  setWinnings: SetState<number>;
  userId: number;
}

const MakeOffer = (props: IProps) => {
  const { gameState, setGameState, setWinnings, userId } = props;

  const [offer, setOffer] = useState<number>(5);
  const [offerSubmitted, setOfferSubmitted] = useState<boolean>(false);
  const [opponentHistory, setOpponentHistory] = useState<IOpponentHistory[]>(
    []
  );

  useEffect(() => {
    getOfferHistory(setOpponentHistory, userId, gameState.id, gameState.round);

    if (gameState.round > 1) {
      updateWinnings(userId, gameState.id, setWinnings);
    }
  }, []);

  const renderHistory = (opponentHistory: IOpponentHistory[]) => {
    return (
      <ul>
        {opponentHistory.map((historyItem: IOpponentHistory, index: number) => {
          const { accepted, amount, round_number } = historyItem;
          return (
            <li key={`history-row-${index + 1}`}>
              {`Round ${round_number}: Was offered $${amount} and `}
              {accepted ? (
                <span style={{ fontWeight: 'bold', color: 'green' }}>
                  accepted
                </span>
              ) : (
                <span style={{ fontWeight: 'bold', color: 'red' }}>
                  rejected
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  if (!offerSubmitted) {
    return (
      <Card>
        <CardHeader title={'Make an Offer'} />
        <CardContent>
          <TextField
            value={offer || ''}
            placeholder={'0'}
            InputProps={{
              inputProps: {
                max: 10,
                min: 0
              },

              startAdornment: (
                <InputAdornment
                  position={'start'}
                  style={{ marginRight: '2px' }}
                >
                  $
                </InputAdornment>
              ),

              style: {
                fontSize: '20px',
                color: 'red',
                fontWeight: 'bold'
              }
            }}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
              if (Number(ev.target.value) > 10) {
                setOffer(10);
              } else if (Number(ev.target.value) < 0) {
                setOffer(0);
              } else {
                setOffer(Math.round(Number(ev.target.value)));
              }
            }}
            style={{
              width: '80px'
            }}
            type={'number'}
          />{' '}
          <div>to your opponent</div>
          <div style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>
            ${10 - offer}
          </div>
          <div>to you</div>
          <br />
          <div style={{ textDecoration: 'underline' }}>Opponent history:</div>
          <div>
            {!_.isEmpty(opponentHistory)
              ? renderHistory(opponentHistory)
              : 'None Yet'}
          </div>
          <Button
            onClick={() => {
              saveOffer(offer, gameState.id, gameState.round, userId);
              setOfferSubmitted(true);
            }}
            variant={'contained'}
          >
            Submit Offer
          </Button>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <>
        <div>Offer submitted!</div>
        <div>Waiting for other players to submit offers.</div>
        <ButtonWithRefresh
          text={'Refresh'}
          onClick={() =>
            checkForGames({ id: gameState.id }, undefined, setGameState)
          }
        />
      </>
    );
  }
};

export default MakeOffer;
