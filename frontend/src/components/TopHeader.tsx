import { Link } from '@mui/material';
import _ from 'lodash';
import { IGameState, ILastOfferStatus, IUser, SetState } from '../types';

interface IProps {
  gameId: number;
  lastOfferStatus: ILastOfferStatus | null;
  round: number;
  setGameState: SetState<IGameState>;
  setLastOfferStatus: SetState<ILastOfferStatus | null>;
  setUser: SetState<IUser>;
  setWinnings: SetState<number>;
  userName: string;
  winnings?: number;
}

const TopHeader = (props: IProps) => {
  const {
    gameId,
    lastOfferStatus,
    round,
    setGameState,
    setLastOfferStatus,
    setUser,
    userName,
    setWinnings,
    winnings
  } = props;

  const { myOfferAccepted, myOfferAmount, offerToMeAccepted, offerToMeAmount } =
    lastOfferStatus || {};

  return (
    <div
      style={{
        border: '1px solid black',
        borderRadius: '5px',
        margin: '5px',
        // height: '10vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      {gameId ? (
        <div style={{ margin: '5px', textAlign: 'left', width: '33%' }}>
          {!_.isUndefined(winnings) && lastOfferStatus && (
            <>
              <div>
                Money So Far:{' '}
                <span style={{ fontWeight: 'bold' }}>${winnings}</span>
              </div>
              <div>Last Round ({round - 1}):</div>
              <div>
                Your offer of ${myOfferAmount} was{' '}
                <span style={{ color: myOfferAccepted ? 'green' : 'red' }}>
                  {myOfferAccepted ? 'accepted' : 'rejected'}.
                </span>
              </div>
              <div>
                You{' '}
                <span style={{ color: offerToMeAccepted ? 'green' : 'red' }}>
                  {offerToMeAccepted ? 'accepted' : 'rejected'}
                </span>{' '}
                an offer of ${offerToMeAmount}.
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ width: '33%' }} />
      )}
      <div
        style={{
          textAlign: 'center',
          width: '33%'
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          Ultimatum Game
        </div>
        <div>{round ? `Round: ${round}` : ''}</div>
      </div>
      <div style={{ margin: '5px', textAlign: 'right', width: '33%' }}>
        <div>Logged in as {userName}</div>
        {/* <br /> */}
        <Link
          onClick={() => {
            setGameState({
              admin: 0,
              id: 0,
              round: 0,
              stage: 'pre'
            });
            setUser({
              admin: false,
              id: 0,
              userName: ''
            });
            setWinnings(0);
            setLastOfferStatus(null);
          }}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          underline={'hover'}
        >
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default TopHeader;
