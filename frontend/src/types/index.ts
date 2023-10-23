import { Dispatch, SetStateAction } from 'react';

export interface IUser {
  admin: boolean;
  id?: number;
  userName: string;
}

export interface IGameState {
  // participants: number[];
  admin: number;
  id?: number;
  round: number;
  stage: TGameStage;
}

export type TGameStage = 'pre' | 'offer' | 'accept' | 'post';

export type SetState<Type> = Dispatch<SetStateAction<Type>>;

// export interface SetState<Type> {
//   (value: Type): Dispatch<SetStateAction<Type>>;
// }
