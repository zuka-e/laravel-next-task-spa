import { memo, useCallback } from 'react';

import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Breadcrumbs,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  ListAlt as ListAltIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';

import { TaskList } from '@/models';
import { closeInfoBox } from '@/store/slices/taskBoardSlice';
import { updateTaskList } from '@/store/thunks/lists';
import { useAppDispatch, useAppSelector, useRoute } from '@/utils/hooks';
import { Link, MarkdownEditor } from '@/templates';
import { EditableTitle } from '..';

type TaskListDetailsProps = {
  list: TaskList;
};

const TaskListDetails = memo(function TaskListDetails(
  props: TaskListDetailsProps
): JSX.Element {
  const { list } = props;
  const { pathParams } = useRoute();
  const boardName = useAppSelector(
    (state) => state.boards.docs[pathParams?.boardId || ''].title
  );
  const dispatch = useAppDispatch();

  const handleClose = useCallback((): void => {
    dispatch(closeInfoBox());
  }, [dispatch]);

  const handleSubmitText = useCallback(
    (text: string): void => {
      dispatch(
        updateTaskList({
          id: list.id,
          boardId: list.boardId,
          description: text,
        })
      );
    },
    [dispatch, list.boardId, list.id]
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
          <Tooltip title={boardName}>
            <Typography>
              <FolderOpenIcon className="mr-1 h-6 w-6" />
              {'Board'}
            </Typography>
          </Tooltip>
          <Link href={`#${list?.id}`} title={list.title}>
            <ListAltIcon className="mr-1 h-6 w-6" />
            {list.title}
          </Link>
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
        title={<EditableTitle method="PATCH" model="list" data={list} />}
        disableTypography
        className="pb-0"
      />
      <CardContent className="flex flex-col gap-3 py-0">
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>タスク総数</label>
          </Grid>
          <Grid item>{list.cards.length}</Grid>
        </Grid>
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>(完了済)</label>
          </Grid>
          <Grid item>{list.cards.filter((card) => card.done).length}</Grid>
        </Grid>
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
        />
      </CardContent>
    </Card>
  );
});

export default TaskListDetails;
