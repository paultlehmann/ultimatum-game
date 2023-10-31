import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
// import TopHeader from './components/TopHeader'
import AppContainer from './components/AppContainer';
import GameLobby from './components/GameLobby';
import ManageGame from './components/ManageGame';
import { IGameState, IUser } from './types';

const App = () => {
  const [user, setUser] = useState<IUser>({
    admin: false,
    id: 0,
    userName: ''
  });

  const [gameState, setGameState] = useState<IGameState>({
    // participants: [],
    admin: 0,
    id: 0,
    // participantIds: [],
    // participantNames: [],
    round: 0,
    stage: 'pre'
  });

  useEffect(() => console.log('new user', user), [user]);

  useEffect(() => console.log('new gameState', gameState), [gameState]);

  if (!user.userName) {
    return (
      <LoginPage
        setUser={setUser}
        // user={user}
      />
    );
  } else {
    return (
      <AppContainer
        setGameState={setGameState}
        setUser={setUser}
        userName={user.userName}
      >
        {user.admin ? (
          <ManageGame
            gameState={gameState}
            setGameState={setGameState}
            userId={user.id}
          />
        ) : (
          <GameLobby
            gameState={gameState}
            setGameState={setGameState}
            userId={user.id}
          />
        )}
      </AppContainer>
    );
  }
};

export default App;
