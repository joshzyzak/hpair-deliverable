import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import './App.css';
import BasicTable from './components/BasicTable';
import EntryModal from './components/EntryModal';
import { mainListItems } from './components/listItems';
import { SignInScreen } from './utils/READONLY_firebase';
import { emptyEntry, subscribeToEntries } from './utils/mutations';

// MUI styling constants
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setcurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const mdTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#770312',
      },
      secondary: {
        main: '#fff',
      },
    },
  });

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      if (!!user) {
        setcurrentUser(user);
      }
    });
    return () => unregisterAuthObserver();
  }, []);

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    subscribeToEntries(currentUser.uid, setEntries);
  }, [currentUser]);

  function mainContent() {
    if (isSignedIn) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <EntryModal entry={emptyEntry} type="add" user={currentUser} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <BasicTable entries={entries} />
          </Grid>
        </Grid>
      );
    } else return <SignInScreen />;
  }

  const MenuBar = () => {
    return (
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Speaker Outreach
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={toggleDarkMode}
            sx={{ margin: '0 10px' }}
          >
            Switch to {darkMode ? 'Light' : 'Dark'} Mode
          </Button>
          <Typography
            component="h1"
            variant="body1"
            color="inherit"
            noWrap
            sx={{
              display: isSignedIn ? 'inline' : 'none',
              margin: '0 10px',
            }}
          >
            Signed in as {firebase.auth().currentUser?.displayName}
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{
              margin: '0 10px',
              display: isSignedIn ? 'inline' : 'none',
            }}
            onClick={() => firebase.auth().signOut()}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <MenuBar />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {mainContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
