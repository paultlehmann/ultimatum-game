import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
// import TopHeader from './components/TopHeader'
import AppContainer from './components/AppContainer';
import GameLobby from './components/GameLobby';
import MakeOffer from './components/MakeOffer';
import ManageGame from './components/ManageGame';
import { IGameState, IUser } from './types';

const App = () => {
  const [user, setUser] = useState<IUser>({
    admin: false,
    userName: ''
  });

  const [gameState, setGameState] = useState<IGameState>({
    // participants: [],
    adminName: '',
    gameId: undefined,
    round: 1,
    stage: 'pre'
  });

  useEffect(() => console.log('new user', user), [user]);

  if (!user.userName) {
    return (
      <LoginPage
        setUser={setUser}
        // user={user}
      />
    );
  } else {
    return (
      <AppContainer userName={user.userName} setUser={setUser}>
        {user.admin ? (
          <ManageGame userId={user.id || -1} />
        ) : gameState.stage === 'pre' ? (
          <GameLobby />
        ) : (
          <MakeOffer />
        )}
      </AppContainer>
    );
  }
};

export default App;
