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
import Modal from '@material-ui/core/Modal';
import ReviewComp from './ReviewComp';
import AddToPlaylistModal from './AddToPlaylistModal';
import AddReviewModal from './AddReviewModal';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import images from '../images/podlogo_text_dark.png';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';

import Player from './Player.js';
import App from '../App.js';

import Chip from '@material-ui/core/Chip';

import Skeleton from '@material-ui/lab/Skeleton';

import LinearProgress from '@material-ui/core/LinearProgress';
import { CircularProgress } from '@material-ui/core';

import Box from '@material-ui/core/Box';


var propss;

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
    },
    grid: {
        marginBottom:30,
    },
    image: {
        width: 250,
        height: 250,
        margin: 10,
        display: 'block',
      },
    img: {
        width: 150,
        height: 150,
        margin: '0',
        display: 'block',
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
}));



  export default function EpisodePageComp(props) {
    propss = props;

    const epsid = window.location.href.split('/')[4];
    const [episode, setEpisode] = useState([]);
    const [show, setShow] = useState([]);
    const [reviewList, setReviewList] = useState([]);

    const [relatedPodcast, setRelatedPodcast] = useState([])
    const [doneEpisode, setDoneEpisode] = useState(undefined)
    const [doneRelatedPodcast, setDoneRelatedPodcast] = useState(undefined)

    const [hasReviewed, setHasReviewed] = useState(undefined)
    const [DoneHasReviewed, setDoneHasReviewed] = useState(undefined)

    const [doneRenderingRelatedPodcast, setDoneRenderingRelatedPodcast] = useState(false)
    const [doneRenderingReview, setDoneRenderingReview] = useState(false)

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    sessionStorage.setItem("uuid", epsid);
    


    var jwt = sessionStorage.getItem("JWT");
    var username = sessionStorage.getItem("username");
    var uuid = sessionStorage.getItem("uuid");
    console.log("EPSID ", epsid)
    console.log("UUID ", uuid)

    const reloadPage = () =>{
        window.scrollTo(0, 0);
    }

    useEffect(()=>{
        reloadPage();
    },[]);

    useEffect(()=>{
        axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${uuid}`)
        .then(
            (res =>{
                setEpisode(res.data.episode)
                setShow(res.data.episode.podcast)
                setReviewList(res.data.episode.reviews)
                setDoneEpisode(true)
            }),
                
        )
        .catch(function(error)
        {
        console.log(error);
        alert("Network Error, Please try again 1");
        });

        axios.get(`http://localhost:80/api/hasReviewed/?token=${jwt}&username=${username}&uuid=${uuid}`)
        .then(
            (res =>{
                setHasReviewed(res.data.hasReviewed)
                setDoneHasReviewed(true)
            }),
        )
        .catch(function(error)
        {
          console.log(error);
          alert("Network Error, Please try again 3");
        });

        

    }, [uuid,jwt]);

    const renderingRelatedPodcast = () => {
        
        axios.get(`http://localhost:80/api/relatedPodcast/?token=${jwt}&uuid=${episode.podcast.uuid}`)
        .then(
            (res =>{
                setRelatedPodcast(res.data.recommendations)
                setDoneRelatedPodcast(true)
                setDoneRenderingRelatedPodcast(true)
            }),
            );
        }
    
    var review = '';

    const renderingReview = () => {
        setDoneRenderingReview(true)
        review = episode.reviews
        console.log("REVIEW", review)

        episode.reviews.find((item) => item.user == username ) == undefined
        ? setValue(0) :  
        setValue( episode.reviews.find((item) => item.user == username ).rating)

        console.log("rating", value)
        setReviewList(review)
        
        }

    // console.log("Episode + ", episode);

    // console.log("Show +", show);
    
    // console.log("Related Podcast + ", relatedPodcast);

    const handlePlayButton = e => {
        sessionStorage.setItem("Player", epsid)
        sessionStorage.setItem("isPlaying", true)
        // setIsPlay(sessionStorage.getItem("Player"))
        window.location.reload(false)
    }

    
    
   

    
    return (
        <div className={classes.root}>
            {/* Check fetching data from backend */}
            { !(doneEpisode == true && doneRelatedPodcast == true) 
                ? <LinearProgress color="secondary" /> : null }

            {(doneEpisode == true && doneRenderingRelatedPodcast == false) && renderingRelatedPodcast()}
            {(doneEpisode == true && doneRenderingReview == false) && renderingReview()}

            <Container fixed>
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.grid}
                    >
                    {/* Episode Image */}
                    <Grid item xs={3} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="center"
                            alignItems="center" >
                            <ButtonBase>
                                {!doneEpisode ? <Skeleton variant="rect" width={190} height={190} className={classes.image}/> :
                                <img className={classes.image} alt="complex" src={show.image} />}
                            </ButtonBase>
                        </Grid>
                    </Grid>
                    {/* Episode Name */}
                    
                    <Grid item xs={7} >
                    {!(doneEpisode && DoneHasReviewed) ?
                        <Box pt={0.5}>
                            <Skeleton />
                            <Skeleton width="60%" />
                        </Box>
                    :
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            >
                            <Grid item xs ={12}>
                                <h2 className={classes.title}>{episode.title.length >= 150 ? (episode.title.slice(0,145)).concat('...') : episode.title}</h2>
                            </Grid>
                            <Grid item xs ={12}>
                                <h3 className={classes.podcaster}>{show.author}</h3>
                            </Grid>
                            <Grid item xs ={2}>
                                <Rating value={value} readOnly /> 
                            </Grid>
                            <Grid item xs ={2} >
                                <Grid 
                                    container 
                                    spacing={1}
                                    direction="row"
                                    justify="center"
                                    alignItems="center">
                                    <h4 className={classes.rate}>{value}/5</h4>
                                </Grid>
                            </Grid>
                            <Grid item xs ={12}>
                                <Grid 
                                    container 
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                    <Grid item>
                                            <Button 
                                            variant="contained" 
                                            color="primary" 
                                            className={classes.button} 
                                            onClick={handlePlayButton}>
                                                Play
                                            </Button>
                                    </Grid>  
                                    <Grid item>
                                        <AddToPlaylistModal />
                                    </Grid>   
                                    <Grid item>
                                    {hasReviewed ? null : <AddReviewModal />}
                                    {console.log("HasReviewed", hasReviewed)}
                                    
                                        
                                    </Grid>                                                 
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    </Grid>
                    <Grid item xs ={10}>
                        <ExpansionPanel classes>
                            {/* About Tab*/}
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Typography style={{textAlign: 'right'}} >About</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                {episode.description == null ? " No data " : episode.description}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            {/* Review Tab*/}
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                >
                                <Typography className={classes.heading}>Review</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid item xs={6}>
                                    {doneEpisode && reviewList.length >= 1 ?
                                        reviewList.map((item,i) =>
                                            
                                            <ReviewComp username={item.user} rating={item.rating} content={item.content}/>
                                        )
                                        : <p></p>
                                    }
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>        
                    </Grid>
                </Grid> 
                {relatedPodcast.length > 0 &&
                <div>
                <h3>Related Podcast</h3>
                {relatedPodcast.map((item,i) =>
                
                    
                    <Paper className={classes.paper}>
                            
                            <Grid container xs={12}spacing={2}>
                                <Grid item xs={3}>
                                <Link to={{
                                    pathname : `/showpage/${item.uuid}`,
                                    state : {
                                        pod_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                    <ButtonBase className={classes.imageRecommend}>
                                        <img className={classes.imgRecommend} alt="complex" src={item.image} />
                                    </ButtonBase>
                                    </Link>
                                </Grid>
            
                                <Grid item xs={7} sm container>
                                    <Grid item xs container direction="column" spacing={2}>
                                    <Link to={{
                                    pathname : `/showpage/${item.uuid}`,
                                    state : {
                                        pod_id : `${item.uuid}`
                                    }
                                }} className={classes.link}>
                                        <Grid item xs>
                                        
                                            <Typography gutterBottom variant="h6">
                                                {item.title}
                                            </Typography>
                                            
                                            <Typography variant="subtitle1" gutterBottom>
                                                {item.author}
                                            </Typography>

                                            <Typography variant="subtitle1" gutterBottom>
                                            {item.categories.split("|").map((item,i)=>
                                                <Chip variant="outlined" size="small" label={item} />
                                            )}
                                            
                                        </Typography>
            
                                        </Grid>
                                        </Link>
                                    </Grid>
                                </Grid>
                                
                                </Grid>
                            </Paper>
                )}
                </div>
                }
                
            </Container>
            
            {/* { showPlayer() } */}
        </div>
    )
};
