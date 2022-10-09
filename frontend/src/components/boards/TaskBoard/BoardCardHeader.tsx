import moment from 'moment';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { CardHeader, Typography, Tooltip, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { TaskBoard } from 'models';
import { PopoverControl } from 'templates';
import { EditableTitle } from '..';
import { BoardMenu } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(0.5),
    },
    action: { alignSelf: 'flex-end' },
    title: {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 1,
    },
  })
);

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader = (props: BoardCardHeaderProps) => {
  const { board } = props;
  const classes = useStyles();

  const Title = () => (
    <EditableTitle
      method="PATCH"
      model="board"
      data={board}
      disableMargin
      inputStyle={classes.title}
    />
  );

  const Subheader = () => (
    <Typography color="textSecondary" variant="body2">
      {moment(board.updatedAt).calendar()}
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
      classes={{
        root: classes.root,
        action: classes.action,
      }}
      disableTypography
      title={<Title />}
      subheader={<Subheader />}
      action={<Action />}
    />
  );
};

export default BoardCardHeader;
