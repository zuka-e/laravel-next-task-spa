import { memo, type JSX } from 'react';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useUpdateTaskBoardMutation } from '@/store/api';
import type { TaskBoard } from '@/store/api/services/tasks/models';
import { PopoverControl } from '@/templates';
import { EditableTitle } from '..';
import { BoardMenu } from '.';

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader = memo(function BoardCardHeader(
  props: BoardCardHeaderProps,
): JSX.Element {
  const { board } = props;

  const [updateTaskBoard, { isLoading, error }] = useUpdateTaskBoardMutation();

  const Title = () => (
    <EditableTitle
      defaultValue={board.title}
      disabled={isLoading}
      error={error}
      onSubmit={(data) => updateTaskBoard({ id: board.id, ...data })}
    />
  );

  const Subheader = () => (
    <Typography color="textSecondary" variant="body2">
      {dayjs(board.updatedAt).calendar()}
    </Typography>
  );

  const MenuButton = () => (
    <Tooltip title="Menu" enterDelay={500}>
      <IconButton aria-label="board-menu" size="small">
        <MoreVertIcon />
      </IconButton>
    </Tooltip>
  );

  const Action = () => (
    <PopoverControl trigger={<MenuButton />}>
      <BoardMenu board={board} />
    </PopoverControl>
  );

  return (
    <CardHeader
      disableTypography
      title={<Title />}
      subheader={<Subheader />}
      action={<Action />}
      className="p-3"
      classes={{ action: 'self-end' }}
    />
  );
});

export default BoardCardHeader;
