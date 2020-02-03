import React from 'react';
import {Component} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import podlogo from '../images/podlogo_text_dark.png';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Player from './Player';
import { CircularProgress } from '@material-ui/core';

import LinearProgress from '@material-ui/core/LinearProgress';

import Skeleton from '@material-ui/lab/Skeleton';


const useStyles = theme => ({
  root: {
    flexGrow: 1,
    
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    marginBottom : theme.spacing(2),
    maxWidth: 800,
    
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  play:{
    width:50,
    height:50,
  },
  link:{
      textDecoration : 'none',
      color : '#3c0b65',
  },
  titlegrid:{
      color : '#100a26',
      margin : theme.spacing(5),
      
  },
  title:{
      fontWeight : '500',
  },
  circular :{
      textAlign : 'center',
  },
  center :{
    textAlign : 'center',
},
  circularpaper :{
      padding : theme.spacing(2),
      margin  : 'auto',
      marginBottom : theme.spacing(2),
      textAlign : 'center',
  }
});


class TrendingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            playlist : [],
            donePlaylist : undefined,
        }
    }
      
    componentDidMount(){
        var jwt = sessionStorage.getItem("JWT")
        axios.get(`http://localhost:80/api/playlist?token=${jwt}`)
        .then(
            (response) => {
                console.log("Get Playlist in PlaylistList succesful")
                console.log(response)
                this.setState(
                    {
                        playlist : response.data.playlists,
                        donePlaylist : true,
                    }
                )
                console.log(this.state.playlist)
            } 
        )

        .catch(function(error){
            console.log(error);
        })
    };

    handlePlayButton = (e) => {
        const value = e.target.id;
        console.log (value);

        sessionStorage.setItem("uuid", value)
        

    
    }

   



    render(){
        const {classes} = this.props;
        const {playlist} = this.state;
        
        return (
            
            <div className={classes.root}>

            {/* Check fetching data from backend */}
            { !(this.state.donePlaylist == true ) ? <LinearProgress color="secondary" /> : null }
                
            <Grid container alignItems="center" justify="center">
                <Grid item className={classes.titlegrid} >
                    <Typography variant="h2" className={classes.title}>
                        Playlist
                    </Typography>
                </Grid>
            </Grid>

            {!this.state.donePlaylist ? (
                <div className={classes.circularpaper}>
                    <CircularProgress className = {classes.circular}/>
                </div>
            ): (
            <div>
            {playlist.map((item,i) =>{
                return(
                    <Paper className={classes.paper}>
                        
                        <Grid container xs={12}spacing={2}>
                            <Grid item xs={3}>
                                <Link to={{
                                    pathname : `/playlistPage/${item.sn}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                    <ButtonBase className={classes.image}>
                                        <img className={classes.img} alt="complex" src={podlogo} />
                                    </ButtonBase>
                                </Link>
                            </Grid>

                            <Grid item xs={7} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Link to={{
                                    pathname : `/playlistPage/${item.sn}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                    <Grid item xs>
                                    
                                        <Typography gutterBottom variant="h5">
                                            {item.name == "" ? "-" : item.name}
                                        </Typography>
                                        
                                        <Typography variant="subtitle1" gutterBottom>
                                            Number of Episodes: {item.episodes.length}
                                        </Typography>

                                        <Typography variant="subtitle1" gutterBottom>
                                            Date created: {item.date_created.slice(0,10)}
                                        </Typography>
                                        

                                    </Grid>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                    </Paper>
                );
            })}
            </div>
            )}

            {(this.state.donePlaylist == true && playlist.length == 0) ? <h1 className={classes.center}>You haven’t created any playlist yet</h1> : null }
            
        </div> 
        );
       
}
  
}

TrendingPage.propTypes = {
    classes : PropTypes.object.isRequired,
}

export default withRouter(withStyles(useStyles)(TrendingPage));