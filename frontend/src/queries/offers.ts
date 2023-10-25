export const getOffers = (setOfferData: (newVal: any) => void) => {
  fetch('http://localhost:8008/get-offers')
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.text();
    })
    .then((data) => {
      setOfferData(data);
    });
};

export const saveOffer = (
  amount: number,
  gameId: number,
  round: number,
  userId: number
) => {
  fetch('http://localhost:8008/save-offer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      game_id: gameId,
      offerer_id: userId,
      round_number: round
    })
  });
};
