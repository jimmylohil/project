import React , {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import DownListComp from './DownList/DownListComp'
import { Grid, Container } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import images from '../images/podlogo_text_dark.png';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

import podlogo from '../images/podlogo_text_dark.png';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    grid: {
        marginBottom:30,
    },
    image: {
        width: 200,
        height: 200,
        margin: 10,
        display: 'block',
      },
    img: {
        width: 200,
        height: 100,
        margin: '0',
        display: 'block',
      },
      imageRecommend: {
        width: 128,
        height: 128,
      },
      imgRecommend: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
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
    rate: {
        marginTop:6,
    },
    rating:{
        marginTop:30,
        fontSize:60,
    },
    review:{
        width:410,
        marginTop:30,
        marginBottom:10,
    },
    textField: {
        width:410,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
      paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom : theme.spacing(2),
        maxWidth: 800,
        
      },
    heading:{
        textAlign: 'left' ,
    },
    paperEps :{
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom : theme.spacing(2),
        maxWidth: 800,
    },
    imageEps: {
        width: 128,
        height: 128,
      },
      imgEps: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      link:{
        textDecoration : 'none',
        color : '#3c0b65',
    },
    nodata:{
        textAlign : 'center' ,
    },
}));

function ShowPageComp(props) {

    const sn = window.location.href.split('/')[4];

    const [totalRating, setTotalRating] = useState(0);
    const [show, setShow] = useState([]);
    const [episodelist, setEpisodelist] = useState([]);
    const [relatedPodcast, setRelatedPodcast] = useState([]);

    const [playlist, setPlaylist] = useState([]);
    const [donePlaylist, setDonePlaylist] = useState(undefined);


    
    var jwt = sessionStorage.getItem("JWT");
    var username = sessionStorage.getItem("username");

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[]);

    useEffect(()=>{
        axios.get(`http://localhost:80/api/playlist?token=${jwt}`)
        .then(
            (res => {
                console.log("Get Playlist in PlaylistList succesful")
                setPlaylist(res.data.playlists)
                setDonePlaylist(true)
            }))
        .catch(function(error){
            console.log(error);
        })
        } , [jwt]);


    const classes = useStyles();

    return (
        <div className={classes.root}>

        { !(donePlaylist == true)  ? <LinearProgress color="secondary" /> : null }
      

        <Container fixed>
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.grid}
                    >
                    {/* Playlist Image */}
                    <Grid item xs={3} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="center"
                            alignItems="center" >
                            <ButtonBase className={classes.image}>
                            {!donePlaylist ? <Skeleton variant="rect" width={190} height={190} className={classes.image}/> :
                                <img className={classes.img} alt="complex" src={podlogo} /> }
                            </ButtonBase>
                        </Grid>
                    </Grid>
                    {/* Playlist Name */}
                    <Grid item xs={7} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            >
                            <Grid item xs ={12}>
                            {!donePlaylist ? <Skeleton width="50%"/> :
                                <h2 className={classes.title}>{playlist[playlist.findIndex(age => age.sn==sn)].name}</h2>}
                            </Grid>
                            <Grid item xs ={12}>
                            {!donePlaylist ? <Skeleton width="30%"/> :
                                <h3 className={classes.podcaster}>{playlist[playlist.findIndex(age => age.sn==sn)].date_created.slice(0,10)}</h3>}
                            </Grid>
                        </Grid>
                    </Grid> 
    
                        
                </Grid>
                {donePlaylist && playlist[playlist.findIndex(age => age.sn==sn)].episodes.length == 0 ? <h2 className={classes.nodata}>NO EPISODES</h2> : null}
                { donePlaylist && playlist[playlist.findIndex(age => age.sn==sn)].episodes.length > 0 ?
                <div>
                {playlist[playlist.findIndex(age => age.sn==sn)].episodes.map((item,i) =>
                
                    
                <Paper className={classes.paperEps}>
                    
                    <Grid container xs={12}spacing={2}>
                        <Grid item xs={3}>
                        <Link to={{
                                    pathname : `/episodepage/${item.uuid}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                            <ButtonBase className={classes.imageEps}>
                                <img className={classes.imgEps} alt={images} src={item.podcast.image} />
                            </ButtonBase>
                            </Link>
                        </Grid>

                        <Grid item xs={7} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                            <Link to={{
                                    pathname : `/episodepage/${item.uuid}`,
                                    state : {
                                        eps_id : `${item.uuid}`
                                    },
                                    
                                        
                                }} className={classes.link}>
                                <Grid item xs>
                                
                                    <Typography gutterBottom variant="h6">
                                        {item.title}
                                    </Typography>
                                    
                                    <Typography variant="subtitle1" gutterBottom>
                                        {item.description}
                                    </Typography>
                                 

                                </Grid>
                                </Link>
                            </Grid>
                        </Grid>
                        
                        </Grid>
                    </Paper>
        )}      </div>: null
                }

        
            </Container>
        </div>
    )
}

export default ShowPageComp
