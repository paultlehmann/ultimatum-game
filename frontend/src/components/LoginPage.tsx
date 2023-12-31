import { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { createUser } from '../queries/login';
import { IUser, SetState } from '../types';

interface IProps {
  setUser: SetState<IUser>;
}

const LoginPage = (props: IProps) => {
  const { setUser } = props;

  const [loginClicked, setLoginClicked] = useState<boolean>(false);
  const [userNameFieldValue, setUserNameFieldValue] = useState<string>('');

  const errorState = loginClicked && !userNameFieldValue;

  const handleLoginClick = () => {
    setLoginClicked(true);
    if (!errorState) {
      createUser(userNameFieldValue, false, setUser);
    }
  };

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
