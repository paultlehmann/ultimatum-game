export const createUser = (username: string, admin: boolean) => {
  fetch('http://localhost:8008/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin,
      username
    })
  });
};
