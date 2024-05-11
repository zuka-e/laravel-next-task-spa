import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, TextFieldProps } from '@mui/material';

import type { FormAction } from '@/store/slices/taskBoardSlice';
import {
  isApiError,
  isInvalidRequest,
  makeErrorMessageFrom,
} from '@/utils/api/errors';
import {
  useUpdateTaskBoardMutation,
  useUpdateTaskListMutation,
  useUpdateTaskCardMutation,
} from '@/store/api';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').min(1).max(255),
});

type EditableTitleProps = FormAction;

const EditableTitle = memo(function EditableTitle(
  props: EditableTitleProps
): JSX.Element {
  const { method, model } = props;
  const defaultValue = method === 'PATCH' ? props.data.title : undefined;
  const [updateTaskBoard, { isLoading: isLoadingToUpdateBoard }] =
    useUpdateTaskBoardMutation();
  const [updateTaskList, { isLoading: isLoadingToUpdateList }] =
    useUpdateTaskListMutation();
  const [updateTaskCard, { isLoading: isLoadingToUpdateCard }] =
    useUpdateTaskCardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const isLoading = useMemo((): boolean => {
    return (
      isLoadingToUpdateBoard || isLoadingToUpdateList || isLoadingToUpdateCard
    );
  }, [isLoadingToUpdateBoard, isLoadingToUpdateList, isLoadingToUpdateCard]);

  const onSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      if (method !== 'PATCH') return;

      try {
        switch (model) {
          case 'board': {
            updateTaskBoard({ id: props.data.id, ...data });
            break;
          }
          case 'list': {
            updateTaskList({ id: props.data.id, ...data });
            break;
          }
          case 'card': {
            updateTaskCard({ id: props.data.id, ...data });
            break;
          }
        }
      } catch (e) {
        if (!isApiError(e)) {
          throw e;
        }

        if (isInvalidRequest(e)) {
          setApiError(makeErrorMessageFrom(e));
        }
      }
    },
    [method, model, props, updateTaskBoard, updateTaskList, updateTaskCard]
  );

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
            disabled={isLoading}
            helperText={apiError || errors?.title?.message}
            error={!!apiError || !!errors?.title}
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

const StyledTextField = memo(
  forwardRef<HTMLDivElement, TextFieldProps>(function StyledTitleForm(
    props,
    ref
  ): JSX.Element {
    return (
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter a title"
        InputProps={{
          classes: { notchedOutline: 'border-none' },
          className: 'rounded outline-1 hover:outline font-bold',
        }}
        InputLabelProps={{ margin: 'dense' }}
        className="-ml-1.5"
        ref={ref}
        {...props}
      />
    );
  })
);

export default EditableTitle;
