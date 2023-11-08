import { ReactNode } from 'react';
import TopHeader from './TopHeader';
import { IGameState, IUser, SetState } from '../types';

interface IProps {
  children: ReactNode;
  gameId: number;
  round: number;
  setGameState: SetState<IGameState>;
  setUser: SetState<IUser>;
  setWinnings: SetState<number>;
  userName: string;
  winnings?: number;
}

const AppContainer = (props: IProps) => {
  const {
    children,
    gameId,
    round,
    setGameState,
    setUser,
    setWinnings,
    userName,
    winnings
  } = props;

  return (
    <>
      <TopHeader
        gameId={gameId}
        round={round}
        setGameState={setGameState}
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
