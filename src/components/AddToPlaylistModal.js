import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

import Paper from '@material-ui/core/Paper';
import CreatePlaylist from './CreatePlaylist';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AddCircle from '@material-ui/icons/AddCircle';
import images from '../images/podlogo_text_dark.png';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: 'none',
  },
  image2: {
    height : 20,
    width: 20,
    margin: 5,
  },
  circular :{
    textAlign : 'center',
},
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChoosePlaylist = (sn) => {
    console.log("SN "+ sn);

    var payload ={
      "sn" : sn,
      "uuid" : uuid
    }
    console.log("PAYLOAD" , payload)

    axios.put(`http://localhost:80/api/insertToPlaylist?token=${jwt}&sn=${sn}&uuid=${uuid}`,payload)
    .then(
      res => {
      console.log(res)
      alert("Berhasil")
      }
    )
    setOpen(false)
  }

  var jwt = sessionStorage.getItem("JWT");
  var uuid = sessionStorage.getItem("uuid");

  const [playlist, setPlaylist] = useState([]);
  const [donePlaylist, setDonePlaylist] = useState(undefined)

  useEffect(()=>{ 
    axios.get(`http://localhost:80/api/playlist?token=${jwt}`)
      .then(
          (res) => {
              console.log("Get Palylist for UserPage succesful")
              console.log(res)
              setPlaylist(res.data.playlists)
              setDonePlaylist(true)
          } 
      )
      .catch(function(error){
          console.log(error);
      })
    } , [jwt]);

  return (
    <div>
      <Button 
          variant="contained" 
          color="primary" 
          className={classes.button}
          onClick={handleOpen}>
              Add to Playlist
      </Button>

      <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={handleClose}
      >
      <div style={modalStyle} className={classes.paper}>
          <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justify="center"
          >
                      
          <Grid container xs={12}spacing={2}>
              <Grid item xs={8}>
                <ButtonBase
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  variant="text"
                  color="inherit">
                  <AddCircle className={classes.image2}/>
                    <Typography > 
                        <CreatePlaylist />
                    </Typography>
                </ButtonBase> 
                </Grid>
                {!donePlaylist && <CircularProgress className = {classes.circular}/>}
                {donePlaylist == true ?
                  playlist.map((item,i)=>
                <Grid item xs={8}>
                    <ButtonBase
                      aria-controls="customized-menu"
                      aria-haspopup="true"
                      variant="text"
                      color="inherit"
                      onClick={ () => handleChoosePlaylist(`${item.sn}`)}>
                        <Typography variant="h6"> 
                          {item.name == "" ? "-" : item.name} ({item.episodes.length})
                        </Typography>
                    </ButtonBase>
                  </Grid>
                  )
                  : null}

              </Grid>
             </Grid>

      </div>
      </Modal>
  </div>
  );
}
