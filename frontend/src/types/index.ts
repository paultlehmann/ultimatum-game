export interface IUser {
  admin: boolean;
  id?: number;
  userName: string;
}

export interface IGameState {
  // participants: number[];
  adminName: string;
  gameId?: number;
  round: number;
  stage: TGameStage;
}

export type TGameStage = 'pre' | 'offer' | 'accept' | 'post';
