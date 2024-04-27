import { memo, useCallback, useMemo, useRef, useState } from 'react';
import Router from 'next/router';

import type { AsyncThunk } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, TextFieldProps, ClickAwayListener } from '@mui/material';

import type { FormAction } from '@/store/slices/taskBoardSlice';
import type { AsyncThunkConfig } from '@/store/thunks/config';
import theme from '@/theme';
import { useAppDispatch } from '@/utils/hooks';
import {
  isApiError,
  isInvalidRequest,
  makeErrorMessageFrom,
} from '@/utils/api/errors';
import {
  useCreateTaskBoardMutation,
  useCreateTaskListMutation,
  useUpdateTaskBoardMutation,
  useUpdateTaskListMutation,
} from '@/store/api';
import { createTaskCard, updateTaskCard } from '@/store/thunks/cards';
import { pushFlash } from '@/store/slices';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').min(1).max(255),
});

type FormProps = FormAction & {
  handleClose: () => void;
} & TextFieldProps;

const TitleForm = memo(function TitleForm(props: FormProps): JSX.Element {
  const { method, model, handleClose, ...textFieldProps } = props;
  const [createTaskBoard, { isLoading: isLoadingToCreateBoard }] =
    useCreateTaskBoardMutation();
  const [updateTaskBoard, { isLoading: isLoadingToUpdateBoard }] =
    useUpdateTaskBoardMutation();
  const [createTaskList, { isLoading: isLoadingToCreateList }] =
    useCreateTaskListMutation();
  const [updateTaskList, { isLoading: isLoadingToUpdateList }] =
    useUpdateTaskListMutation();
  const [apiError, setApiError] = useState('');
  const dispatch = useAppDispatch();
  const submitRef = useRef<HTMLInputElement>(null);
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
      isLoadingToCreateBoard ||
      isLoadingToUpdateBoard ||
      isLoadingToCreateList ||
      isLoadingToUpdateList
    );
  }, [
    isLoadingToCreateBoard,
    isLoadingToUpdateBoard,
    isLoadingToCreateList,
    isLoadingToUpdateList,
  ]);

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
      } else handleClose();
    },
    [dispatch, handleClose]
  );

  const onSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      try {
        switch (method) {
          case 'POST':
            switch (model) {
              case 'board': {
                const response = await createTaskBoard(data).unwrap();
                const taskBoard = response.data;
                Router.push(`/boards/${taskBoard.id}`);
                break;
              }
              case 'list': {
                const boardId = props.parent.id;
                createTaskList({ boardId, ...data });
                break;
              }
              case 'card': {
                const boardId = props.parent.boardId;
                const listId = props.parent.id;
                handleDispatch(createTaskCard, { boardId, listId, ...data });
                break;
              }
            }
            break;
          case 'PATCH':
            if (!data.title) break;
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
            break;
        }

        handleClose();
      } catch (e) {
        if (!isApiError(e)) {
          throw e;
        }

        if (isInvalidRequest(e)) {
          setApiError(makeErrorMessageFrom(e));
        }
      }
    },
    [
      createTaskBoard,
      createTaskList,
      handleClose,
      handleDispatch,
      method,
      model,
      props,
      updateTaskBoard,
      updateTaskList,
    ]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      event.target.select();
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>): void => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitRef.current?.click();
      }
    },
    []
  );

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
        <TextField
          id="title"
          required
          autoFocus
          onFocus={handleFocus}
          disabled={isLoading}
          fullWidth
          variant="outlined"
          placeholder="Enter a title"
          InputProps={{
            margin: 'dense',
            style: { backgroundColor: theme.palette.background.paper },
          }}
          InputLabelProps={{ margin: 'dense' }}
          helperText={apiError || errors?.title?.message || '1-255 characters'}
          error={!!apiError || !!errors?.title}
          {...textFieldProps}
          {...register('title')}
        />
        <input type="submit" ref={submitRef} hidden />
      </form>
    </ClickAwayListener>
  );
});

export default TitleForm;
