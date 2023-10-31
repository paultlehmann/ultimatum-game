import { Dispatch, SetStateAction } from 'react';

export interface IUser {
  admin: boolean;
  id: number;
  userName: string;
}

export interface IGameState {
  admin: number;
  id: number;
  // participantIds: number[];
  participantNames?: string[];
  round: number;
  stage: TGameStage;
}

export interface IGameRow extends IGameState {
  participants: number[];
}

export type TGameStage = 'pre' | 'offer' | 'accept' | 'post';

export type SetState<Type> = Dispatch<SetStateAction<Type>>;

export interface IOffer {
  amount: number;
  id: number;
}
