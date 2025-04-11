import { memo, useCallback, useMemo, useState, type JSX } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { getInputErrorMessage } from '@/utils/api/errors';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').required().min(1).max(255),
});

type AddTaskButtonProps = {
  disabled: boolean;
  error: unknown;
  onSubmit: (data: FormData) => void;
};

const AddTaskButton = memo(function AddTaskButton(
  props: AddTaskButtonProps,
): JSX.Element {
  const { disabled, error, onSubmit } = props;
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onValid = useCallback(
    async (data: FormData): Promise<void> => {
      onSubmit(data);
      setIsEditing(false);
      resetField('title');
    },
    [onSubmit, resetField],
  );

  const errorMessage = useMemo(() => {
    return getInputErrorMessage(error, 'title') || errors?.title?.message;
  }, [error, errors?.title?.message]);

  return (
    <>
      {isEditing ? (
        <form
          onBlur={() => setIsEditing(false)}
          onSubmit={handleSubmit(onValid)}
          className="w-full"
        >
          <TextField
            id="title"
            disabled={disabled}
            autoFocus
            placeholder="Enter a title"
            fullWidth
            variant="outlined"
            InputProps={{
              className: 'font-bold',
            }}
            InputLabelProps={{ margin: 'dense' }}
            helperText={errorMessage}
            error={!!error || !!errors?.title}
            {...register('title')}
          />
        </form>
      ) : (
        <Button
          // https://mui.com/material-ui/migration/v5-component-changes/✅-remove-default-color-prop
          color="inherit"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setIsEditing(true)}
          className="justify-start backdrop-brightness-90 hover:backdrop-brightness-75"
        >
          Add
        </Button>
      )}
    </>
  );
});

export default AddTaskButton;
