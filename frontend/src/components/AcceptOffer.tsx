import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import _ from 'lodash';
import { acceptOrRejectOffer, getOffers } from '../queries/offers';
import { IGameState, IOffer } from '../types';

interface IProps {
  gameState: IGameState;
  userId: number;
}

interface IOpponentHistory {
  accepted: boolean;
  amount: number;
  round: number;
}

const AcceptOffer = (props: IProps) => {
  const { gameState, userId } = props;

  const [offer, setOffer] = useState<IOffer | null>(null);
  const [opponentHistory, setOpponentHistory] = useState<IOpponentHistory[]>(
    []
  );

  useEffect(
    () => getOffers(setOffer, gameState.id, gameState.round, undefined, userId),
    []
  );
  // return <div>{`Offer: ${offer?.amount}`}</div>;
  return (
    offer && (
      <Card>
        <CardHeader title={'Accept or Reject Offer'} />
        <CardContent>
          <div>You have been offered:</div>
          <div style={{ fontSize: '32px' }}>
            $<span style={{ color: 'green' }}>{offer.amount}</span>
          </div>
          <div>
            (other player gets $
            <span style={{ color: 'red' }}>{10 - offer.amount}</span>)
          </div>
          <div>by a player with the following history:</div>
          <div>
            {!_.isEmpty(opponentHistory)
              ? opponentHistory.map(
                  (historyItem: IOpponentHistory) =>
                    `Round ${historyItem.round}: ${
                      historyItem.accepted ? 'Accepted' : 'Rejected'
                    } an offer of $${historyItem.amount}`
                )
              : 'None Yet'}
          </div>
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
                onClick={() =>
                  acceptOrRejectOffer(
                    userId,
                    gameState.id,
                    gameState.round,
                    'accept'
                  )
                }
              >
                Accept
              </Button>
            </Grid>
            <Grid item={true}>
              <Button
                variant={'contained'}
                color={'error'}
                onClick={() =>
                  acceptOrRejectOffer(
                    userId,
                    gameState.id,
                    gameState.round,
                    'reject'
                  )
                }
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  );
};

export default AcceptOffer;
