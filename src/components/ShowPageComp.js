import React, {useEffect, useState, useRef} from 'react'
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

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    grid: {
        marginBottom:30,
    },
    image: {
        width: 300,
        height: 300,
      },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
    title: {
        margin:0,
        marginTop:20,
    },
    podcaster: {
        margin:0,
        MarginBottom:20,
        textAlign: 'left',
    },
    rate: {
        marginTop:6,
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
}));

function ShowPageComp(props) {
    const [pod_id, setPodId] = useState([props.location.state.pod_id])
    
    const [show, setShow] = useState([]);
    const [episodelist, setEpisodelist] = useState([]);
    const [relatedPodcast, setRelatedPodcast] = useState([]);

    var jwt= sessionStorage.getItem("JWT");
    var podid = pod_id;
    console.log(podid);

    

    useEffect(()=> {
        axios.get(`http://localhost:80/api/podcasts/?token=${jwt}&uuid=${podid}`)
        .then(
          (res => 
           setShow(res.data.podcast)));
        } , []);

    useEffect(()=> {
        axios.get(`http://localhost:80/api/podcast/episode/?token=${jwt}&podcast_uuid=${podid}`)
        .then(
            (res => 
             setEpisodelist(res.data.episodes)));
         } , []);

    useEffect(()=>{
        axios.get(`http://localhost:80/api/relatedPodcast/?token=${jwt}&uuid=${podid}`)
        .then(
            (res =>
                setRelatedPodcast(res.data.recommendations))
        )
         }, []);

       console.log(show);
       console.log(episodelist);
       console.log(relatedPodcast);


    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [value] = React.useState(3);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            <Container fixed>
                {/* Category Name */}
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.grid}
                    >
                    {/* Show Image */}
                    <Grid item xs={4} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="center"
                            alignItems="center" >
                            <ButtonBase className={classes.image}>
                                <img className={classes.img} alt={images} src={show.image} />
                            </ButtonBase>
                        </Grid>
                    </Grid>
                    {/* Show Name */}
                    <Grid item xs={7} >
                        <Grid 
                            container 
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            >
                            <Grid item xs ={12}>
                                <Grid 
                                container 
                                spacing={1}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start">
                                    <h2 className={classes.title}>{show.title}</h2>
                                </Grid>
                            </Grid>
                            <Grid item xs ={12}>
                                <h4 className={classes.podcaster}>{show.author}</h4>
                            </Grid>
                            <Grid item xs ={3}>
                                <Rating value={value} readOnly />   
                            </Grid>
                            <Grid item xs ={2} >
                                <Grid 
                                    container 
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                    <h4 className={classes.rate}>3/5</h4>
                                </Grid>
                            </Grid>
                            <Grid item xs ={12}>
                                <Grid 
                                    container 
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                    <Button variant="contained" color="primary" className={classes.button}>
                                        Subscribe
                                    </Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    {/* About */}
                    <Grid 
                        container 
                        spacing={1}
                        direction="row"
                        justify="center"
                        alignItems="center" >
                        <Grid item xs ={10} >
                            <ExpansionPanel 
                                expanded={expanded === 'panel1'} 
                                onChange={handleChange('panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    >
                                    <Typography>About</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        {show.description}
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>               
                </Grid>   
                
                <div>
                    
                </div>
                {episodelist.map((item,i) =>
                
                    
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
                                        <img className={classes.img} alt={images} src={show.image} />
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
                                                {show.author}
                                            </Typography>
                                         
                                            {/* <Typography variant="body2" color="textSecondary">
                                                ID: 1030114
                                            </Typography> */}

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
                                    <PlayCircleOutline className={classes.play}/>                    
                                </IconButton>
                                    
                                </Grid>
                                </Grid>
                            </Paper>
                )}
                

                
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
                            <ButtonBase className={classes.image}>
                                <img className={classes.img} alt={images} src={item.image} />
                            </ButtonBase>
                            </Link>
                        </Grid>

                        <Grid item xs={7} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                            <Link to={{
                                    pathname : `/showpage/${item.uuid}`,
                                    state : {
                                        pod_id : `${item.uuid}`
                                    },
                                    
                                        
                                }} className={classes.link}>
                                <Grid item xs>
                                
                                    <Typography gutterBottom variant="h6">
                                        {item.title}
                                    </Typography>
                                    
                                    <Typography variant="subtitle1" gutterBottom>
                                        {item.author}
                                    </Typography>
                                 
                                    {/* <Typography variant="body2" color="textSecondary">
                                        ID: 1030114
                                    </Typography> */}

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
                            <PlayCircleOutline className={classes.play}/>                    
                        </IconButton>
                            
                        </Grid>
                        </Grid>
                    </Paper>
        )}
                
                
            
            







            </Container>
        </div>
    )
}

export default ShowPageComp
