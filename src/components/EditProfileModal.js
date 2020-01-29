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
import AccountCircle from '@material-ui/icons/AccountCircle';

import ChangePasswordModal from './ChangePasswordModal';
import ValidationPasswordModal from './ValidationPasswordModal';



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
account: {
    width:150,
    height:150,
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
textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonPass: {
    margin : '5' 
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  
  var jwt = sessionStorage.getItem("JWT");
  var username = sessionStorage.getItem("username");
  var uuid = sessionStorage.getItem("uuid");




  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(()=>{ 
        
    } , []);


  return (
    <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Setting
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
                <Grid item xs={12}>   
                  <form noValidate autoComplete="off">
                  <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid item xs={5}>
                        <AccountCircle className={classes.account}/>
                    </Grid>
                  </Grid>
                    <Grid 
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        {/* Username */}
                        <TextField
                            required
                            id="outlined-required"
                            label="Username"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />   
                        {/* Bio */}
                        <TextField
                          required
                          id="outlined-required"
                          label="Bio"
                          className={classes.textField}
                          margin="normal"
                          variant="outlined"
                        />
                        <Grid item xs={12} >
                          <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                          >   
                          <ValidationPasswordModal />   
                          
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
                              <Button variant="contained" color="primary">Save</Button>
                          </Grid>
                        </Grid> 
                      </Grid>
                  </form>
                </Grid> 
              </Grid> 
          </div>
        </Modal>
      </div>
  );
}
