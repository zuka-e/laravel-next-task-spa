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
} from '@mui/material';
import {
  Close as CloseIcon,
  FolderOpen as FolderOpenIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

import { TaskBoard } from 'models';
import { closeInfoBox } from 'store/slices/taskBoardSlice';
import { updateTaskBoard } from 'store/thunks/boards';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { Link, MarkdownEditor } from 'templates';
import { EditableTitle } from '..';

type TaskBoardDetailsProps = {
  board: TaskBoard;
};

const TaskBoardDetails = (props: TaskBoardDetailsProps) => {
  const { board } = props;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

  const totalList = board.lists.reduce(
    (acc, current) => acc + current.cards.length,
    0
  );

  const totalCompletedCard = board.lists.reduce((acc, list) => {
    const totalCompletedCardForEachList = list.cards.reduce(
      (acc, card) => (card.done ? acc + 1 : acc),
      0
    );
    return acc + totalCompletedCardForEachList;
  }, 0);

  const handleClose = () => {
    dispatch(closeInfoBox());
  };

  const handleSubmitText = (text: string) => {
    dispatch(updateTaskBoard({ id: board.id, description: text }));
  };

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
          <Link href={`/users/${userId}/boards`}>
            <FolderIcon className="mr-1 h-6 w-6" />
            {'Boards'}
          </Link>
          <Typography className="line-clamp-1">
            <FolderOpenIcon className="mr-1 h-6 w-6" />
            {board.title}
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
        className="pb-0"
        disableTypography
        title={<EditableTitle method="PATCH" model="board" data={board} />}
      />
      <CardContent className="flex flex-col gap-3 py-0">
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>合計リスト</label>
          </Grid>
          <Grid item>{board.lists.length}</Grid>
        </Grid>
        <Grid container className="items-center">
          <Grid item className="mr-4 w-32">
            <label>
              合計カード
              <br />
              (完了 / 未完了)
            </label>
          </Grid>
          <Grid item>
            {totalList}&nbsp; ({totalCompletedCard}&nbsp;/&nbsp;
            {totalList - totalCompletedCard})
          </Grid>
        </Grid>
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
          defaultValue={board.description}
        />
      </CardContent>
    </Card>
  );
};

export default TaskBoardDetails;
