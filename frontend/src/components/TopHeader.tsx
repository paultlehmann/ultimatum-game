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
              admin: -1,
              id: -1,
              round: -1,
              stage: 'pre'
            });
            setUser({
              admin: false,
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
