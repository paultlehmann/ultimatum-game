import { Link } from '@mui/material';
import { IGameState, IUser, SetState } from '../types';

interface IProps {
  gameId: number;
  round: number;
  setGameState: SetState<IGameState>;
  setUser: SetState<IUser>;
  userName: string;
}

const TopHeader = (props: IProps) => {
  const { gameId, round, setGameState, setUser, userName } = props;

  return (
    // <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <div
      style={{
        border: '1px solid black',
        borderRadius: '5px',
        margin: '5px',
        height: '10vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      {gameId ? (
        <div style={{ margin: '5px', textAlign: 'left', width: '33%' }}>
          <div>Game ID: {gameId}</div>
          <div>Round: {round}</div>
        </div>
      ) : (
        <div style={{ width: '33%' }} />
      )}
      <div
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          width: '33%'
        }}
      >
        Ultimatum Game
      </div>
      <div style={{ margin: '5px', textAlign: 'right', width: '33%' }}>
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
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          underline={'hover'}
        >
          Logout
        </Link>
      </div>
    </div>
    // </div>
  );
};

export default TopHeader;
