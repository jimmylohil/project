import React, {useEffect, useState} from 'react';
import {useHistory,Router, Redirect} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

import ButtonBase from '@material-ui/core/ButtonBase';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField'

import ChangePasswordModal from './ChangePasswordModal';


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
textField: {
    width:410,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonPass: {
    width:390,
    margin : theme.spacing(3),
  },
}));

export default function ValidationPasswordModal(){
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [donePIN, setDonePIN] = React.useState(false);
  
    var [validate, setValidate] = React.useState("");


    var jwt = sessionStorage.getItem("JWT");
    
      const handleOpen = () => {
        setOpen(true);

          axios.post(`http://localhost:80/api/changepwd?token=${jwt}`)
          .then(
              (res =>{
                  if(res.status == 200){
                      console.log("Send successful")
                      setDonePIN(true)
                    }
            
                    else if(res.status == 200 ){
                      console.log("Denied");
                    }
              }),
                  
          )
          .catch(function(error)
          {
          console.log(error);
          alert("Network Error, Please try again");
          });

      };
    
      const handleClose = () => {
        setOpen(false);
      };
  
      const onChange = (e) =>{
        e.preventDefault();
        setValidate(e.target.value);
        console.log(validate)
        sessionStorage.setItem("PIN",validate)
      }

      const handleSubmit = () => {
        var payload={
          "reset_pwd" : validate,
          "email" : "jlohil1505@gmail.com"
        }
          axios.post(`http://localhost:80/main/checkResetPwd`,payload)
          .then(
              (res =>{
                  if(res.status == 200){
                      console.log("Send successful")
                      return <Redirect to="/home" />
                    }
            
                    else if(res.status == 401 ){
                      console.log("Denied");
                    }
              }),
                  
          )
          .catch(function(error)
          {
          console.log(error);
          alert("Network Error, Please try again");
          });

      };

      const sentMail =()=>{
        alert("PIN has been sent to email")
        setDonePIN(false)
      }
  
      return(
        <div>
          {donePIN ? sentMail() : null}
          <Button variant="contained" color="primary" onClick={handleOpen} className={classes.buttonPass}>
            Change Password
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
                          direction="column"
                          justify="center"
                          alignItems="stretch"
                          >
                          
                          <TextField 
                            variant="outlined"
                            type="validate"
                            label="PIN"
                            id="validate"
                            margin="normal"
                            required
                            fullWidth 
                            onChange = {onChange}
                            />

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
                                <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button> 
                                
                            </Grid>
                          </Grid> 
                        </Grid>
                    </form>
                  </Grid> 
                </Grid> 
            </div>
          </Modal>
        </div>
      )
  }
