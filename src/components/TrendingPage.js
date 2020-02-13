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
            loadingItem :['','','','','','','','','',''],
            trending : [],
            showPlayer : false,
            willPlay : [],
            doneTrending : undefined,
        }
        this.handlePlayButton = this.handlePlayButton.bind(this);
        this.Duration = this.Duration.bind(this);
        this.pad = this.pad.bind(this);
        this.format = this.format.bind(this);
        this.PublishDate = this.PublishDate.bind(this);
    }

    secondsToHms(d){
        d = Number(d);
      
        
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 %60);
        
        return ('0' + m).slice(-2) + ":" + ('0'+s).slice(-2);
      }
      

    componentDidMount(){
        var jwt = sessionStorage.getItem("JWT")
        axios.get(`http://localhost:80/api/trending?token=${jwt}`)
        .then(
            (response) => {
                console.log("Get Latest Eps succesful")
                console.log(response)
                this.setState(
                    {
                        trending : response.data.episodes,
                        doneTrending : true,
                    }
                )
                console.log(this.state.trending)
            } 
        )

        .catch(function(error){
            console.log(error);
        })
    };

    handlePlayButton(e){
        const value = e.target.id;
        console.log (value);

        sessionStorage.setItem("uuid", value)
        

    
    }

    Duration({className, seconds}){
        return(
      
          <time dateTime= {`P${Math.round(seconds)}S`} className = {className}>
            {this.format(seconds)}
          </time>
        )
      };

    pad(string){
        return ('0' + string).slice(-2)
      }

    format(seconds){
        const date = new Date(seconds * 1000)
        const hh = date.getUTCHours()
        const mm = date.getUTCMinutes()
        const ss = this.pad(date.getUTCSeconds())
        if(hh){
          return `${hh}:${this.pad(mm)}:${ss}`
        }
        return `${mm}:${ss}`
      }

    PublishDate({className, date}){
        var now = Date.now();
        var publish = new Date(date);
        var seconds = now - publish;

        var yy = Math.floor(seconds/(3600000 * 24 * 365))
        var mm = Math.floor(seconds/(3600000 * 24 * 30))
        var ww = Math.floor(seconds/(3600000 * 24 * 7))
        var dd = Math.floor(seconds/(3600000 * 24 ))
        var hh = Math.floor(seconds/(3600000  ))

        var year = (yy > 1) ? (yy + " years ago") :  
               (yy === 1) ? (yy + " year ago") :
               0
        
        if (year !== 0) {
            return year
        }

        var month = (mm > 1) ? (yy + " months ago") :  
               (yy === 1) ? (yy + " month ago") :
               0
        
        if (month !== 0) {
            return month
        }

        var week = (ww > 1) ? (ww + " weeks ago") :  
               (ww === 1) ? (ww + " week ago") :
               0
        
        if (week !== 0) {
            return week
        }

        var day = (dd > 1) ? (dd + " days ago") :  
               (dd === 1) ? (dd + " day ago") :
               0
        
        if (day !== 0) {
            return day
        }

        var hour = (hh > 1) ? (hh + " hours ago") :  
               (hh === 1) ? (hh + " hour ago") :
               0
        
        if (hour !== 0) {
            return hour
        }

      };

   



    render(){
        const {classes} = this.props;
        const {trending} = this.state;
        
        return (
            
            <div className={classes.root}>

            {/* Check fetching data from backend */}
            { !(this.state.doneTrending == true ) ? <LinearProgress color="secondary" /> : null }
                
            <Grid container alignItems="center" justify="center">
                <Grid item className={classes.titlegrid} >
                    <Typography variant="h2" className={classes.title}>
                        Trending
                    </Typography>
                </Grid>
            </Grid>

            {!this.state.doneTrending ? (
                <div className={classes.circularpaper}>
                    <CircularProgress className = {classes.circular}/>
                </div>
            ): (
            <div>
            {trending.map((item,i) =>{
                return(
                    <Paper className={classes.paper}>
                        
                        <Grid container xs={12}spacing={2}>
                            <Grid item xs={3}>
                                <Link to={{
                                    pathname : `/episodepage/${item.uuid}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                    <ButtonBase className={classes.image}>
                                        <img className={classes.img} alt="complex" src={item.podcast.image} />
                                    </ButtonBase>
                                </Link>
                            </Grid>

                            <Grid item xs={7} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Link to={{
                                    pathname : `/episodepage/${item.uuid}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                    <Grid item xs>
                                    
                                        <Typography gutterBottom variant="h6">
                                            {item.title}
                                        </Typography>
                                        
                                        <Typography variant="subtitle1" gutterBottom>
                                            {item.podcast.author}
                                        </Typography>
                                        <Grid container xs={12}>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <this.Duration seconds={item.audio_length} />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <this.PublishDate date={item.pub_date} />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                        

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
            
        </div> 
        );
       
}
  
}

TrendingPage.propTypes = {
    classes : PropTypes.object.isRequired,
}

export default withRouter(withStyles(useStyles)(TrendingPage));