import React, { useEffect, useState } from "react";
import { createTheme, makeStyles } from '@material-ui/core/styles';
import { Button } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const theme = createTheme();

const useStyles = makeStyles(theme => ({
  containerReview: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '150px',
    paddingLeft: '150px',
    paddingTop: '75px',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '150px',
      paddingLeft: '150px'
    }
  },
  textFieldContainer: {
    paddingTop: '20px',
    paddingBottom: '20px'
  },
  titleReview: {
    color: '#f5b63e',
    fontSize: '30px',
    fontWeight: '700',
    paddingBottom: '40px'
  },
  button: {
    paddingTop: '35px'
  },
  back: {
    position: 'absolute',
    top: '5%',
    left: '10%'
  }
}))


const Form = (props) => {

  const {
    setDrawerOpen,
    drawerOpen,
    restaurants,
    destinations,
    send,
    socketRef,
    setDeliveriesStatuses,
    deliveriesStatuses,
    products,
    deliveries,
    last_delivery
  } = props

  const [body, setBody] = useState({
    "restaurant_id": "",
    "product_id": "",
    "destination": ""

  })

  const classes = useStyles()
  
  const [hasDelivery, setHasDelivery] = useState(false)

  const handleChange = (e) => {
    setBody({... body, [e.target.name]: e.target.value})
  };

  const handleForm = async () => {
    setDrawerOpen(false)
    setDeliveriesStatuses([... deliveriesStatuses, "PEDIDO CREADO"])
    send(socketRef, JSON.stringify({ "type": "ORDER", "payload": body}))
  }

  useEffect(() => {
    const checkCurrentDelivery = () => {
      deliveries.map((delivery) => {
        if (last_delivery && delivery.id === last_delivery.id){
          setHasDelivery(true)
        }
      })
    }

    checkCurrentDelivery()
  }, [deliveries])

  return (
    <div className={classes.containerReview}>
      <div className={classes.back}>
        <Button
          onClick={() => setDrawerOpen(!drawerOpen)}
          startIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
      </div>
      
      <a className={classes.titleReview}> Crea tu pedido</a>
      <div className={classes.textFieldContainer}>
        <FormControl fullWidth>
          <InputLabel id="label-1">Restaurant</InputLabel>
          <Select
            labelId="label-1"
            id="select-1"
            name="restaurant_id"
            value={body["restaurant_id"]}
            label="Restaurant"
            onChange={handleChange}
          >
            {restaurants.map((r) => {
              return (<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)
            })}
          </Select>
        </FormControl>
      </div>
      {/* <div className={classes.textFieldContainer}>
        <TextField id="standard-basic-1" name="product_id" label="Product" value={body["product_id"]} onChange={handleChange}  />
      </div> */}
      <div className={classes.textFieldContainer}>
        <FormControl fullWidth>
          <InputLabel id="label-2">Product</InputLabel>
          <Select
            labelId="label-2"
            id="select-2"
            name="product_id"
            value={body["product_id"]}
            label="Product"
            onChange={handleChange}
          >
             {products.map((p) => {
              return (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)
            })}
          </Select>
        </FormControl>
      </div>
      <div className={classes.textFieldContainer}>
        <FormControl fullWidth>
          <InputLabel id="label-3">Destination</InputLabel>
          <Select
            labelId="label-3"
            id="simple-select-3"
            name="destination"
            value={body["destination"]}
            label="Destination"
            onChange={handleChange}
          >
            {destinations.map((d) => {
              return (<MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)
            })}
          </Select>
        </FormControl>
      </div>
      <div className={classes.button}>
        <Button  onClick={handleForm} disabled={hasDelivery}>
          Enviar
        </Button>
      </div>
      {hasDelivery && 
        <div>Solo puedes tener 1 pedido a la vez :C</div>}
    </div>
  )
}

export default Form