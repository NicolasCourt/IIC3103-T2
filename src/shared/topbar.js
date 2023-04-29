/* Ayuda de https://mui.com/material-ui/react-app-bar/ */
/* Reusado de la tarea anterior*/

import React from 'react'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import LogoutIcon from '@mui/icons-material/Logout';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import ChatIcon from '@mui/icons-material/Chat';

const useStyles = makeStyles({
  brand: {
    display: { xs: 'none', md: 'flex' },
    fontWeight: 900,
    fontSize: '20px',
    letterSpacing: '.3rem',
    paddingTop: '0px !important',
  },
  buttonsContainer: {
    flexDirection: 'column',
    paddingRight: '40px',
    paddingLeft: '40px'
  }
})

const pages = [];

const Topbar = (props) => {

  const {
    login,
    disconnect,
    socketRef,
    checked,
    handleChange,
    selectedDelivery,
    handleChangeDelivery,
    deliveries,
    users,
    setSeeChat,
    seeChat,
    setDrawerOpen,
    drawerOpen
  } = props

  const history = useHistory();

  const classes = useStyles()

  const goToLink = (page) => {
    history.push(`${page.to}`);
  }


  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MapIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Box
            className={classes.brand}
            sx={{ display: { xs: 'none', md: 'flex' }}}
          >
            Seb-Wockets
          </Box>
          {login &&
          <Box sx={{ flexGrow: 1, display: { xs: 'block', sm: 'flex' }, alignItems: { sm: 'center'} }}>
            <FormGroup>
              {/* <FormControlLabel 
                control={<Switch
                  checked={checked}
                  onChange={handleChange}
                  color="default"
                />} 
                label="Solo MIS pedidos" 
              /> */}
                    
            </FormGroup>
            <FormControl sx={{ m: 1, minWidth: 250 }}>
              <InputLabel 
                sx={{ my: 2, color: 'white', display: 'block' }}
                id="delivery-select"
              >
                Fitrar Pedidos
              </InputLabel>
              <Select
                sx={{ my: 2, color: 'white', display: 'block' }}
                labelId="delivery-select"
                id="demo-simple-select"
                value={selectedDelivery}
                label="Fitrar Pedidos"
                onChange={handleChangeDelivery}
              >
                <MenuItem value="">All</MenuItem>
                {checked ? 
                  deliveries.map((delivery) => {
                    if (delivery.user_id === users[0]?.id){
                      return (
                        <MenuItem key={delivery.id} value={delivery.id}>{delivery.id}</MenuItem>
                      )
                    }
                  }) : 
                  deliveries.map((delivery) => (
                    <MenuItem key={delivery.id} value={delivery.id}>{delivery.id}</MenuItem>
                  ))
                }
              </Select>
              <FormHelperText sx={{ color: 'white', display: 'block' }}>
                Filtre para ver un chat especifico, si es autor del pedido podra enviar mensajes
              </FormHelperText>
            </FormControl>
            <div className={classes.buttonsContainer}>
              <Button
                sx={{ my: 2, color: 'white' }}
                onClick={() => setSeeChat(!seeChat)}
                startIcon={<ChatIcon />}
              >
                Chattear
              </Button>
              
              <Button
                sx={{ my: 2, color: 'white' }}
                onClick={() => setDrawerOpen(!drawerOpen)}
                startIcon={<AddIcon />}
              >
                Nuevo Pedido
              </Button>
            </div>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => goToLink(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          }
          {login && 
            <Button
              onClick={() => disconnect(socketRef)}
              sx={{ my: 2, color: 'white', display: 'flex' }}
              startIcon={<LogoutIcon />}
            >
              LogOut
            </Button>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Topbar;