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
            trending : [],
            showPlayer : false,
            willPlay : [],
            doneTrending : undefined,
        }
        this.handlePlayButton = this.handlePlayButton.bind(this);
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

    handlePlayButton = (e) => {
        const value = e.target.id;
        console.log (value);

        sessionStorage.setItem("uuid", value)
        

    
    }

   



    render(){
        const {classes} = this.props;
        const {trending} = this.state;
        
        return (
            
            <div className={classes.root}>
                
                <Grid container alignItems="center" justify="center">
                    <Grid item className={classes.titlegrid} >
                    <Typography variant="h2" className={classes.title}>
                        Trending
                    </Typography>
                    </Grid>
                </Grid>

                {!this.state.doneTrending ? (
                    <div className={classes.circularpaper}>
                        <CircularProgress className = {classes.circular} />
        
                        </div>
                 ): (
                     <div>
                         {trending.map((item,i) =>
                {
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
                                         

                                        </Grid>
                                        </Link>
                                    </Grid>
                                </Grid>
                                
                                <Grid container 
                                    xs={2}
                                    spacing={1}
                                    direction="row"
                                    justify="center"
                                    alignItems="center">

                                <IconButton aria-label="Previous" >
                                    <PlayCircleOutline className={classes.play} onClick={this.handlePlayButton} id={item.uuid} />                    
                                </IconButton>
                                    
                                </Grid>
                                </Grid>
                                           
                                

                                
                               
                            </Paper>
                    );
                }
                
                )
            }
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