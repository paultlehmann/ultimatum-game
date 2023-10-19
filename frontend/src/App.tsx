import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/login/LoginPage';
// import TopHeader from './components/TopHeader'
import AppContainer from './components/AppContainer';
import MakeOffer from './components/offer/MakeOffer';
import ManageGame from './components/admin/ManageGame';
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
    return (
      <AppContainer userName={user.userName} setUser={setUser}>
        {user.admin ? <ManageGame /> : <MakeOffer />}
      </AppContainer>
    );
  }
};

export default App;
