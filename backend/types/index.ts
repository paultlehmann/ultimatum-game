export interface IOffer {
  accepted?: boolean;
  amount: number;
  game_id: number;
  id: number;
  offerer_id: number;
  recipient_id?: number;
  round_number: number;
}
