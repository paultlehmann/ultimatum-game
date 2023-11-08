import { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
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
    admin: 0,
    id: 0,
    round: 0,
    stage: 'pre'
  });

  const [winnings, setWinnings] = useState<number>(0);

  if (!user.userName) {
    return <LoginPage setUser={setUser} />;
  } else {
    return (
      <AppContainer
        gameId={gameState.id}
        round={gameState.round}
        setGameState={setGameState}
        setUser={setUser}
        userName={user.userName}
        setWinnings={setWinnings}
        winnings={!user.admin ? winnings : undefined}
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
            setWinnings={setWinnings}
            user={user}
          />
        )}
      </AppContainer>
    );
  }
};

export default App;
