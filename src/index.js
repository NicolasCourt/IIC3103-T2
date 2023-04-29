import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import { get } from './utils/api';

import Base from './Views/Base.js';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [loading, setLoading] = useState(false)

  const socketRef = useRef(null);

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("Success")
  const [severity, setSeverity] = useState("success")

  const [last_delivery, setLast_delivery] = useState(false)
  const [search_delivery, set_search_delivery] = useState(false)

  const [users, setUsers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [destinations, setDestinations] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [positions, setPositions] = useState({})
  const [chats, setChats] = useState([])
  const [deliveryStatusDict, setDeliveryStatusDict] = useState({})
  const [products, setProducts] = useState([])

  const [deliveriesStatuses, setDeliveriesStatuses] = useState([])

  const [login, setLogin] = useState(false)
  const [lastDeliveries, setLastDeliveries] = useState([])
  const [data, setMessageRecieved] = useState(false)

  useEffect(() => {

    const populateProducts = async () => {
      let newproducts = []
      let page = 1
      let courses = true
      while (courses){
        const response = await get(`/courses?page=${page}`)
        newproducts = [...newproducts, ...response.data.items]
        if (page === response.data.pages){
          courses = false
        } else {
          page += 1
        }
      }

      page = 1
      let ingredients = true
      while (ingredients){
        const response = await get(`/ingredients?page=${page}`)
        newproducts = [...newproducts, ...response.data.items]
        if (page === response.data.pages){
          ingredients = false
        } else {
          page += 1
        }
      }

      setProducts(newproducts)
    }

    populateProducts()

  }, [])

  const isEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    
    return arr1.every((obj1) => {
      const obj2 = arr2.find((o) =>
        Object.keys(o).length === Object.keys(obj1).length &&
        Object.keys(o).every((key) => obj1.hasOwnProperty(key) && obj1[key] === o[key])
      );
      
      return obj2 !== undefined;
    });
  };


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  
    setDeliveriesStatuses((prevQueue) => {
      const updatedQueue = [...prevQueue];
      updatedQueue.pop();
      return updatedQueue;
    });
  };

  useEffect(() => {
    if (deliveriesStatuses.length > 0) {
      const timerId = setTimeout(() => {
        setDeliveriesStatuses((prevQueue) => prevQueue.slice(1));
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [deliveriesStatuses]);


  useEffect(() => {

    if (socketRef.current){
      if (data.type === "disconnected") {
        setLogin(false)
        setMessage("Disconnected")
        setSeverity("warning")
        setOpen(true)

      } else if (data.type === "denied") {
        setMessage(`Denied reason: ${data.payload.reason}`)
        setSeverity("warning")
        setOpen(true)
        setLoading(false)
        setLogin(false)

      } else if (!login) {
        setDeliveriesStatuses([... deliveriesStatuses, "Login Successful"])
        setIsAuthenticated(true)
        setLoading(false)
        setLogin(true)
      }

      if (data.type === "USERS"){
        setUsers(data.payload)
      } else if (data.type === "RESTAURANTS"){
        setRestaurants(data.payload)
      } else if (data.type === "DESTINATIONS"){
        setDestinations(data.payload)
      } else if (data.type === "DELIVERIES"){
        if (search_delivery){
          setLast_delivery(data.payload[data.payload.length - 1])
          set_search_delivery(false)
        }
        if (last_delivery){
          let found = false
          data.payload.map((delivery) => {
            if (delivery.id === last_delivery.id){
              found = true
            }
          })
          if (!found){
            setLast_delivery(false)
          }
        }
        if (!isEqual(lastDeliveries, data.payload)){
          setLastDeliveries(data.payload)
          setDeliveries(data.payload)
        } 

      } else if (data.type === "POSITION"){
        setPositions(prevPositions => {
          const updatedPositions = { ...prevPositions };
          const deliveryId = data.payload.delivery_id;
          const newPosition = [data.payload.position.lat, data.payload.position.long];
          
          if (updatedPositions[deliveryId]) {
            updatedPositions[deliveryId] = [...updatedPositions[deliveryId], newPosition];
          } else {
            updatedPositions[deliveryId] = [newPosition];
          }
          
          return updatedPositions;
        });
    } else if (data.type === "CHAT"){
        setChats(prevChats => [... prevChats, data.payload])

      } else if (data.type === "DELIVERY_STATUS"){
        setDeliveriesStatuses((prevQueue) => [...prevQueue, `${data.payload.status} delivery_id: ${data.payload.delivery_id}`]);
        setDeliveryStatusDict(prevDict => {
          const updatedDict = { ...prevDict};
          const delivery_id = data.payload.delivery_id
          const status = data.payload.status
          updatedDict[delivery_id] = status
          
          return updatedDict
        })

      } else {
        console.log(`Received message: ${data}`);
      }
    }

  }, [data, socketRef])

  const connect = (socketRef, token) => {
    socketRef.current = new WebSocket('wss://tarea2-2023-1-dev-z2fqxmm2ja-uc.a.run.app/connect');    

    socketRef.current.addEventListener('open', () => {
      socketRef.current.send(JSON.stringify({ "type": "JOIN", "payload": { "authorization": `Basic ${token}`}}))
    });

    socketRef.current.addEventListener('message', (event) => {
      setMessageRecieved(JSON.parse(event.data))
    });

    socketRef.current.addEventListener('error', (event) => {
      console.error('WebSocket error', event);
    });

    socketRef.current.addEventListener('close', (event) => {
      setLoading(false)
      setIsAuthenticated(false)
      setMessage("Connection closed")
      setSeverity("warning")
      setOpen(true)
    });
  }

  const disconnect = (socketRef) => {
    setIsAuthenticated(false)
    socketRef.current.close();
    setMessage("Logout Successful")
    setSeverity("success")
    setOpen(true)
  }

  const send = (socketRef, payload) => {
    if (JSON.parse(payload).type === "ORDER"){
      set_search_delivery(true)
    }
    socketRef.current.send(payload)
  }

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Base 
              {...props} 
              connect={connect} 
              disconnect={disconnect} 
              socketRef={socketRef} 
              isAuthenticated={isAuthenticated} 
              loading={loading} 
              setLoading={setLoading}
              open={open}
              setOpen={setOpen}
              message={message}
              setMessage={setMessage}
              severity={severity}
              setSeverity={setSeverity}
              users={users}
              restaurants={restaurants}
              destinations={destinations}
              deliveries={deliveries}
              positions={positions}
              chats={chats}
              deliveriesStatuses={deliveriesStatuses}
              handleClose={handleClose}
              send={send}
              deliveryStatusDict={deliveryStatusDict}
              setDeliveriesStatuses={setDeliveriesStatuses}
              products={products}
              last_delivery={last_delivery}
            />
          )}
        />        
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));