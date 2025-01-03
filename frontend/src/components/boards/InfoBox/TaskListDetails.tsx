import { memo, useCallback, type JSX } from 'react';

import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Grid,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Breadcrumbs,
  Tooltip,
} from '@mui/material';
import {
  ListAlt as ListAltIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';

import type { TaskList } from '@/store/api/services/tasks/models';
import { useGetTaskBoardQuery, useUpdateTaskListMutation } from '@/store/api';
import { Link, MarkdownEditor } from '@/templates';
import { useTaskDetails } from '@/lib/hooks';
import { EditableTitle } from '..';

type TaskListDetailsProps = {
  list: TaskList;
};

const TaskListDetails = memo(function TaskListDetails(
  props: TaskListDetailsProps
): JSX.Element {
  const { list } = props;
  const { getTaskDetailsLink } = useTaskDetails();

  const { data: { data: board } = {} } = useGetTaskBoardQuery({
    id: list.boardId,
  });
  const [updateTaskList, { isLoading, error }] = useUpdateTaskListMutation();

  const handleSubmitText = useCallback(
    (text: string): void => {
      updateTaskList({ id: list.id, description: text });
    },
    [list.id, updateTaskList]
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
          <Tooltip title={board?.title}>
            <Link href={getTaskDetailsLink('b', list.boardId)} shallow={true}>
              <FolderOpenIcon className="mr-1 h-6 w-6" />
              {'Board'}
            </Link>
          </Tooltip>
          <Typography>
            <ListAltIcon className="mr-1 h-6 w-6" />
            {list.title}
          </Typography>
        </Breadcrumbs>
      </CardActions>
      <div className="overflow-y-auto">
        <CardHeader
          title={
            <EditableTitle
              defaultValue={list.title}
              disabled={isLoading}
              error={error}
              onSubmit={(data) => updateTaskList({ id: list.id, ...data })}
            />
          }
          disableTypography
          className="pb-0"
        />
        <CardContent className="flex flex-col gap-3 py-0">
          <Grid container className="items-center">
            <Grid item className="mr-4 w-32">
              <label>作成日時</label>
            </Grid>
            <Grid item>{dayjs(list.createdAt).calendar()}</Grid>
          </Grid>
          <Grid container className="items-center">
            <Grid item className="mr-4 w-32">
              <label>変更日時</label>
            </Grid>
            <Grid item>{dayjs(list.updatedAt).calendar()}</Grid>
          </Grid>
        </CardContent>

        <CardContent>
          <MarkdownEditor
            onSubmit={handleSubmitText}
            schema={yup.object().shape({
              content: yup.string().label('Description').max(2000),
            })}
            defaultValue={list.description}
            isLoading={isLoading}
          />
        </CardContent>
      </div>
    </div>
  );
});

export default TaskListDetails;
