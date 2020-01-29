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

export default function ChangePasswordModal(props){

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    var [password, setPassword] = React.useState("");
    var [confirmPassword, setConfirmPassword] = React.useState("");
    var [formErrorsPassword, setFormErrorsPassword] = React.useState("");
    var [formErrorsConfirmPassword, setFormErrorsConfirmPassword] = React.useState("");

    var pin = sessionStorage.getItem("PIN");
    
      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
  
      const settingPassFalse = (value) => {
        setFormErrorsPassword("Minimum 6 characters required")
        setPassword(value)
      }
  
      const settingPassTrue = (value) => {
        setFormErrorsPassword("")
        setPassword(value)
      }
  
      const settingConfirmPassFalse = (value) => {
        setFormErrorsConfirmPassword("Password is not same")
        setConfirmPassword(value)
      }
  
      const settingConfirmPassTrue = (value) => {
        setFormErrorsConfirmPassword("")
        setConfirmPassword(value)
      }
  
      const onChange = (e) =>{
        e.preventDefault();
        const {id, value} = e.target;
        
        switch(id){
          case "password":
            formErrorsPassword = value.length < 6
            ? settingPassFalse(value)
            : settingPassTrue(value)
            break;
    
          case "confirmPassword":
            formErrorsConfirmPassword = value != password
            ? settingConfirmPassFalse(value)
            : settingConfirmPassTrue(value)
            break;
          
          default:
            break;
        }
        // this.setState({formErrors+[id] : value}, console.log(this.state))
        console.log("PASS", password)
        console.log("CONFIRMPASS", confirmPassword)
        console.log("FORMERRORPASS", formErrorsPassword)
        console.log("FORMERRORCONFIRMPASS", formErrorsConfirmPassword)
      }
  
  
  
  
  
      return(
        <div>
        {console.log("PIN", pin)}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Save
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
                            type="password"
                            label="Password"
                            id="password"
                            margin="normal"
                            required
                            fullWidth 
                            onChange = {onChange}
                            helperText = {formErrorsPassword}
                            error ={formErrorsPassword.length === 0 ? false : true}
                            />
                                 {sessionStorage.removeItem("PIN")}   
                          <TextField 
                            variant="outlined"
                            type="password"
                            label="Confirm Password"
                            id="confirmPassword"
                            margin="normal"
                            required
                            fullWidth 
                            onChange = {onChange}
                            helperText = {formErrorsConfirmPassword}
                            error ={formErrorsConfirmPassword.length === 0 ? false : true}
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
      )
  }
