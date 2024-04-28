import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import type { AsyncThunk } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, TextFieldProps } from '@mui/material';

import type { FormAction } from '@/store/slices/taskBoardSlice';
import type { AsyncThunkConfig } from '@/store/thunks/config';
import { useAppDispatch } from '@/utils/hooks';
import {
  isApiError,
  isInvalidRequest,
  makeErrorMessageFrom,
} from '@/utils/api/errors';
import {
  useUpdateTaskBoardMutation,
  useUpdateTaskListMutation,
} from '@/store/api';
import { updateTaskCard } from '@/store/thunks/cards';
import { pushFlash } from '@/store/slices';

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
  const [isEditing, setIsEditing] = useState(false);
  const [apiError, setApiError] = useState('');
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const isLoading = useMemo((): boolean => {
    return isLoadingToUpdateBoard || isLoadingToUpdateList;
  }, [isLoadingToUpdateBoard, isLoadingToUpdateList]);

  const handleDispatch = useCallback(
    async <
      T extends AsyncThunk<
        Parameters<T['fulfilled']>[0],
        Parameters<T>[0],
        AsyncThunkConfig
      >
    >(
      thunk: T,
      payload: Parameters<T>[0]
    ) => {
      const response = await dispatch(thunk(payload));
      if (thunk.rejected.match(response)) {
        const errorMessage =
          response.payload?.error.message || 'Unexpected Error';
        dispatch(pushFlash({ severity: 'error', message: errorMessage }));
      } else {
        setIsEditing(false);
      }
    },
    [dispatch]
  );

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
            const id = props.data.id;
            const boardId = props.data.boardId;
            const listId = props.data.listId;
            handleDispatch(updateTaskCard, {
              id,
              boardId,
              listId,
              ...data,
            });
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
    [handleDispatch, method, model, props, updateTaskBoard, updateTaskList]
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
