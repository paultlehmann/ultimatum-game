import { Link } from '@mui/material';
import { IUser } from '../types';

interface IProps {
  setUser: (newVal: IUser) => void;
  userName: string;
}

const TopHeader = (props: IProps) => {
  const { setUser, userName } = props;

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
          onClick={() =>
            setUser({
              admin: false,
              userName: ''
            })
          }
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
