import { memo } from 'react';

import dayjs from 'dayjs';
import { CardHeader, Typography, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { TaskList } from '@/models';
import { PopoverControl } from '@/templates';
import { EditableTitle } from '..';
import { ListMenu } from '.';

type ListCardHeaderProps = {
  list: TaskList;
};

const ListCardHeader = memo(function ListCardHeader(
  props: ListCardHeaderProps
): JSX.Element {
  const { list } = props;

  const Title = () => (
    <EditableTitle
      method="PATCH"
      model="list"
      data={list}
      disableMargin
      inputStyle="text-white"
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
