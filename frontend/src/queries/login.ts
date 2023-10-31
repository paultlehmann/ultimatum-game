import { IUser, SetState } from '../types';

export const createUser = (
  username: string,
  admin: boolean,
  setUser: SetState<IUser>
) => {
  fetch('http://localhost:8008/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      username
    })
  })
    .then(async (response: Response) => {
      return await response.json();
    })
    .then((createUserReturn: any) => {
      const { id, isAdmin } = createUserReturn;

      if (isAdmin) {
        setUser({ userName: username, admin: true, id });
      } else {
        setUser({ userName: username, admin: admin || false, id });
      }
    });
};
