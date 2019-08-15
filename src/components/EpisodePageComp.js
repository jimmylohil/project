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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField'
import images from '../images/podlogo_text_dark.png';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';

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
    blue:{
        backgroundColor:'blue',
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
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        outline: 'none',
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

function EpisodePageComp(props) {

    const [eps_id, setEpsId] = useState([props.location.state.eps_id]);
    const [episode, setEpisode] = useState([]);
    const [show, setShow] = useState([]);
    const [relatedEpisode, setRelatedEpisode] = useState([]);
    
    var jwt = sessionStorage.getItem("JWT");
    var epsid = eps_id;

    useEffect(()=>{
        axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${epsid}`)
        .then(
            (res =>
                setEpisode(res.data.episode)),
                
        );
    }, []);

    console.log(episode);
    useEffect(()=>{
        axios.get(`http://localhost:80/api/episodes/?token=${jwt}&uuid=${epsid}`)
        .then(
            (res =>
                setShow(res.data.episode.podcast)),
                
        );
    }, []);
    console.log(show);
    
    useEffect(() => {
        axios.get(`http://localhost:80/api/relatedEpisode/?token=${jwt}&uuid=${epsid}`)
        .then(
            (res =>
                setRelatedEpisode(res.data.recommendations))
        )
    },[]);

    console.log(relatedEpisode);




    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [review, setReview] = React.useState("");
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    
    
    
    
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handlePlayButton = e => {
        sessionStorage.setItem("uuid", epsid)
    }


    return (
        <div className={classes.root}>
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
                                <img className={classes.image} alt="complex" src={show.image} />
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
                                <h2 className={classes.title}>{episode.title}</h2>
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
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                        <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className={classes.button} 
                                        onClick={handlePlayButton}>

                                        Play
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className={classes.button} 
                                        onClick={handleOpen}>

                                        Review
                                    </Button>
                                    {/* ReviewModal */}
                                    <Modal
                                        aria-labelledby="simple-modal-title"
                                        aria-describedby="simple-modal-description"
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <div style={modalStyle} className={classes.paper}>
                                        <Grid 
                                            container 
                                            spacing={1}
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="flex-start"
                                            >
                                            {/* Episode Image */}
                                            <Grid item xs={5} >
                                                <Grid 
                                                    container 
                                                    spacing={1}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center" >
                                                    <ButtonBase>
                                                        <img className={classes.img} alt="complex" src={show.image} />
                                                    </ButtonBase>
                                                </Grid>
                                            </Grid>
                                            {/* Episode Name */}
                                            <Grid item xs={7} >
                                                <Grid 
                                                    container 
                                                    spacing={1}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    >
                                                    <Grid item xs ={12}>
                                                        <Grid 
                                                        container 
                                                        spacing={1}
                                                        direction="row"
                                                        justify="flex-start"
                                                        alignItems="flex-start">
                                                            <h3>{episode.title}</h3>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs ={12}>
                                                        <h4 className={classes.podcaster}>{show.author}</h4>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid 
                                                container 
                                                spacing={1}
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                                >
                                                <Rating
                                                    name="simple-controlled"
                                                    value={value}
                                                    className={classes.rating}
                                                    onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                    />
                                                <Grid item xs ={12}>
                                                    <Grid 
                                                    container 
                                                    spacing={1}
                                                    direction="row"
                                                    justify="flex-start"
                                                    alignItems="flex-start">
                                                    <TextField
                                                        id="outlined-textarea"
                                                        label="Review"
                                                        placeholder="Review Here"
                                                        multiline
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        value = {review}
                                                        onChange={(event) => {
                                                        setReview(event.target.value);
                                                    }}
                                                    />
                                                    </Grid>
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
                                                    <Button variant="contained" color="primary" onClick={handleClose} >Save</Button>
                                                </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Modal>
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
                                {episode.description}
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
                                    <ReviewComp />
                                </Grid>
                                <Grid item xs={6}>
                                    <ReviewComp />
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>        
                    </Grid>
                </Grid> 

                <h3>Related Episodes</h3>
                {relatedEpisode.map((item,i) =>
                
                    
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
                                <img className={classes.imgEps} alt={images} src={images} />
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
                                        {item.audio_length}
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
                            <PlayCircleOutline className={classes.play}  id={item.uuid}/>                    
                        </IconButton>
                            
                        </Grid>
                        </Grid>
                    </Paper>
        )}  
                {/* <DownListComp type="DownListUITypeEpisode" id={uuid} url={RecommendedEpisodeUrl}/>         */}
            </Container>
        </div>
    )
}

export default EpisodePageComp
