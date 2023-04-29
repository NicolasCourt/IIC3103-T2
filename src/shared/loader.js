import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTopColor: '#09f',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: '$spin 1s ease-in-out infinite',
  },
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
})

const Loader = () => {

  const classes = useStyles()

  return (
    <div className={classes.spinner} />
  )
}

export default Loader