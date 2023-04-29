import React, { useEffect, useState } from "react";
import Login from "../shared/login";

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';

import Map from "../shared/map";
import Form from "../shared/form";
import Content from "../shared/content";
import Chat from "../shared/chat";

const useStyles = makeStyles({
  selectContainer: {
  }
})

const Base = (props) => {

  const {
    connect,
    disconnect,
    socketRef,
    isAuthenticated,
    loading,
    setLoading,
    open,
    setOpen,
    message,
    severity,
    users,
    restaurants,
    destinations,
    deliveries,
    positions,
    chats,
    deliveriesStatuses,
    handleClose,
    send,
    deliveryStatusDict,
    setDeliveriesStatuses,
    products,
    last_delivery
  } = props

  const classes = useStyles()

  const [selectedDelivery, setSelectedDelivery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checked, setChecked] = useState(false);
  const [seeChat, setSeeChat] = useState(false)

  const handleChangeDelivery = (event) => {
    setSelectedDelivery(event.target.value);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    setSeeChat(false)
    setDrawerOpen(false)
    setChecked(false)
  }, [])

  return (

    <div>
      {
      ( 
        isAuthenticated
      ) ? (
        <Content 
          login={isAuthenticated} 
          disconnect={disconnect} 
          socketRef={socketRef}
          checked={checked}
          handleChange={handleChange}
          selectedDelivery={selectedDelivery}
          handleChangeDelivery={handleChangeDelivery}
          deliveries={deliveries}
          users={users}
          setSeeChat={setSeeChat}
          seeChat={seeChat}
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
        >
          <div className={classes.selectContainer}>
            
            <Drawer
              anchor={'right'}
              open={drawerOpen}
              onClose={() => setDrawerOpen(!drawerOpen)}
            >
              <Form 
                setDeliveriesStatuses={setDeliveriesStatuses}
                deliveriesStatuses={deliveriesStatuses}
                setDrawerOpen={setDrawerOpen}
                drawerOpen={drawerOpen}
                restaurants={restaurants}
                destinations={destinations}
                send={send}
                socketRef={socketRef}
                products={products}
                deliveries={deliveries}
                last_delivery={last_delivery}
              />
            </Drawer>
            <Drawer
              anchor={'right'}
              open={seeChat}
              onClose={() => setSeeChat(!seeChat)}
            >
              <Chat 
                chats={chats}
                setDrawerOpen={setSeeChat}
                drawerOpen={seeChat}
                send={send}
                socketRef={socketRef}
              />
            </Drawer>
          </div>
          <Map 
            deliveries={checked ? deliveries.filter((delivery) => delivery.user_id === users[0]?.id) : deliveries}
            restaurants={restaurants}
            destinations={destinations}
            positions={positions}
            selectedDelivery={selectedDelivery}
            users={users}
            deliveryStatusDict={deliveryStatusDict}
            products={products}
          />
          <Snackbar 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 
            open={open} 
            autoHideDuration={3000} 
            onClose={() => setOpen(!open)}>
            <Alert variant="filled" severity={severity}>
              {message}
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={deliveriesStatuses.length > 0}
            autoHideDuration={1000}
            onClose={handleClose}
          >
            <Alert variant="filled" severity="success">{deliveriesStatuses[0]}</Alert>
          </Snackbar>
        </Content> 
      ) : (
        <Content login={isAuthenticated}>
          <Login 
            socketRef={socketRef} 
            connect={connect} 
            loading={loading} 
            setLoading={setLoading}
            open={open}
            setOpen={setOpen}
            message={message}
            severity={severity}
          />    
        </Content>
        
      )}
    </div>
  )
}

export default Base