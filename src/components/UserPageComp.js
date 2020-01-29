import React, {useEffect, useState, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import LinearListComp from './LinearList/LinearListComp'
import SquareGrid from './SquareGrid'
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import AddCircle from '@material-ui/icons/AddCircle';


import images from '../images/podlogo_text_dark.png';

import Paper from '@material-ui/core/Paper';

import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';

import { CircularProgress } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import ButtonBase from '@material-ui/core/ButtonBase';

import EditProfileModal from './EditProfileModal';
import CreatePlaylist from './CreatePlaylist';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop:20,
    marginBottom: 20,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: 'none',
  },
  account: {
    width:150,
    height:150,
  },
  info: {
    textAlign:"left",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  cpass: {
    width: '95%',
  },
  card: {
    maxWidth: 345,
    height : 220,
  },
  card2: {
    maxWidth: 500,
    height : 50,
    margin: 10,
    padding: 5,
  },
  media: {
    height: 0,
    paddingTop: '75%', // 4:3
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  link :{
      textDecoration : 'none',
      color : '#3c0b65',
  },
  content :{
      textAlign : 'center',
      alignItems : 'center',
      
  },
  titlegrid:{
    color : '#100a26',
    margin : theme.spacing(2),
},
paper: {
  padding: theme.spacing(2),
  margin: 'auto',
  marginBottom : theme.spacing(2),
  maxWidth: 800,
  
},
image2: {
  height : 20,
  width: 20,
  margin: 5,
},
image3: {
  height : 30,
  width: 30,
  margin: 5,
},
paperEps :{
  padding: theme.spacing(2),
  margin: 'auto',
  marginBottom : theme.spacing(2),
  maxWidth: 800,
},
}));








