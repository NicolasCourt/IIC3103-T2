import React, { useState, useEffect, useRef } from "react";
import { createTheme, makeStyles } from '@material-ui/core/styles';
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme();

const useStyles = makeStyles(theme => ({
  containerReview: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '100px',
    paddingLeft: '100px',
    paddingTop: '10%',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '20px',
      paddingLeft: '20px'
    }
  },
  titleReview: {
    color: '#f5b63e',
    fontSize: '30px',
    fontWeight: '700',
    paddingBottom: '20px',
    alignSelf: 'center'
  },
  back: {
    position: 'absolute',
    top: '5%',
    left: '10%'
  },
  scrollable: {
    height: window.innerHeight < 700 ? window.innerHeight*5/9 : window.innerHeight*7/11,
    overflowY: 'scroll'
  },
  messageBox: {
    paddingTop: '30px',
    display: 'flex',
    flexDirection: 'row'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '13px'
  },
  date: { 
    fontWeight: 'bold',
    fontSize: '12px'
  }
  
}))

const Chat = (props) => {

  const {
    setDrawerOpen,
    drawerOpen,
    chats,
    send,
    socketRef
  } = props

  const classes = useStyles()

  const [orderedChat, setOrderedChat] = useState([])
  const [newMessage, setNewMessage] = useState([])
  const [currentId, setCurrentId] = useState('')
  const [idList, setIdList] = useState([])

  const [autoScroll, setAutoScroll] = useState(true)

  const chatDivRef = useRef(null);


  const handleScroll = () => {
    if (
      chatDivRef.current.scrollTop + chatDivRef.current.clientHeight !==
      chatDivRef.current.scrollHeight
    ) {
      setAutoScroll(false);
    } else {
      setAutoScroll(true);
    }
  };

  useEffect(() => {
    const ids = []
    const sorted = chats.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (autoScroll) {
      setTimeout(() => {
        chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
      }, 10);
    }

    chats.map((chat) => {
      if (!ids.includes(chat.delivery_id)){
        ids.push(chat.delivery_id)
      }

    })
    setIdList(ids)
    setOrderedChat(sorted);

  }, [chats])

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
     {/*  <FormControl fullWidth>
        <InputLabel id="label-1">Delivery ID</InputLabel>
        <Select
          labelId="label-1"
          id="select-1"
          name="delivery_id"
          value={currentId}
          label="DeliveryID"
          onChange={(e) => setCurrentId(e.target.value)}
        >
          <MenuItem value=''>All</MenuItem>
          {idList.map((id) => {
            return (<MenuItem value={id}>{id}</MenuItem>)
          })}
        </Select>
      </FormControl> */}
      <a className={classes.titleReview}>Chat</a>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div 
          className={classes.scrollable}
          ref={chatDivRef}
          onScroll={handleScroll}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              p: 2,
            }}
          >

            {orderedChat.map((message, index) => {
              if (currentId === '' || message.delivery_id === currentId){
                return (
                  <Box key={index} sx={{ backgroundColor: message.level === 'info' ? '#dfd7e0' : '#e0e0d7', p: 1, borderRadius: '8px', maxWidth:'50%', alignSelf: message.level === 'info' ? 'start' : 'end' }}>
                    <p className={classes.name}>{message.name}</p>
                    <p className={classes.content}>{message.content}</p>
                    <p className={classes.date}>{message.date.split(".")[0]}</p>
                  </Box>
                )
              }
            })}
          </Box>
        </div>
        <div className={classes.messageBox}>
          <TextField id="standard-basic-1" name="message" label="Message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}  />
          <Button
            onClick={() => {
              send(socketRef, JSON.stringify({"type": "MESSAGE", "payload": { "content": newMessage, "delivery": currentId}}))
              setNewMessage("") 
            }} 
            endIcon={<SendIcon />}
            disabled={currentId !== ''}
          >
            Send
          </Button>
        </div>
      </Box>
    </div>
  )
}

export default Chat;
