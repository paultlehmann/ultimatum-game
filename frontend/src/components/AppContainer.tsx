import { ReactNode } from 'react';
import TopHeader from './TopHeader';
import { IGameState, ILastOfferStatus, IUser, SetState } from '../types';

interface IProps {
  children: ReactNode;
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

const AppContainer = (props: IProps) => {
  const {
    children,
    gameId,
    lastOfferStatus,
    round,
    setGameState,
    setLastOfferStatus,
    setUser,
    setWinnings,
    userName,
    winnings
  } = props;

  return (
    <>
      <TopHeader
        gameId={gameId}
        lastOfferStatus={lastOfferStatus}
        round={round}
        setGameState={setGameState}
        setLastOfferStatus={setLastOfferStatus}
        setUser={setUser}
        userName={userName}
        setWinnings={setWinnings}
        winnings={winnings}
      />
      <div
        style={{
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AppContainer;
