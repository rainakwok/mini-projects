import { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {AppBar, Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Stack, Tab, Tabs, Toolbar, Tooltip, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import '../../styles.css';
import './Header.css';
import profileIcon from './Profile.png';
import Firebase from '../Firebase';
import paths from '../../constants/routes';

const NavAppBar = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(Firebase.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const navTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#160B9B',
      },
      secondary: {
        main: '#1B08FF',
      },
    },
  });

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLoginClick = () => {
    navigate(paths.LOGIN);
  };
  const handleSignUpClick = () => {
    navigate(paths.SIGNUP);
  };
  const handleProfileClick = () => {
    navigate(paths.PROFILE);
  };
  const handleLogout = () => {
    Firebase.logout();
  };

  return (
    <ThemeProvider theme={navTheme}>
      <AppBar position="sticky" style={{backgroundColor: 'white'}}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ paddingLeft: '15px', marginRight: '20px'}}
          >
            <Link
              to={paths.LANDING}
              className="quicksand-brand"
              sx={{typography: 'h6'}}
            >
              <strong>StuConnect</strong>
            </Link>
          </Typography>
          <Divider orientation="vertical" variant="middle" flexItem />
          {(user &&
            (window.location.pathname != paths.LANDING &&
              window.location.pathname != paths.SIGNUP &&
              window.location.pathname != paths.LOGIN))
          ? (
            <>
            <Typography
              component="div"
              sx={{ marginRight: 'auto', marginLeft: '20px' }}
            >
              <Link
                to={paths.DISCOVERY}
                style={{ textDecoration: 'none' }}
              >
                <strong>HOME</strong>
              </Link>
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Tooltip title="Profile">
                <IconButton onClick={handleProfileClick}>
                  <Avatar
                    src={profileIcon}
                    alt="Profile"
                    sx={{width: 30, height: 30}}
                  />
                </IconButton>
              </Tooltip>
              <Button
                className="me-button"
                sx={{marginLeft: '5px', textTransform: 'none'}}
                endIcon={<MdKeyboardArrowDown />}
                onClick={handleMenuOpen}
              >
                Me
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                {/* <MenuItem >Help</MenuItem> */}
              </Menu>
            </Box>
            </>
          ) : (
            <>
              <div style={{flexGrow: 1}} />
              <Stack className="name-brand" direction="row" spacing={2}>
                {/* <Button>About Us</Button>
                <Button>Contact Us</Button> */}
                <Button
                  sx={{marginLeft: 'auto'}}
                  variant="outlined"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button
                  sx={{marginLeft: '10px'}}
                  variant="contained"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </Stack>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

const NavDrawer = props => {
  const [tabVal, setTabVal] = useState(props.path);

  useEffect(() => {
    setTabVal(props.path);
  }, [props.path]);

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        paddingY: '20px',
        marginRight: '20px',
        backgroundColor: '#e0dede',
        height: '100%',
      }}
    >
      <Tabs
        orientation="vertical"
        value={tabVal ? tabVal : 'Discovery'}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          '& .MuiTab-wrapper': {
            alignItems: 'flex-start',
          },
          '& .MuiTab-root': {
            paddingLeft: '10px',
          },
          textAlign: 'start',
        }}
      >
        <Tab
          className="activePage-theme"
          value="Discovery"
          label="Discovery"
          component={Link}
          to="/Discovery"
          sx={{textAlign: 'start'}}
        />
        <Tab
          value="Connections"
          label="Connections"
          component={Link}
          to='/Connections'/>
        <Tab
          value="Invitations"
          label="Invitations"
          component={Link} to='/Invitations'
         />
      </Tabs>
      </Box>
    </>
  );
};

export {NavAppBar, NavDrawer};
