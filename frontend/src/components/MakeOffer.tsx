import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField
} from '@mui/material';
import ButtonWithRefresh from './ButtonWithRefresh';
import { saveOffer } from '../queries/offers';
import { checkForGames } from '../queries/games';
import { updateWinnings } from '../queries/login';
import { IGameState, SetState } from '../types';

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

  useEffect(() => {
    if (gameState.round > 1) {
      updateWinnings(userId, gameState.id, setWinnings);
    }
  }, []);

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
