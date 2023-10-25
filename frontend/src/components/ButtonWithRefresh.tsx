import { MouseEventHandler } from 'react';
import { Button } from '@mui/material';
import { Sync } from '@mui/icons-material';

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: 'small' | 'medium' | 'large';
  text: string;
}

const ButtonWithRefresh = (props: IProps) => {
  const { onClick, size, text } = props;

  return (
    <Button
      size={size || 'large'}
      variant={'contained'}
      endIcon={<Sync />}
      onClick={onClick}
      style={{ margin: '5px 0px' }}
    >
      {text}
    </Button>
  );
};

export default ButtonWithRefresh;
