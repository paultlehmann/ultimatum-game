import { IUser, SetState } from '../types';

export const createUser = (
  username: string,
  admin: boolean,
  setUser: SetState<IUser>
) => {
  fetch(
    `http://${import.meta.env.VITE_REACT_APP_DB_HOST}:${
      import.meta.env.VITE_REACT_APP_BACKEND_PORT
    }/create-user`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin,
        username
      })
    }
  )
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
