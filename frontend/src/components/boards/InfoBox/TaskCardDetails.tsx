import { memo, useCallback, useState, type JSX } from 'react';

import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Button,
  Grid,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
  Typography,
  Breadcrumbs,
} from '@mui/material';
import {
  ListAlt as ListAltIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import type { TaskCard } from '@/store/api/services/tasks/models';
import { useUpdateTaskCardMutation } from '@/store/api';
import {
  DatetimeInput,
  DeleteTaskDialog,
  Link,
  MarkdownEditor,
} from '@/templates';
import { EditableTitle } from '..';
import type { DatetimeInputProps } from '@/templates/DatetimeInput';
import { useGetTaskListQuery } from '@/store/api';
import { useTaskDetails } from '@/lib/hooks';

type TaskCardDetailsProps = {
  card: TaskCard;
};

const TaskCardDetails = memo(function TaskCardDetails(
  props: TaskCardDetailsProps
): JSX.Element {
  const { card } = props;
  const { getTaskDetailsLink } = useTaskDetails();

  const { data: { data: list } = {} } = useGetTaskListQuery({
    id: card.listId,
  });
  const [updateTaskCard, { isLoading, error }] = useUpdateTaskCardMutation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCheckbox = useCallback((): void => {
    updateTaskCard({ id: card.id, done: !card.done });
  }, [card.done, card.id, updateTaskCard]);

  const handleDateChange = useCallback<
    NonNullable<DatetimeInputProps['onAccept']>
  >(
    (date): void => {
      updateTaskCard({
        id: card.id,
        deadline: date?.toISOString(),
      });
    },
    [card.id, updateTaskCard]
  );

  const handleDelete = useCallback((): void => {
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback((): void => {
    setOpenDeleteDialog(false);
  }, []);

  const handleSubmitText = useCallback(
    (text: string): void => {
      updateTaskCard({
        id: card.id,
        content: text,
      });
    },
    [card.id, updateTaskCard]
  );

  return (
    <div className="flex h-full flex-col rounded-none">
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
          <Link href={getTaskDetailsLink('l', card.listId)} shallow={true}>
            <ListAltIcon className="mr-1 h-6 w-6" />
            {list?.title}
          </Link>
          <Typography>
            <AssignmentIcon className="mr-1 h-6 w-6" />
            {'Card'}
          </Typography>
        </Breadcrumbs>
      </CardActions>
      <div className="overflow-y-auto">
        <CardHeader
          title={
            <EditableTitle
              defaultValue={card.title}
              disabled={isLoading}
              error={error}
              onSubmit={(data) => updateTaskCard({ id: card.id, ...data })}
            />
          }
          className="pb-0"
        />
        <CardContent className="flex flex-col gap-3 py-0">
          <FormControlLabel
            label={card.done ? 'Completed' : 'Incomplete'}
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
            isLoading={isLoading}
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
      </div>
    </div>
  );
});

export default TaskCardDetails;
