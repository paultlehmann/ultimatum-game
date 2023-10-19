import { Button } from '@mui/material';
import { Sync } from '@mui/icons-material';

const GameLobby = (props: any) => {
  return (
    <>
      <h1>No games found!</h1>
      <Button size={'large'} variant={'contained'} endIcon={<Sync />}>
        Check Again
      </Button>
    </>
  );
};

export default GameLobby;
