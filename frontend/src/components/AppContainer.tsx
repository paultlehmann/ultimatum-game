import { ReactNode } from 'react';
import TopHeader from './TopHeader';
import { IUser, SetState } from '../types';

interface IProps {
  children: ReactNode;
  setUser: SetState<IUser>;
  userName: string;
}

const AppContainer = (props: IProps) => {
  const { children, setUser, userName } = props;

  return (
    <>
      <TopHeader setUser={setUser} userName={userName} />
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
