import { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LoginIcon from '@mui/icons-material/Login';

const useStyles = makeStyles({
  formContainer: {
    display: "flex",
    marginLeft: "20%",
    marginRight: "20%",
    paddingTop: "50px",
  },
  textField: {
    paddingBottom: "20px",
  },
  textField2: {
    paddingBottom: "150px",
  }
})

const Login = (props) => {

  const {
    socketRef,
    connect,
    loading,
    setLoading,
    open,
    setOpen,
    message,
    severity,
  } = props

  const classes = useStyles()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    setLoading(true)
    event.preventDefault();
    const token = btoa(`${username}:${password}`)
    connect(socketRef, token)
  };

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleSubmit} 
        style={{     
          "display": "flex",
          "flexDirection": "column",
          "border": "solid 1px",
          "maxHeight": "350px",
          "padding": "50px",
          "backgroundColor": "lightskyblue",
          "borderRadius": "20px",
        }}
      >
        <div className={classes.textField}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div className={classes.textField2}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <Button 
          disabled={loading} 
          variant="contained" 
          color="primary" 
          type="submit" 
          startIcon={<LoginIcon />}
        >
          Login
        </Button>
      </form>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={open} autoHideDuration={6000} onClose={() => setOpen(!open)}>
        <Alert variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;