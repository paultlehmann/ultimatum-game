import { ReactNode } from 'react';
import TopHeader from './TopHeader';
import { IGameState, IUser, SetState } from '../types';

interface IProps {
  children: ReactNode;
  setGameState: SetState<IGameState>;
  setUser: SetState<IUser>;
  userName: string;
}

const AppContainer = (props: IProps) => {
  const { children, setGameState, setUser, userName } = props;

  return (
    <>
      <TopHeader
        setGameState={setGameState}
        setUser={setUser}
        userName={userName}
      />
      <div
        style={{
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
          // display: 'flex',
          // flexDirection: 'column',
          // justifyContent: 'center'
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AppContainer;
