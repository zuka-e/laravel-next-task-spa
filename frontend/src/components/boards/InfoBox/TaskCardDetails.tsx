import { memo, useCallback, useEffect, useState } from 'react';

import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Breadcrumbs,
} from '@mui/material';
import {
  Close as CloseIcon,
  ListAlt as ListAltIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { TaskCard } from '@/models';
import { useAppDispatch, useDeepEqualSelector, useRoute } from '@/utils/hooks';
import { closeInfoBox } from '@/store/slices/taskBoardSlice';
import { updateTaskCard } from '@/store/thunks/cards';
import {
  DatetimeInput,
  DeleteTaskDialog,
  Link,
  MarkdownEditor,
} from '@/templates';
import { EditableTitle } from '..';
import type { DatetimeInputProps } from '@/templates/DatetimeInput';

type TaskCardDetailsProps = {
  card: TaskCard;
};

const TaskCardDetails = memo(function TaskCardDetails(
  props: TaskCardDetailsProps
): JSX.Element {
  const { card } = props;
  const { pathParams } = useRoute();
  const dispatch = useAppDispatch();
  const list = useDeepEqualSelector((state) =>
    state.boards.docs[pathParams?.boardId || ''].lists.find(
      (list) => list.id === card.listId
    )
  );
  const [checked, setChecked] = useState(card.done);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setChecked(card.done);
  }, [card.done]);

  const handleCheckbox = useCallback((): void => {
    setChecked(!checked);
    dispatch(
      updateTaskCard({
        id: card.id,
        boardId: card.boardId,
        listId: card.listId,
        done: !card.done,
      })
    );
  }, [card.boardId, card.done, card.id, card.listId, checked, dispatch]);

  const handleClose = useCallback((): void => {
    dispatch(closeInfoBox());
  }, [dispatch]);

  const handleDateChange = useCallback<
    NonNullable<DatetimeInputProps['onAccept']>
  >(
    (date): void => {
      dispatch(
        updateTaskCard({
          id: card.id,
          boardId: card.boardId,
          listId: card.listId,
          deadline: date?.toISOString(),
        })
      );
    },
    [card.boardId, card.id, card.listId, dispatch]
  );

  const handleDelete = useCallback((): void => {
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback((): void => {
    setOpenDeleteDialog(false);
  }, []);

  const handleSubmitText = useCallback(
    (text: string): void => {
      dispatch(
        updateTaskCard({
          id: card.id,
          boardId: card.boardId,
          listId: card.listId,
          content: text,
        })
      );
    },
    [card.boardId, card.id, card.listId, dispatch]
  );

  return (
    <Card className="flex h-full flex-col rounded-none">
      <CardActions
        disableSpacing
        className="sticky top-0 z-10 gap-2 bg-inherit shadow-sm"
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          className="overflow-x-auto whitespace-nowrap"
          classes={{
            ol: 'flex-nowrap',
            li: '[&>*]:flex [&>*]:items-center',
          }}
        >
          <Link href={`#${list?.id}`}>
            <ListAltIcon className="mr-1 h-6 w-6" />
            {list?.title}
          </Link>
          <Typography>
            <AssignmentIcon className="mr-1 h-6 w-6" />
            {'Card'}
          </Typography>
        </Breadcrumbs>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="ml-auto"
        >
          <CloseIcon />
        </IconButton>
      </CardActions>
      <CardHeader
        title={<EditableTitle method="PATCH" model="card" data={card} />}
        className="pb-0"
      />
      <CardContent className="flex flex-col gap-3 py-0">
        <FormControlLabel
          label={card.done ? 'Completed' : 'Incompleted'}
          className="w-fit"
          control={
            <Checkbox
              color="primary"
              checked={card.done}
              onChange={handleCheckbox}
            />
          }
        />
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label
              className={
                dayjs().isAfter(card.deadline, 'minute') && !card.done
                  ? 'text-error'
                  : ''
              }
            >
              締切日時
            </label>
          </Grid>
          <Grid item>
            <DatetimeInput
              initialValue={card.deadline ? dayjs(card.deadline) : null}
              onAccept={handleDateChange}
            />
          </Grid>
        </Grid>
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>作成日時</label>
          </Grid>
          <Grid item>{dayjs(card.createdAt).calendar()}</Grid>
        </Grid>
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>変更日時</label>
          </Grid>
          <Grid item>{dayjs(card.updatedAt).calendar()}</Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <MarkdownEditor
          onSubmit={handleSubmitText}
          schema={yup.object().shape({
            content: yup.string().label('Content').min(20),
          })}
          defaultValue={card.content}
        />
      </CardContent>

      <CardActions className="flex-auto">
        <DeleteTaskDialog
          model="card"
          data={card}
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        />
        <Button
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
          title="削除"
          variant="contained"
          color="error"
          className="ml-auto self-end"
        >
          削除
        </Button>
      </CardActions>
    </Card>
  );
});

export default TaskCardDetails;
