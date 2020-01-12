import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

import ButtonBase from '@material-ui/core/ButtonBase';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField'

import images from '../images/podlogo_text_dark.png';


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
    padding: theme.spacing(2, 4, 3),
  },
  rating:{
    marginTop:30,
    fontSize:60,
},
title: {
    margin:0,
    textAlign: 'left',
},
podcaster: {
    margin:0,
    MarginBottom:20,
    textAlign: 'left',
},
img: {
    width: 150,
    height: 150,
    margin: '0',
    display: 'block',
},
img1: {
    width: 150,
    height: 80,
    margin: '0',
    display: 'block',
},
textField: {
    width:410,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [valueModal, setValueModal] = React.useState(0);
  const [playlistName, setPlaylistName] = React.useState("");
  
  const [episode, setEpisode] = useState([]);
  const [show, setShow] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  
  var jwt = sessionStorage.getItem("JWT");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  const handleCreatePlaylist = () => {
    var payload = {
    "name" : playlistName,
    }
    axios.post(`http://localhost:80/api/createPlaylist?token=${jwt}`,payload)
        .then(
            (res =>{
                if(res.status == 200 && res.data.error == null){
                    console.log("Create New Playlist Successful");
                    alert("Create New Playlist Successful");
                    }
                    else if(res.status == 200 && res.data.error == true){
                    console.log("Create New Playlist Error");
                    alert("Create New Playlist Error");
                    }
                    else{
                        alert(res.status)
                    }
            }),
                
        )
        .catch(function(error)
        {
        console.log(error);
        alert("Network Error, Please try again");
        });

        setOpen(false);
  };
  


    

  return (
    <div>
      <Button 
          className={classes.button} 
          onClick={handleOpen}>
              Create New Playlist
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
              spacing={1}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              >
              {/* Episode Image */}
              <Grid item xs={5} >
                  <Grid 
                      container 
                      spacing={1}
                      direction="row"
                      justify="center"
                      alignItems="center" >
                      <ButtonBase>
                          <img className={classes.img1} alt="complex" src={images} />
                      </ButtonBase>
                  </Grid>
              </Grid>
              {/* Palylist Name */}
              <Grid item xs={7} >
                  <Grid 
                      container 
                      spacing={1}
                      direction="row"
                      justify="center"
                      alignItems="center"
                      >
                      <Grid item xs ={12}>
                          <Grid 
                          container 
                          spacing={1}
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start">
                            <TextField
                                id="outlined-textarea"
                                label="Review"
                                placeholder="Review Here"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                value = {playlistName}
                                onChange={(event) => {
                                setPlaylistName(event.target.value); }}
                            />
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>

                  
              <Grid 
                  container 
                  spacing={1}
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                  >
                  <Grid item xs ={3}>
                      <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                  </Grid>
                  <Grid item xs ={3}>
                      <Button variant="contained" color="primary" onClick={handleCreatePlaylist} >Save</Button>
                  </Grid>
                  </Grid>
          </Grid>
          </div>
      </Modal>
  </div>
  );
}
