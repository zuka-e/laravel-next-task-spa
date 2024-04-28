import { memo, useCallback, useMemo, useState } from 'react';
import Router from 'next/router';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { FormAction } from '@/store/slices/taskBoardSlice';
import {
  useCreateTaskBoardMutation,
  useCreateTaskListMutation,
} from '@/store/api';
import {
  isApiError,
  isInvalidRequest,
  makeErrorMessageFrom,
} from '@/utils/api/errors';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().label('Title').min(1).max(255),
});

type AddTaskButtonProps = FormAction & {
  transparent?: boolean;
};

const AddTaskButton = memo(function AddTaskButton(
  props: AddTaskButtonProps
): JSX.Element {
  const { method, model } = props;
  const [createTaskBoard, { isLoading: isLoadingToCreateBoard }] =
    useCreateTaskBoardMutation();
  const [createTaskList, { isLoading: isLoadingToCreateList }] =
    useCreateTaskListMutation();
  const [apiError, setApiError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const isLoading = useMemo((): boolean => {
    return isLoadingToCreateBoard || isLoadingToCreateList;
  }, [isLoadingToCreateBoard, isLoadingToCreateList]);

  const onSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      if (method !== 'POST') return;

      try {
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
    [createTaskBoard, createTaskList, method, model, props]
  );

  return (
    <>
      {isEditing ? (
        <form
          onBlur={() => setIsEditing(false)}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          <TextField
            id="title"
            disabled={isLoading}
            autoFocus
            placeholder="Enter a title"
            fullWidth
            variant="outlined"
            InputProps={{
              className: 'font-bold',
            }}
            InputLabelProps={{ margin: 'dense' }}
            helperText={apiError || errors?.title?.message}
            error={!!apiError || !!errors?.title}
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
          Add new {props.model}
        </Button>
      )}
    </>
  );
});

export default AddTaskButton;
