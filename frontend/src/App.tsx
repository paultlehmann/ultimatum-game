import { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import AppContainer from './components/AppContainer';
import GameLobby from './components/GameLobby';
import ManageGame from './components/ManageGame';
import { IGameState, ILastOfferStatus, IUser } from './types';

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

  const [lastOfferStatus, setLastOfferStatus] =
    useState<ILastOfferStatus | null>(null);

  if (!user.userName) {
    return <LoginPage setUser={setUser} />;
  } else {
    return (
      <AppContainer
        gameId={gameState.id}
        lastOfferStatus={lastOfferStatus}
        round={gameState.round}
        setGameState={setGameState}
        setLastOfferStatus={setLastOfferStatus}
        setUser={setUser}
        setWinnings={setWinnings}
        userName={user.userName}
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
            setLastOfferStatus={setLastOfferStatus}
            setWinnings={setWinnings}
            user={user}
          />
        )}
      </AppContainer>
    );
  }
};

export default App;
