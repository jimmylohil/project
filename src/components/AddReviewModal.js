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
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [valueModal, setValueModal] = React.useState(0);
  const [review, setReview] = React.useState("");
  
  const [episode, setEpisode] = useState([]);
  const [show, setShow] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  
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
        axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${uuid}`)
        .then(
            (res =>{
                setEpisode(res.data.episode)
                setShow(res.data.episode.podcast)
                setReviewList(res.data.episode.reviews)
            }),
                
        )
        .catch(function(error)
        {
        console.log(error);
        alert("Network Error, Please try again");
        });
    } , [jwt,uuid]);

    const handleReview = () => {
        var apiUrl = `http://localhost:80/api/review/?token=${jwt}&username=${username}&uuid=${uuid}`;
        var payload = {
        "content" : review,
        "rating" : valueModal
        }
        axios.post(apiUrl,payload)
        .then(
        function(response){
            console.log(response);
            
            if(response.status == 200 && response.data.error == null){
            console.log("Review successful");
            alert("Review Success");
            }
            else if(response.status == 200 && response.data.error == true){
            console.log("Review error");
            alert("Review error");
            }
            else{
                alert(response.status)
            }
        }
        
        )
  
        .catch(function(error)
        {
        console.log("ERROR ", error);
        alert("Network Error, Please try again");
        });
        setOpen(false);
      };

  return (
    <div>
      <Button 
          variant="contained" 
          color="primary" 
          className={classes.button} 
          onClick={handleOpen}>
              Review
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
                          <img className={classes.img} alt="complex" src={show.image} />
                      </ButtonBase>
                  </Grid>
              </Grid>
              {/* Episode Name */}
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
                              <h3>{episode.title.length >= 150 ? (episode.title.slice(0,145)).concat('...') : episode.title}</h3>
                          </Grid>
                      </Grid>
                      <Grid item xs ={12}>
                          <h4 className={classes.podcaster}>{show.author}</h4>
                      </Grid>
                  </Grid>
              </Grid>
              <Grid 
                  container 
                  spacing={1}
                  direction="row"
                  justify="center"
                  alignItems="center"
                  >
                  <Rating
                      name="simple-controlled"
                      value={valueModal}
                      className={classes.rating}
                      onChange={(event) => {
                          setValueModal(event.target.value);
                      }}
                      />
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
                          value = {review}
                          onChange={(event) => {
                          setReview(event.target.value);
                      }}
                      />
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
                      <Button variant="contained" color="primary" onClick={handleReview} >Save</Button>
                  </Grid>
                  </Grid>
          </Grid>
          </div>
      </Modal>
  </div>
  );
}
