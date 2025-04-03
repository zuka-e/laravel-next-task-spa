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
} from '@mui/material';
import {
  FolderOpen as FolderOpenIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

import type { TaskBoard } from '@/store/api/services/tasks/models';
import { useUpdateTaskBoardMutation } from '@/store/api';
import { Link, MarkdownEditor } from '@/templates';
import { EditableTitle } from '..';

type TaskBoardDetailsProps = {
  board: TaskBoard;
};

const TaskBoardDetails = memo(function TaskBoardDetails(
  props: TaskBoardDetailsProps
): JSX.Element {
  const { board } = props;

  const [updateTaskBoard, { isLoading, error }] = useUpdateTaskBoardMutation();

  const handleSubmitText = useCallback(
    (text: string): void => {
      updateTaskBoard({ id: board.id, description: text });
    },
    [board.id, updateTaskBoard]
  );

  return (
    <div className="flex h-full flex-col">
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
          <Link href={'/boards'}>
            <FolderIcon className="mr-1 h-6 w-6" />
            {'Boards'}
          </Link>
          <Typography className="line-clamp-1">
            <FolderOpenIcon className="mr-1 h-6 w-6" />
            {board.title}
          </Typography>
        </Breadcrumbs>
      </CardActions>
      <div className="overflow-y-auto">
        <CardHeader
          className="pb-0"
          disableTypography
          title={
            <EditableTitle
              defaultValue={board.title}
              disabled={isLoading}
              error={error}
              onSubmit={(data) => updateTaskBoard({ id: board.id, ...data })}
            />
          }
        />
        <CardContent className="flex flex-col gap-3 py-0">
          <Grid container className="items-center">
            <Grid item className="mr-4 w-32">
              <label>作成日時</label>
            </Grid>
            <Grid item>{dayjs(board.createdAt).calendar()}</Grid>
          </Grid>
          <Grid container className="items-center">
            <Grid item className="mr-4 w-32">
              <label>変更日時</label>
            </Grid>
            <Grid item>{dayjs(board.updatedAt).calendar()}</Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <MarkdownEditor
            onSubmit={handleSubmitText}
            schema={yup.object().shape({
              description: yup.string().label('Description').max(2000),
            })}
            defaultValue={board.description ?? undefined}
            isLoading={isLoading}
          />
        </CardContent>{' '}
      </div>
    </div>
  );
});

export default TaskBoardDetails;
