import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListSubheader,
  Divider,
  IconButton,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

import { SideMenu } from 'components/layouts/Sidebar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: '250px',
    },
    listHeader: {
      display: 'flex',
      padding: '4px',
    },
    listHeaderTitle: {
      marginLeft: theme.spacing(2),
      lineHeight: 'unset',
    },
  })
);

type SidebarProps = {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const Sidebar = (props: SidebarProps) => {
  const { toggleDrawer } = props;
  const classes = useStyles();

  return (
    <div className={classes.drawer}>
      <List
        component="nav"
        aria-labelledby="menu-header"
        subheader={
          <ListSubheader
            className={classes.listHeader}
            component="div"
            id="menu-header"
          >
            <IconButton onClick={toggleDrawer(false)}>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.listHeaderTitle}>Menu</Typography>
          </ListSubheader>
        }
      >
        <Divider />
        <div onClick={toggleDrawer(false)}>
          <SideMenu />
        </div>
      </List>
    </div>
  );
};

export default Sidebar;
