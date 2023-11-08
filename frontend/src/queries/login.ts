import { IUser, SetState } from '../types';

const dbHost = import.meta.env.VITE_REACT_APP_DB_HOST;
const backendPort = import.meta.env.VITE_REACT_APP_BACKEND_PORT;

export const createUser = (
  username: string,
  admin: boolean,
  setUser: SetState<IUser>
) => {
  fetch(`http://${dbHost}:${backendPort}/create-user`, {
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

export const updateWinnings = (
  userId: number,
  gameId: number,
  setWinnings: SetState<number>
) => {
  fetch(`http://${dbHost}:${backendPort}/update-winnings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      gameId
    })
  })
    .then(async (response: Response) => {
      return await response.json();
    })
    .then((data: { total: number }) => {
      setWinnings(data.total);
    });
};
