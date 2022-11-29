import {
  Typography,
  List,
  ListSubheader,
  Divider,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { SideMenu } from 'components/layouts/Sidebar';

type SidebarProps = {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const Sidebar = (props: SidebarProps) => {
  const { toggleDrawer } = props;

  return (
    <div className="w-64">
      <List
        component="nav"
        aria-labelledby="menu-header"
        subheader={
          <ListSubheader
            component="div"
            id="menu-header"
            className="flex items-center gap-2 p-1"
          >
            <ListItemIcon>
              <IconButton onClick={toggleDrawer(false)} size="large">
                <MenuIcon />
              </IconButton>
            </ListItemIcon>
            <Typography>Menu</Typography>
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
