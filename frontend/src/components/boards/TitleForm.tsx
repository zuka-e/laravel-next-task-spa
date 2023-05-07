import { useRef } from 'react';

import type { AsyncThunk } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, TextFieldProps, ClickAwayListener } from '@mui/material';

import type { FormAction } from '@/store/slices/taskBoardSlice';
import type { AsyncThunkConfig } from '@/store/thunks/config';
import theme from '@/theme';
import { useAppDispatch } from '@/utils/hooks';
import { createTaskBoard, updateTaskBoard } from '@/store/thunks/boards';
import { createTaskList, updateTaskList } from '@/store/thunks/lists';
import { createTaskCard, updateTaskCard } from '@/store/thunks/cards';
import { setFlash } from '@/store/slices';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').min(1).max(255),
});

type FormProps = FormAction & {
  handleClose: () => void;
} & TextFieldProps;

const TitleForm = (props: FormProps) => {
  const { method, model, handleClose, ...textFieldProps } = props;
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

  const handleDispatch = async <
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
      dispatch(setFlash({ severity: 'error', message: errorMessage }));
    } else handleClose();
  };

  const onSubmit = async (data: FormData) => {
    switch (method) {
      case 'POST':
        switch (model) {
          case 'board': {
            handleDispatch(createTaskBoard, { ...data });
            break;
          }
          case 'list': {
            const boardId = props.parent.id;
            handleDispatch(createTaskList, { boardId, ...data });
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
            const id = props.data.id;
            handleDispatch(updateTaskBoard, { id, ...data });
            break;
          }
          case 'list': {
            const id = props.data.id;
            const boardId = props.data.boardId;
            handleDispatch(updateTaskList, { id, boardId, ...data });
            break;
          }
          case 'card': {
            const id = props.data.id;
            const boardId = props.data.boardId;
            const listId = props.data.listId;
            handleDispatch(updateTaskCard, { id, boardId, listId, ...data });
            break;
          }
        }
        break;
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitRef.current?.click();
    }
  };

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
        <TextField
          id="title"
          required
          autoFocus
          onFocus={handleFocus}
          fullWidth
          variant="outlined"
          placeholder="Enter a title"
          InputProps={{
            margin: 'dense',
            style: { backgroundColor: theme.palette.background.paper },
          }}
          InputLabelProps={{ margin: 'dense' }}
          helperText={errors?.title?.message || '1-255 characters'}
          error={!!errors?.title}
          {...textFieldProps}
          {...register('title')}
        />
        <input type="submit" ref={submitRef} hidden />
      </form>
    </ClickAwayListener>
  );
};

export default TitleForm;
