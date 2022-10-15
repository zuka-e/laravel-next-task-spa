import { useState } from 'react';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ClickAwayListener, Card, CardActions, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import theme from 'theme';
import { FormAction } from 'store/slices/taskBoardSlice';
import { TitleForm } from '.';

const useStyles = makeStyles(() =>
  createStyles({
    root: { justifyContent: 'flex-start' },
    wrapper: {
      margin: theme.spacing(0.75),
      width: `calc(100% - ${theme.spacing(0.75 * 2)})`,
    },
    transparent: {
      backgroundColor: 'inherit',
      boxShadow: 'unset',
    },
    dim: { backgroundColor: 'rgb(0,0,0,0.1)' },
  })
);

type ButtonToAddTaskProps = FormAction & {
  transparent?: boolean;
};

const ButtonToAddTask = (props: ButtonToAddTaskProps) => {
  const { transparent, ...formActionType } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);

  const toggleForm = () => {
    setIsEditing(!isEditing);
  };

  const handleClickAway = () => {
    setIsEditing(false);
  };

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
      {isEditing ? (
        <Card
          elevation={7}
          className={props.transparent ? classes.transparent : ''}
        >
          <CardActions style={{ display: 'block' }}>
            <TitleForm {...formActionType} handleClose={toggleForm} />
          </CardActions>
        </Card>
      ) : (
        <Button
          // https://mui.com/material-ui/migration/v5-component-changes/✅-remove-default-color-prop
          color="inherit"
          fullWidth
          startIcon={<AddIcon />}
          onClick={toggleForm}
          classes={{
            root: `${classes.root} ${props.transparent ? classes.wrapper : ''}`,
          }}
          className={props.transparent ? classes.transparent : classes.dim}
        >
          Add new {props.model}
        </Button>
      )}
    </ClickAwayListener>
  );
};

export default ButtonToAddTask;
