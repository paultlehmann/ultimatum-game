export interface IUser {
  admin: boolean;
  userName: string;
}

export interface IGameState {
  // participants: number[];
  adminName: string;
  gameId?: number;
  round: number;
  stage: 'pre' | 'offer' | 'accept' | 'post';
}
