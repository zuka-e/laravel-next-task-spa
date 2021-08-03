import { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Divider, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { useAppDispatch, useDeepEqualSelector } from 'utils/hooks';
import { fetchTaskBoard, FetchTaskBoardRequest } from 'store/thunks/boards';
import { BaseLayout, StandbyScreen } from 'layouts';
import { PopoverControl, ScrolledGridContainer } from 'templates';
import { ButtonToAddTask, EditableTitle } from 'components/boards';
import { TaskList, InfoBox } from 'components/boards/TaskBoard';
import { BoardMenu } from 'components/boards/TaskBoardIndex';

const boxWidth = '300px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: theme.spacing(2),
      paddingRight: 0,
    },
    titleBox: {
      flex: '1 1 auto',
      marginLeft: theme.spacing(1),
    },
    title: {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 1,
      fontWeight: 'bold',
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    content: {
      flex: '1 1 auto',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
    },
    listItems: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '& > .listItem': {
        minWidth: boxWidth,
        padding: theme.spacing(1),
      },
    },
  })
);

const TaskBoard = () => {
  const classes = useStyles();
  const params = useParams<{ userId: string; boardId: string }>();
  const dispatch = useAppDispatch();
  const board = useDeepEqualSelector(
    (state) => state.boards.docs[params.boardId]
  );

  useEffect(() => {
    const request: FetchTaskBoardRequest = {
      userId: params.userId,
      boardId: params.boardId,
    };
    dispatch(fetchTaskBoard(request));
  }, [dispatch, params.userId, params.boardId]);

  const handleDrop = () => {
    // API request
  };

  if (!board) return <StandbyScreen />;

  return (
    <BaseLayout subtitle={board.title}>
      <Container component='main' maxWidth={false} className={classes.main}>
        <ScrolledGridContainer justify='space-between'>
          <Grid item className={classes.titleBox}>
            <EditableTitle
              method='PATCH'
              type='board'
              data={board}
              disableMargin
              inputStyle={classes.title}
              helperText=''
            />
          </Grid>
          <Grid item>
            <PopoverControl
              trigger={
                <IconButton title='Menu'>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <BoardMenu board={board} />
            </PopoverControl>
          </Grid>
        </ScrolledGridContainer>
        <Divider />
        <Grid container className={classes.content}>
          <ScrolledGridContainer
            className={classes.listItems}
            onDrop={handleDrop}
          >
            {board.lists?.map((list, i) => (
              <Grid item key={list.id} id={list.id} className='listItem'>
                <TaskList list={list} listIndex={i} />
              </Grid>
            ))}
            <Grid item className='listItem'>
              <ButtonToAddTask method='POST' type='list' parent={board} />
            </Grid>
          </ScrolledGridContainer>
          <InfoBox />
        </Grid>
      </Container>
    </BaseLayout>
  );
};

export default TaskBoard;
