import { memo, type JSX } from 'react';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { CardHeader, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useUpdateTaskListMutation } from '@/store/api';
import type { TaskList } from '@/store/api/services/tasks/models';
import { PopoverControl } from '@/templates';
import { EditableTitle } from '..';
import { ListMenu } from '.';

type ListCardHeaderProps = {
  list: Pick<TaskList, 'id' | 'title' | 'updatedAt'>;
};

const ListCardHeader = memo(function ListCardHeader(
  props: ListCardHeaderProps,
): JSX.Element {
  const { list } = props;

  const [updateTaskList, { isLoading, error }] = useUpdateTaskListMutation();

  const Title = () => (
    <EditableTitle
      defaultValue={list.title}
      disabled={isLoading}
      error={error}
      onSubmit={(data) => updateTaskList({ id: list.id, ...data })}
    />
  );

  const Subheader = () => (
    <Typography color="textSecondary" variant="body2">
      {dayjs(list.updatedAt).calendar()}
    </Typography>
  );

  const Action = () => (
    <PopoverControl
      trigger={
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListMenu list={list} />
    </PopoverControl>
  );

  return (
    <CardHeader
      disableTypography
      title={<Title />}
      subheader={<Subheader />}
      action={<Action />}
      className="pb-0 pr-2.5 pt-2"
    />
  );
});

export default ListCardHeader;
