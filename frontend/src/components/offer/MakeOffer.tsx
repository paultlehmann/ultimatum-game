import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

const MakeOffer = (props: any) => {
  const [offerData, setOfferData] = useState<any>([]);

  useEffect(() => {
    getOffers();
  }, []);

  useEffect(() => console.log('new offerData', offerData), [offerData]);

  const getOffers = () => {
    fetch('http://localhost:8008/test')
      .then((response) => {
        console.log('response', response);
        console.log('response.text()', response.text());
        return response.text();
      })
      .then((data) => {
        setOfferData(data);
      });
  };

  const handleSubmitOfferClick = (ev: FocusEvent<HTMLInputElement>) => {
    console.log(`offered ${ev.target.value}`);
  };

  return (
    <>
      <div>Offer:</div>
      <TextField
        // error={errorState}
        // helperText={
        //   errorState && (
        //     <div style={{ textAlign: 'center' }}>
        //       Error - no username entered!
        //     </div>
        //   )
        // }
        // onChange={(ev: ChangeEvent<HTMLInputElement>) =>
        //   setUserNameFieldValue(ev.target.value)
        // }
        // value={userNameFieldValue}
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
        // onClick={handleSubmitOfferClick}
        style={{ marginTop: '5px' }}
        variant={'contained'}
      >
        Submit Offer
      </Button>
    </>
  );
};

export default MakeOffer;
