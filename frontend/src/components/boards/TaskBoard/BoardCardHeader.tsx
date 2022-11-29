import dayjs from 'dayjs';
import { CardHeader, Typography, Tooltip, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { TaskBoard } from 'models';
import { PopoverControl } from 'templates';
import { EditableTitle } from '..';
import { BoardMenu } from '.';

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader = (props: BoardCardHeaderProps) => {
  const { board } = props;

  const Title = () => (
    <EditableTitle method="PATCH" model="board" data={board} disableMargin />
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
};

export default BoardCardHeader;
