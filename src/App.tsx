import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/login/LoginPage';
import { IUser } from './types';

const App = () => {
  const [user, setUser] = useState<IUser>({
    admin: false,
    userName: ''
  });

  useEffect(() => console.log('new user', user), [user]);

  if (!user.userName) {
    return <LoginPage setUser={setUser} user={user} />;
  } else {
    return <div>You logged in.</div>;
  }
};

export default App;
