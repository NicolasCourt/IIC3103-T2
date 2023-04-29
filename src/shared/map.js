import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { makeStyles } from '@mui/styles';
import L from 'leaflet';

const useStyles = makeStyles({
  map: {
    width: '400px'
  }
})

const Map = (props) => {

  const {
    selectedDelivery,
    restaurants,
    deliveries,
    destinations,
    positions,
    users,
    deliveryStatusDict,
    products
  } = props

  const classes = useStyles()

  const [assignedColors, setAssingedColors] = useState({})
  const [n, setN] = useState(0)
  const colors = ['blue', 'red', 'green', 'orange', 'violet', 'grey', 'black']
  
  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
        crossOrigin=""/>
      <div id="map" className={classes.map}>
        <MapContainer
          center={[-33.44272634720482, -70.6722041416586]}
          zoom={11}
          style={{ 
            width: '80vw',
            height: '75vh',
            outline: 'none',
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          {deliveries.map((delivery, index) => {
            if (!assignedColors[delivery.id]){
              setAssingedColors({...assignedColors, [delivery.id]: colors[n]})
              if (n + 1 >= colors.length){
                setN(0)
              } else {
                setN(n + 1)
              }
            }

            const icon = new L.Icon({
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${assignedColors[delivery.id]}.png`,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [12, 41]
            });
            const icon2 = new L.Icon({
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${assignedColors[delivery.id]}.png`,
              iconSize: [17, 25],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [12, 41]
            });
            
            const restaurant = restaurants.find((r) => r.id === delivery.restaurant_id)
            const destination = destinations.find((d) => d.id === delivery.destination_id)

            const items = [restaurant, destination].filter((item) => item != null);
            if (selectedDelivery !== '' && selectedDelivery === delivery.id || selectedDelivery === ''){
              return (
                <div key={index}>
                  {items.map((item, index2) => {
                    return (
                      <div key={index2}>
                        <Marker icon={icon} position={[item?.position?.lat, item?.position?.long]}>
                          <Popup>
                            <div>
                              <p>{index2 === 0 ? 'Restaurant' : 'Destination'}</p>
                              <p>{'id: '}{item?.id}</p>
                              <p>{item?.name}</p>
                              <p>{'Latitud: '}{item?.position?.lat}</p>
                              <p>{'Longitud: '}{item?.position?.long}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </div>
                    );
                  })}
                  {restaurant && 
                    destination && 
                      <Polyline 
                        weight={2}
                        pathOptions={{color: assignedColors[delivery.id]}} 
                        positions={
                          [[restaurant?.position?.lat, restaurant?.position?.long],
                          [destination?.position?.lat, destination?.position?.long]]
                        } 
                      />
                  }
                  {restaurant && 
                    destination && 
                      positions[delivery.id] &&
                        <div>
                          <Polyline weight={5} positions={positions[delivery.id]} pathOptions={{color: assignedColors[delivery.id]}}  dashArray="10, 10" dashOffset="5" />
                          <Marker icon={icon2} position={positions[delivery.id][positions[delivery.id].length - 1]}>
                            <Popup>
                              <div>
                                <p>{'Delivery id: '}{delivery?.id}</p>
                                <p>{'Product: '}{products.find((p) => p.id === delivery?.product_id)?.name}</p>
                                <p>{'Restaurant: '}{restaurants.find((r) => r.id === delivery?.restaurant_id)?.name}</p>
                                <p>{'Destination: '}{destinations.find((d) => d.id === delivery?.destination_id)?.name}</p>
                                <p>{'User: '}{users.find((u) => u.id === delivery?.user_id)?.name}</p>
                                <p>{'Status: '}{deliveryStatusDict[delivery?.id] || "Not defined yet :c"}</p>
                              </div>
                            </Popup>
                          </Marker>
                        </div>
                  } 
                </div>
              )
            }
          })}
        </MapContainer>
      </div>
    </div>
  )
}

export default Map