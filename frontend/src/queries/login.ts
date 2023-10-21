import { Dispatch, SetStateAction } from 'react';
import { IUser } from '../types';

// interface ICreateUserReturn {
//   id: number;
//   isAdmin: boolean;
// }

export const createUser = (
  username: string,
  admin: boolean,
  setUser: Dispatch<SetStateAction<IUser>>
) => {
  // console.log('createUser hit');
  fetch('http://localhost:8008/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      username
    })
  })
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return await response.json();
    })
    .then((createUserReturn: any) => {
      // console.log(
      //   'createUserReturn',
      //   createUserReturn,
      //   typeof createUserReturn
      // );
      const { id, isAdmin } = createUserReturn;

      if (isAdmin) {
        setUser({ userName: username, admin: true, id });
      } else {
        setUser({ userName: username, admin: admin || false, id });
      }
    });
};
