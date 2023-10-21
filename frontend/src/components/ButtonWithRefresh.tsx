import { MouseEventHandler } from 'react';
import { Button } from '@mui/material';
import { Sync } from '@mui/icons-material';

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const ButtonWithRefresh = (props: IProps) => {
  const { onClick, text } = props;

  return (
    <Button
      size={'large'}
      variant={'contained'}
      endIcon={<Sync />}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ButtonWithRefresh;
