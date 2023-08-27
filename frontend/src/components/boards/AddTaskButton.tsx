import { memo, useCallback, useState } from 'react';

import { ClickAwayListener, Card, CardActions, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { FormAction } from '@/store/slices/taskBoardSlice';
import { TitleForm } from '.';

type AddTaskButtonProps = FormAction & {
  transparent?: boolean;
};

const AddTaskButton = memo(function AddTaskButton(
  props: AddTaskButtonProps
): JSX.Element {
  const { transparent, ...formActionType } = props;
  const [isEditing, setIsEditing] = useState(false);

  const toggleForm = useCallback((): void => {
    setIsEditing((prev) => !prev);
  }, []);

  const handleClickAway = useCallback((): void => {
    setIsEditing(false);
  }, []);

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
      {isEditing ? (
        transparent ? (
          <div className="w-full">
            <TitleForm {...formActionType} handleClose={toggleForm} />
          </div>
        ) : (
          <Card elevation={7}>
            <CardActions className="block">
              <TitleForm {...formActionType} handleClose={toggleForm} />
            </CardActions>
          </Card>
        )
      ) : (
        <Button
          // https://mui.com/material-ui/migration/v5-component-changes/✅-remove-default-color-prop
          color="inherit"
          fullWidth
          startIcon={<AddIcon />}
          onClick={toggleForm}
          className={
            'justify-start hover:backdrop-brightness-75 ' +
            (transparent ? 'shadow-none' : 'backdrop-brightness-90')
          }
        >
          Add new {props.model}
        </Button>
      )}
    </ClickAwayListener>
  );
});

export default AddTaskButton;
