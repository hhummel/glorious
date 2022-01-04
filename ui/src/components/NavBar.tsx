import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { logout } from '../utils/api';
import {User} from '../../types'
import { isNonNullExpression } from 'typescript';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

type Props = {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
  };

export default function NavBar({setUser, setVisible}: Props) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProductsClick = () => {
    setVisible(1);
    handleCloseNavMenu();
  };

  const handleAccountClick = () => {
    setVisible(2);
    setAnchorElUser(null);
  };

  const handleShoppingCartClick = () => {
    setVisible(3);
    handleCloseNavMenu();
  };

  const handleProfileClick = () => {
    setVisible(4);
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    setUser(undefined);
    setVisible(1);
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key={'Products'} onClick={handleProductsClick}>
                <Typography textAlign="center">Products</Typography>
              </MenuItem>
              <MenuItem key={'Pricing'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Pricing</Typography>
              </MenuItem>
              <MenuItem key={'Blog'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Blog</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key={'Product'}
                onClick={handleProductsClick}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Product
              </Button>
              <Button
                key={'Pricing'}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
              Pricing
              </Button>
              <Button
                key={'Blog'}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
              Blog
              </Button>              
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Shopping cart">
              <IconButton onClick={handleShoppingCartClick} sx={{ p: 0 }}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem key={'Profile'} onClick={handleProfileClick}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem key={'Account'} onClick={handleAccountClick}>
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
                <MenuItem key={'Subscription'} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Subscription</Typography>
                </MenuItem>
                <MenuItem key={'Logout'} onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>                
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
