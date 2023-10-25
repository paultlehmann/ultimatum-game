import { useEffect, useState } from 'react';
import { getOffers } from '../queries/offers';
import { IGameState, IOffer } from '../types';

interface IProps {
  gameState: IGameState;
  userId: number;
}

const AcceptOffer = (props: IProps) => {
  const { gameState, userId } = props;

  const [offer, setOffer] = useState<IOffer | null>(null);

  useEffect(
    () => getOffers(setOffer, gameState.id, gameState.round, undefined, userId),
    []
  );
  return <div>{`Offer: ${offer?.amount}`}</div>;
};

export default AcceptOffer;
