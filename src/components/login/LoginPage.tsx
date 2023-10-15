import { ChangeEvent, useState } from "react";
import { Button, TextField } from "@mui/material";
import { IUser } from "../../types";

interface IProps {
  setUser: (newVal: IUser) => void;
  user: IUser;
}

const LoginPage = (props: IProps) => {
  const { setUser, user } = props;

  const [userNameFieldValue, setUserNameFieldValue] = useState<string>("");

  return (
    <>
      <div>Username:</div>
      <TextField
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setUserNameFieldValue(ev.target.value)
        }
        value={userNameFieldValue}
      />
      <Button
        onClick={() => setUser({ ...user, userName: userNameFieldValue })}
      >
        Clickeradams
      </Button>
    </>
  );
};

export default LoginPage;
