import { memo, useMemo, useState, type JSX, type Ref } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, type TextFieldProps } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { getInputErrorMessage } from '@/utils/api/errors';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').required().min(1).max(255),
});

type EditableTitleProps = {
  defaultValue: string;
  disabled: boolean;
  error: unknown;
  onSubmit: (data: FormData) => void;
};

const EditableTitle = memo(function EditableTitle(
  props: EditableTitleProps,
): JSX.Element {
  const { defaultValue, disabled, error, onSubmit } = props;
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const errorMessage = useMemo(() => {
    return getInputErrorMessage(error, 'title') || errors?.title?.message;
  }, [error, errors?.title?.message]);

  return (
    <>
      {isEditing ? (
        <form
          onBlur={() => setIsEditing(false)}
          onSubmit={handleSubmit(onSubmit)}
        >
          <StyledTextField
            id="title"
            defaultValue={defaultValue}
            autoFocus
            disabled={disabled}
            helperText={errorMessage}
            error={!!error || !!errors?.title}
            {...register('title')}
          />
        </form>
      ) : (
        <StyledTextField
          onFocus={() => setIsEditing(true)}
          value={defaultValue}
        />
      )}
    </>
  );
});

const StyledTextField = memo(function StyledTitleForm(
  props: TextFieldProps & { ref?: Ref<HTMLDivElement> },
): JSX.Element {
  const { ref, ...textFieldProps } = props;

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Enter a title"
      InputProps={{
        classes: { notchedOutline: 'border-none' },
        className: 'rounded-sm outline-1 hover:outline font-bold',
      }}
      InputLabelProps={{ margin: 'dense' }}
      className="-ml-1.5"
      ref={ref}
      {...textFieldProps}
    />
  );
});

export default EditableTitle;