export default function UserPageComp() {
  const classes = useStyles();
  const username = sessionStorage.getItem("username");
  const [recently, setRecently] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const [doneRecently, setDoneRecently] = useState(undefined)
  const [doneSubscription, setDoneSubscription] = useState(undefined)
  const [donePlaylist, setDonePlaylist] = useState(undefined)

  const [displayPIN, setDisplayPIN] = useState(false);

  const [validate, setValidate] = useState(undefined);

  let history = useHistory();
  
  var loadingItem =['','','','','',''];

  var jwt = sessionStorage.getItem("JWT");
  var uuid = sessionStorage.getItem("uuid");

  useEffect(()=>{
    
    axios.get(`http://localhost:80/api/recent_play/?token=${jwt}&username=${username}`)
    .then(
        (res => {
         setRecently(res.data.episodes)
         setDoneRecently(true)
        }))
    .catch(function(error){
        console.log(error);
    })

    axios.get(`http://localhost:80/api/getSubscribedPodcast/?token=${jwt}`)
      .then(
          (res) => {
              console.log("Get Subscription for UserPage succesful")
              console.log(res)
              setSubscription(res.data.podcasts)
              setDoneSubscription(true)
          } 
      )
      .catch(function(error){
          console.log(error);
      })
         
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
    } , [jwt,username]);

    const handleSetting = () =>{
      if (displayPIN == true)  setDisplayPIN(false) 
      else setDisplayPIN(true)

      axios.post(`http://localhost:80/api/changepwd?token=${jwt}`)
          .then(
              (res =>{
                  if(res.status == 200){
                      console.log("PIN Sent successful")
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
    }

    const onChange = (e) =>{
      e.preventDefault();
      setValidate(e.target.value);
      console.log(validate)
    }

    const handleSubmit = () =>{
      alert(validate);
      var payload={
        "reset_pwd" : validate,
        "email" : "jlohil1505@gmail.com"
      }
        axios.post('http://localhost:80/main/checkResetPwd',payload)
        .then(
            function(res){
                if(res.status == 200 ){
                    console.log("PIN matched")
                  }
          
                  else if(res.status == 401 ){
                    console.log("PIN Not Match");
                  }
                  else{
                    console.log("RES", res)
                  }
            }
        )       
        .catch(function(error) {
          console.log(error);
          alert("Network Error, Please try again");
        });
    }


  return (
    <div className={classes.root}>
      <Container fixed>
        <Grid 
          container 
          spacing={3}
          direction="row"
          justify="center"
          alignItems="flex-start" 
          className={classes.grid}>
          <Grid item xs={2}>
            <AccountCircle className={classes.account}/>
          </Grid>
          <Grid item xs={7}>
            <Grid 
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={3}
              className={classes.gridinfo}>
                <Grid item xs={12} className={classes.info}>
                  User
                </Grid>
                <Grid item xs={12} className={classes.info}>
                  <Typography variant="h3">
                  {username}
                  </Typography>
                  
                </Grid>
                <Grid item xs={12} className={classes.info}>
                <Button variant="contained" color="primary" onClick={handleSetting}>
                  Setting
                </Button>
                {displayPIN ? 
                <Paper className={classes.paperEps}>
                  <Typography  variant="h4">Verify !</Typography> 
                  <Typography variant="subtitle2">NB: PIN has been sent to your email</Typography>
                  <form noValidate autoComplete="off">
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
                          <Button variant="contained" color="secondary" style={{margin: "25px"}} onClick={handleSubmit}>Submit</Button> 
                  </form>
                </Paper>
                 : null }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} 
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end">
            
          </Grid>
        </Grid>

        {/* Subscription */}

        {!doneSubscription ? (
          <div>
              <Grid container spacing={7}>
                  <Grid item xs >
                      <Skeleton width="50%"/>
                  </Grid>
              </Grid> 
              <Grid container spacing={3}>
                  {loadingItem.map((item,i)=>
                      <Grid item xs={2}>
                      <Skeleton variant="rect" width={190} height={118} />
                      <Box pt={0.5}>
                          <Skeleton />
                          <Skeleton width="60%" />
                      </Box>
                  </Grid>
                  )}
              </Grid>
          </div>
        ) : (
        <div>
            <Grid container alignItems="center" justify="left">
                <Grid item className={classes.titlegrid} >
                    <Typography variant="h4">
                        Subscription
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {subscription.slice(0,6).map((item,i)=>
                    <Grid item xs={2}>
                        <Card className={classes.card}>
                            <Link to={{
                            pathname : `/showpage/${item.uuid}`,
                            state : {
                                eps_id : `${item.uuid}`
                            }
                        }} className={classes.link}>
                        <CardMedia
                            className={classes.media}
                            image={item.image}
                        />
                        <CardContent className={classes.content}>
                            <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                                <Typography variant="body2" className={classes.content}>
                                {item.title}
                                </Typography>
                        </Grid>
                        </CardContent>
                        </Link>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {subscription.slice(0,6).length == 6 &&
            <Grid 
                container 
                spacing={1}
                direction="row"
                justify="flex-end"
                alignItems="center">
                <Grid item xs={1}>
                    <Link to="/subscription">
                        <h5>Show More >></h5>
                    </Link>
                </Grid>
            </Grid>
            } 
        </div>
        )}     
        
        {/* Recently Played */}

        {! doneRecently ? (
          <div>
                <Grid container spacing={7}>
                    <Grid item xs >
                        <Skeleton width="50%"/>
                    </Grid>
                </Grid> 
                <Grid container spacing={3}>
                    {loadingItem.map((item,i)=>
                        <Grid item xs={2}>
                            <Skeleton variant="rect" width={190} height={118} />
                            <Box pt={0.5}>
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </div>
        ) : (
        <div>
            {recently.length !== 0 &&
            <Grid container alignItems="center" justify="left">
                <Grid item className={classes.titlegrid} >
                    <Typography variant="h4">
                        Recently Played
                    </Typography>
                </Grid>
            </Grid>
            }
            <Grid container spacing={3}>
                {recently.slice(0,6).map((item,i)=>
                    <Grid item xs={2}>
                        <Card className={classes.card}>
                            <Link to={{
                            pathname : `/episodepage/${item.uuid}`,
                            state : {
                                eps_id : `${item.uuid}`
                            }
                        }} className={classes.link}>
                        <CardMedia
                            className={classes.media}
                            image={item.podcast.image}
                        />
                        <CardContent className={classes.content}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center">
                                    <Typography variant="body2" className={classes.content}>
                                        {item.title}
                                    </Typography>
                            </Grid>
                        </CardContent>
                        </Link>
                        </Card>
                    </Grid>
                    
                )}
            </Grid>
                {recently.slice(0,6).length == 6 &&              
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <Grid item xs={1}>
                        <Link to="/recentlyplayed">
                            <h5>Show More >></h5>
                        </Link>
                    </Grid>
                </Grid>
                }
        </div>
        )}

        {/* Playlist */}

        {! donePlaylist ? (
          <div>
            <Grid container spacing={7}>
              <Grid item xs >
                <Skeleton width="50%"/>
              </Grid>
            </Grid> 
            <Grid container xs={12}spacing={2}>
              {loadingItem.map((item,i)=>
                  <Grid container xs={5}spacing={2}>
                      <Grid item xs={3}>
                          <Skeleton variant="rect" width={80} height={80}/>
                      </Grid>

                      <Grid item xs={7} sm container>
                          <Skeleton width="80%"/>
                          <Skeleton width="60%" />    
                              
                      </Grid>
                  </Grid>
              )}
            </Grid>
          </div>
        ) : (
        <div>
            {recently.length !== 0 &&
            <Grid container alignItems="center" justify="left">
                <Grid item className={classes.titlegrid} >
                    <Typography variant="h4">
                        Playlist
                    </Typography>
                </Grid>
            </Grid>
            }
            <Grid container spacing={3}>
              <Grid item xs={4}>
                  <Paper className={classes.paper}>
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
                  </Paper>
              </Grid>
            </Grid>
              {playlist.map((item,i)=>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Link to={{
                      pathname : `/playlistPage/${item.sn}`,
                  }} className={classes.link}>
                    <Paper className={classes.paper}>
                      <ButtonBase
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="text"
                        color="inherit">
                          <img className={classes.image3} alt="complex" src={images} />
                          <Typography variant="h6"> 
                            {item.name == "" ? "-" : item.name}({item.episodes.length})
                          </Typography>

                      </ButtonBase>
                    </Paper>
                  </Link>
                </Grid>
              </Grid>
                
              )}
            
                {playlist.slice(0,6).length == 6 &&              
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <Grid item xs={1}>
                        <Link to="/playlist">
                            <h5>Show More >></h5>
                        </Link>
                    </Grid>
                </Grid>
                }
        </div>
        )}
      </Container>
    </div>
  );
}
