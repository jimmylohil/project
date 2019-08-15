import React, {useEffect, useState, useRef} from 'react';
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
  media: {
    height: 0,
    paddingTop: '75%', // 4:3
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
}));

export default function UserPageComp() {
  const classes = useStyles();
  const username = sessionStorage.getItem("username");
  const [recently, setRecently] = useState([]);

  var jwt = sessionStorage.getItem("JWT");

  useEffect(()=>{
    axios.get(`http://localhost:80/api/recent_play/?token=${jwt}&username=${username}`)
    .then(
        (res => 
         setRecently(res.data.episodes)));
     } , []);



  
  const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

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
          <Grid item xs={6}>
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
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                                >          
                                  <Button variant="contained" color="primary" component={Link} to="/home" className={classes.cpass}>
                                    Change Password
                                  </Button>
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary">
              Be A Podcaster
            </Button>
          </Grid>
        </Grid>
        <LinearListComp type="LinearListUITypeReguler" title="Subscription" />
        
        {/* Recently Played */}
        <Grid container alignItems="center" justify="left">
                    <Grid item className={classes.titlegrid} >
                    <Typography variant="h4">
                        Recently Played
                    </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                {recently.slice(0,6).map((item,i)=>
                item.map((item)=>
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
                ))}
                </Grid>

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


        <SquareGrid title="PlayList" length="2"/>
      </Container>
    </div>
  );
}
