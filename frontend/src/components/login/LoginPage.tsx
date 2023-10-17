import {
  ChangeEvent,
  // useEffect,
  useState
} from 'react';
import { Button, TextField } from '@mui/material';
import { createUser } from '../../queries/login';
import { IUser } from '../../types';

interface IProps {
  setUser: (newVal: IUser) => void;
  user: IUser;
}

const LoginPage = (props: IProps) => {
  const { setUser, user } = props;

  const [loginClicked, setLoginClicked] = useState<boolean>(false);
  const [userNameFieldValue, setUserNameFieldValue] = useState<string>('');

  const errorState = loginClicked && !userNameFieldValue;

  const handleLoginClick = () => {
    setUser({ ...user, userName: userNameFieldValue });
    setLoginClicked(true);
    createUser(userNameFieldValue, false);
  };

  //   useEffect(() => console.log('new state',{loginClicked,userNameFieldValue}), [loginClicked, userNameFieldValue])

  return (
    <>
      <div>Username:</div>
      <TextField
        error={errorState}
        helperText={
          errorState && (
            <div style={{ textAlign: 'center' }}>
              Error - no username entered!
            </div>
          )
        }
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setUserNameFieldValue(ev.target.value)
        }
        value={userNameFieldValue}
      />
      <br />
      <Button
        onClick={handleLoginClick}
        style={{ marginTop: '5px' }}
        variant={'contained'}
      >
        Log In
      </Button>
    </>
  );
};

export default LoginPage;
