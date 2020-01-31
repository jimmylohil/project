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
}));

function ShowPageComp(props) {

    const pod_id = window.location.href.split('/')[4];
    const [subs, setSubs] = useState([]);
    const [subsvalue,setSubsvalue] = useState('');
    const [totalRating, setTotalRating] = useState(0);
    const [show, setShow] = useState([]);
    const [episodelist, setEpisodelist] = useState([]);
    const [relatedPodcast, setRelatedPodcast] = useState([]);

    const [doneShow, setDoneShow] = useState(undefined);
    const [doneEpisodeList, setDoneEpisodeList] = useState(undefined);
    const [doneSubs, setDoneSubs] = useState(undefined);
    const [doneSubsRender, setDoneSubsRender] = useState(false);

    
    var jwt = sessionStorage.getItem("JWT");
    var username = sessionStorage.getItem("username");
    var podid = pod_id;

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[]);

    useEffect(()=>{

        axios.get(`http://localhost:80/api/podcasts/?token=${jwt}&uuid=${podid}`)
        .then(
          (res => {
            setShow(res.data.podcast)
            setTotalRating(res.data.podcast.total_rating)
            setDoneShow(true)
          }),
          ); 

        axios.get(`http://localhost:80/api/podcast/episode/?token=${jwt}&podcast_uuid=${podid}`)
        .then(
            (res =>{
            setEpisodelist(res.data.episodes)
            setDoneEpisodeList(true)
            }),
            );
        
        axios.get(`http://localhost:80/api/getSubscribedPodcast/?token=${jwt}`)
        .then(
            (res =>{
                setSubs(res.data.podcasts)
                setDoneSubs(true)
                console.log("THERE: " )
            }),
            );
        } , [jwt,podid]);

        var payload = {
            "uuid" : podid,
            "username" : username
          }

        function handleSubs(){
            if (subsvalue == 'Subscribe'){
                setSubsvalue('Subscribed')
                    axios.post(`http://localhost:80/api/subscribe/?token=${jwt}&uuid=${podid}&username=${username}`,payload)
                    .then(
                        function(response){
                            console.log("SUB" , response);
                            alert ('Subscribed')
                        }
                    )
                    .catch(function(error){
                        console.log(error);
                    })
            }else{
                setSubsvalue('Subscribe')
                axios.post(`http://localhost:80/api/unsubscribe/?token=${jwt}&uuid=${podid}&username=${username}`,payload)
                .then(
                    function(response){
                        console.log("UNSUB" , response);
                        alert ('Subscribe')
                    }
                )
                .catch(function(error){
                    console.log(error);
                })
        }
    };

    const classes = useStyles();

    var subscribed = '';
    
    const renderingSubs = () => {
        setDoneSubsRender(true)
        subscribed = subs.find((item) => item.uuid == podid )
        console.log("SUBS ", subscribed);

        if (subscribed == undefined)  {  
          return setSubsvalue('Subscribe');
        } else if(subscribed.uuid == podid){
          return setSubsvalue('Subscribed');
        }
        else{
            return setSubsvalue('Subscribe');
        }
    }

    return (
        <div className={classes.root}>

        { !(doneShow == true && doneEpisodeList == true && doneSubs == true ) 
        ? <LinearProgress color="secondary" /> : null }

        {/* Check subs */}
        {(doneSubs == true && subsvalue === '' && doneSubsRender == false) ? renderingSubs() : null } 
 

        

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
                            {!doneShow ? <Skeleton variant="rect" width={190} height={190} className={classes.image}/> :
                                <img className={classes.image} alt="complex" src={show.image} /> }
                            </ButtonBase>
                        </Grid>
                    </Grid>
                    {/* Episode Name */}
                    <Grid item xs={7} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            >
                            <Grid item xs ={12}>
                            {!doneShow ? <Skeleton width="50%"/> :
                                <h2 className={classes.title}>{show.title}</h2>}
                            </Grid>
                            <Grid item xs ={12}>
                            {!doneShow ? <Skeleton width="30%"/> :
                                <h3 className={classes.podcaster}>{show.author}</h3>}
                            </Grid>
                            <Grid item xs ={2}>
                            {!doneShow ? <Skeleton width="50%"/> :
                                <Rating value={totalRating} readOnly /> }  
                            </Grid>
                            <Grid item xs ={2} >
                                <Grid 
                                    container 
                                    spacing={1}
                                    direction="row"
                                    justify="center"
                                    alignItems="center">
                                    {!doneShow ? null :
                                    <h4 className={classes.rate}>{totalRating}/5</h4> }
                                </Grid>
                            </Grid>
                            <Grid item xs ={12}>
                                <Grid 
                                    container 
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                    {!doneShow ? null:
                                        <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className={classes.button} 
                                        onClick={handleSubs}>

                                        {subsvalue}
                                    </Button>}
                                </Grid>
                            </Grid>

                        </Grid>
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
                                {show.description == null ? " No data " : show.description}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>      
                    </Grid>
                </Grid> 
                {episodelist.length > 0 &&
                <div>
                <h3>Episodes List</h3>
                {episodelist.map((item,i) =>
                
                    
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
                                <img className={classes.imgEps} alt={images} src={show.image} />
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
                                        {show.author}
                                    </Typography>
                                 

                                </Grid>
                                </Link>
                            </Grid>
                        </Grid>
                        
                        </Grid>
                    </Paper>
        )}      </div>
                }

            </Container>
        </div>
    )
}

export default ShowPageComp
