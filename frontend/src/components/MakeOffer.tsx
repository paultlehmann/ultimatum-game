import {
  ChangeEvent,
  FocusEvent,
  // useEffect,
  useState
} from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField
} from '@mui/material';
import {
  // getOffers,
  saveOffer
} from '../queries/make-offer';
import ButtonWithRefresh from './ButtonWithRefresh';
import { checkForGames } from '../queries/games';
import { IGameState, SetState } from '../types';

interface IProps {
  setGameState: SetState<IGameState>;
  userId: number;
}

const MakeOffer = (props: IProps) => {
  const { setGameState, userId } = props;

  const [offer, setOffer] = useState<number>(5);
  const [offerSubmitted, setOfferSubmitted] = useState<boolean>(false);
  // const [ownShare, setOwnShare] = useState<number>(5);

  // const [offerData, setOfferData] = useState<any>([]);

  // useEffect(() => {
  //   getOffers(setOfferData);
  // }, []);

  // useEffect(() => console.log('new offerData', offerData), [offerData]);

  const handleSubmitOfferClick = (ev: FocusEvent<HTMLInputElement>) => {
    console.log(`setting offer to ${ev.target.value}`);
    // setOffer(Number(ev.target.value));
  };

  if (!offerSubmitted) {
    return (
      <Card>
        <CardHeader title={'Make an Offer'} />
        <CardContent>
          {/* <div>Offer:</div> */}
          <TextField
            autoFocus={true}
            // defaultValue={5}
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
                // marginLeft: '-5px'
                // paddingRight: '6px'
              }
            }}
            onBlur={(ev: FocusEvent<HTMLInputElement>) =>
              handleSubmitOfferClick(ev)
            }
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
              if (Number(ev.target.value) > 10) {
                // ev.target.value = '10';
                setOffer(10);
                // setOwnShare(0)
              } else if (Number(ev.target.value) < 0) {
                // ev.target.value = '0';
                setOffer(0);
                // setOwnShare(10)
              } else {
                // ev.target.value = Math.round(Number(ev.target.value)).toString();
                setOffer(Math.round(Number(ev.target.value)));
                // setOwnShare(10-(Math.round(Number(ev.target.value))))
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
              saveOffer(offer);
              setOfferSubmitted(true);
            }}
            // style={{ marginTop: '5px' }}
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
            checkForGames(
              { stages: ['accept'], participant: userId },
              undefined,
              setGameState
            )
          }
        />
      </>
    );
  }
};

export default MakeOffer;
