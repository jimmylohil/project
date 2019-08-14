import React from 'react';
import {Component} from 'react';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext';
import music from '../images/music.jpg';
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';
import back from '../images/back15.png';
import forward from '../images/forward15.png';
import {Howl, Howler} from 'howler';
import ReactHowler from 'react-howler';
import PropTypes from 'prop-types';
import raf from 'raf';
import { thisExpression } from '@babel/types';
import LinearProgress from '@material-ui/core/LinearProgress';
import ReactPlayer from 'react-player';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

function Duration({className, seconds}){
  return(

    <time dateTime= {`P${Math.round(seconds)}S`} className = {className}>
      {format(seconds)}
    </time>
  )
};

function format (seconds){
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if(hh){
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad(string){
  return ('0' + string).slice(-2)
}


const useStyles = theme => ({
  card: {
    display: 'flex',
    height : '100px',
    position: 'fixed',
    bottom: '0',
    zIndex : '100',
    width : '100%',
    
  },
  phantom : {
    display : 'block',
    width : '100%',
    height : '100px',
  },

  details: {
    display: 'flex',
    width : '250px'
  },
  
  content: {
    display : 'flex',
    flexDirection : 'column',
    
  },
  cover: {
    width: '100px',
    height : '100px',
  },

  controls: {
    display: 'flex',
    flexDirection : 'column',
    width : '50%',
    alignItems: 'center',
    justifyContent : 'center',
    margin : '0 auto',
    marginLeft : '0'
  
    
  },
 forwardIcon: {
    height: '24px',
    width: '24px',
  },
  backIcon: {
    height: '24px',
    width: '24px',
  },
  
  
  bar:{
    display : 'flex',
    flexDirection : 'row',
    
  },
  slider : {
      width : 500,
      marginLeft : theme.spacing(2),
      marginRight : theme.spacing(2),
      color : 'blue',
      
      
  },
  volume : {
      display : 'flex',
      flexDirection :'row',
      width : '150px',
      alignItems: 'center',
      marginLeft : 'auto',
      marginRight : '5%',
  },
  hideiframe :{
    display : 'none'
  }

});



class Player extends Component{
  constructor(props){
    super(props);
    this.state = {
      isPlaying : false,
      volume : 1,
      loaded : 0,
      played : 0,
      duration : 0,
      moveSeek : 0,
      url : null,
      title: "",
      epImg : "",
      uuid : "",
      
    }
  }

  

  load = url => {
    this.setState({
      url,
      played : 0,
      loaded : 0,
    })
  }


  // componentDiUpdate(prevProps, prevState){
  //   var storageid = sessionStorage.getItem("uuid");
  //   var jwt = sessionStorage.getItem("JWT");
  //   console.log(storageid)
  //   console.log(prevState.uuid)
  //   if(prevState.uuid !== storageid){
      
  //     this.setState({
  //       uuid : storageid
  //     })
  //     var uuid = this.state.uuid
  //     console.log(uuid)
  //     axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${uuid}`)
  //     .then(
  //       (response) => {
  //           console.log("Get episode successful")
  //           console.log(response)
  //           this.setState(
  //               {
  //                   uuid : response.data.episode.uuid,
  //                   url: response.data.episode.audio,
  //                   title : response.data.episode.title,
  //                   epImg : response.data.episode.podcast.image
  //               }
  //           )
  //           console.log(this.state.url)
  //           console.log(this.state.title)
  //           console.log(this.state.epImg)
            
  //       }
  //   )

  //   .catch(function(error){
  //       console.log(error);
  //   })

  //   }
  // }

  componentDidMount(){
    var jwt = sessionStorage.getItem("JWT");
    var uuid = sessionStorage.getItem("uuid");
    axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${uuid}`)
    .then(
        (response) => {
            console.log("Get episode successful")
            console.log(response)
            this.setState(
                {
                    uuid : response.data.episode.uuid,
                    url: response.data.episode.audio,
                    title : response.data.episode.title,
                    epImg : response.data.episode.podcast.image
                }
            )
            console.log(this.state.url)
            console.log(this.state.title)
            console.log(this.state.epImg)
            
        }
    )

    .catch(function(error){
        console.log(error);
    })
    

};

 
  handleToggle = e =>{
    var isPlaying = this.state.isPlaying;

    this.setState(
      {isPlaying : !isPlaying},
    )

    console.log(isPlaying)
    
  }

  handleOnEnd = () =>{
    this.setState({
      isPlaying : false,
    })
    
  }

  handleOnProgress = state =>{
    console.log('onProgress', state)
    if(!this.state.seeking){
      this.setState(state)
    }
  }

  handleOnDuration = (duration) =>{
    console.log('onDuration', duration)
    this.setState({
      duration
    })
  }

  handleOnSeekMouseDown = (e) => {
    this.setState({ seeking: true })
  }

  handleOnSeekChange = (e) => {
    this.setState({ played: parseFloat(e.target.value) })
    console.log(this.played)
  }

  handleOnSeekMouseUp = (e) => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
    
  }
  
  handleBackward = () =>{
    var duration = this.state.duration;
    var back15sec = 15/duration;
    
    this.player.seekTo(parseFloat(this.state.played)-back15sec)
      
  }
    
  handleForward = () =>{
    var duration = this.state.duration;
    var forward15sec = 15/duration;
    
    this.player.seekTo(parseFloat(this.state.played)+forward15sec)
      
  }
  
  handleVolume = (e,value) => {
    var volume = this.state.volume;
    console.log(value)
    this.setState({
      volume : value,
    })
    console.log(volume)
  }

  ref = player => {
    this.player = player
  }


  render(){
    const {classes} = this.props;
    const {isPlaying} = this.state;
    
    const{url, volume, played, loaded, duration, title, epImg} = this.state

    if(isPlaying == false){
      var ShowPauseIcon = "none"
      var ShowPlayIcon = "inline"
    }
    else{
      var ShowPauseIcon = "inline"
      var ShowPlayIcon = "none"
    }

    return (
        <div>
            <div className={classes.phantom} />
            
            <ReactPlayer 
              ref = {this.ref}
              url= {url}
              playing = {isPlaying}
              volume = {volume}
              onBuffer={() => console.log('onBuffer')}
              onReady={() => console.log('onReady')}
              onStart
              onPlay = {this.handleToggle}
              onDuration = {this.handleOnDuration}
              onSeek={e => console.log('onSeek', e)}
              onProgress={this.handleOnProgress}
              onEnded = {this.handleOnEnd}
              className = {classes.hideiframe}
              />

            <Card className={classes.card}>
              <CardMedia
                className={classes.cover}
                image={epImg}
              />
  
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="subtitle2">
                  {title}
                </Typography>
              </CardContent>
            </div>
  
            <div className={classes.controls}>
              <div className={classes.controlsbutton}>
                <IconButton aria-label="Previous" onClick={this.handleBackward}>
                  <img src={back} className={classes.backIcon} />
                </IconButton>

                <IconButton aria-label="Play/pause" onClick={this.handleToggle}>

                  <PlayArrowIcon style={{display : `${ShowPlayIcon}`}}/>
                  <PauseIcon style={{display : `${ShowPauseIcon}`}}  />

                </IconButton>

                <IconButton aria-label="Next">
                  <img src={forward} className={classes.forwardIcon} onClick={this.handleForward}/> 
                </IconButton>
              </div>

              <div className={classes.bar}>
                <span>
                  <Duration seconds={duration*played} />
                </span>

                <input
                  className = {classes.slider}
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.handleOnSeekMouseDown}
                  onChange={this.handleOnSeekChange}
                  onMouseUp={this.handleOnSeekMouseUp}
                />

                <span>
                  <Duration seconds={duration} />
                </span>
                      
                      
              </div>
            </div>
  
            <div className={classes.volume}>
              <VolumeUp  />
                  
              <Slider className = {classes.volumeSlider} 
                      min = {0}
                      max = {1.00}
                      step = {.05}
                      defaultValue = {this.state.volume}
                      onChange = {this.handleVolume}
              />
            </div>
  
          </Card>
        
        </div>
      
    );
  }
  }
 
  Player.propTypes ={
    classes : PropTypes.object.isRequired,
  }
  
  
  export default withRouter(withStyles(useStyles)(Player));