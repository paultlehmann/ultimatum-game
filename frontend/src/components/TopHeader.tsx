import { Link } from '@mui/material';
import { IGameState, IUser, SetState } from '../types';

interface IProps {
  setGameState: SetState<IGameState>;
  setUser: SetState<IUser>;
  userName: string;
}

const TopHeader = (props: IProps) => {
  const { setGameState, setUser, userName } = props;

  return (
    <>
      <div
        style={{
          border: '1px solid red',
          height: '10vh',
          position: 'sticky',
          textAlign: 'right',
          top: 0
        }}
      >
        {`Logged in as ${userName}`}
        <br />
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
          }}
          style={{ cursor: 'pointer' }}
          underline={'hover'}
        >
          Logout
        </Link>
      </div>
    </>
  );
};

export default TopHeader;
