import { Dispatch, SetStateAction } from 'react';
import { IUser } from '../types';

export const createUser = (
  username: string,
  admin: boolean,
  // setUser: (newVal: IUser) => void)
  setUser: Dispatch<SetStateAction<IUser>>
) => {
  console.log('createUser hit');
  fetch('http://localhost:8008/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      username
    })
  })
    .then(async (response: Response) => {
      console.log('response', response);
      // console.log('response.text()', await response.text());
      return await response.text();
    })
    .then((existsAndIsAdmin: string) => {
      // console.log('dataf',data,typeof data);
      if (existsAndIsAdmin === 'true') {
        setUser((prevVal: IUser) => {
          return { ...prevVal, admin: true };
        });
      }
    });
};
