import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { getOffers, saveOffer } from '../../queries/make-offer';

const MakeOffer = (props: any) => {
  const [offer, setOffer] = useState<number>(5);
  const [offerData, setOfferData] = useState<any>([]);

  useEffect(() => {
    getOffers(setOfferData);
  }, []);

  useEffect(() => console.log('new offerData', offerData), [offerData]);

  const handleSubmitOfferClick = (ev: FocusEvent<HTMLInputElement>) => {
    console.log(`setting offer to ${ev.target.value}`);
    setOffer(Number(ev.target.value));
  };

  return (
    <>
      <div>Offer:</div>
      <TextField
        defaultValue={5}
        InputProps={{
          inputProps: {
            max: 10,
            min: 0
          }
        }}
        onBlur={(ev: FocusEvent<HTMLInputElement>) =>
          handleSubmitOfferClick(ev)
        }
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          if (Number(ev.target.value) > 10) {
            ev.target.value = '10';
          } else if (Number(ev.target.value) < 0) {
            ev.target.value = '0';
          } else {
            ev.target.value = Math.round(Number(ev.target.value)).toString();
          }
        }}
        type={'number'}
      />
      <br />
      <Button
        onClick={() => saveOffer(offer)}
        style={{ marginTop: '5px' }}
        variant={'contained'}
      >
        Submit Offer
      </Button>
    </>
  );
};

export default MakeOffer;
