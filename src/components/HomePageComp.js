import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearListComp from './LinearList/LinearListComp'
import SquareGrid from './SquareGrid';
import { Grid, Container } from '@material-ui/core';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';

import LinearProgress from '@material-ui/core/LinearProgress';

import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';


const useStyles = theme => ({
    root: {
      flexGrow: 1,
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
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom : theme.spacing(2),
        maxWidth: 800,
        
      },
      circularpaper: {
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom : theme.spacing(2),
        textAlign : 'center',
        
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

      circular:{
        textAlign : 'center',
      }
      
  });

class HomePageComp extends Component {
    constructor(props){
        super(props);
        this.state = {
            loadingItem :['','','','','',''],
            trending : [],
            newReleased : [],
            recently : [],
            recommend : [],
            doneNew : undefined,
            doneTrending : undefined,
            doneRecently : undefined,
            doneRecommend : undefined,
        };
    };
    handlePlayButton = (e) => {
        const value = e.target.id;
        console.log (value);

        sessionStorage.setItem("uuid", value)
        // const willPlay = this.state.willPlay
        // willPlay.push(e.target.id)
        // this.setState({
        //     willPlay : e.target.id 
        // });
        // console.log(willPlay)

    
    }

    componentDidMount(){
        var jwt = sessionStorage.getItem("JWT")
        var username = sessionStorage.getItem("username")
        axios.get(`http://localhost:80/api/trending?token=${jwt}`)
        .then(
            (response) => {
                console.log("Get Trending Eps succesful")
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

        axios.get(`http://localhost:80/api/latesteps/?token=${jwt}`)
        .then(
            (response) => {
                console.log("Get Latest Eps succesful")
                console.log(response)
                this.setState(
                    {
                        newReleased : response.data.episodes,
                        doneNew : true,
                    }
                )
                console.log(this.state.newReleased)
            } 
        )

        axios.get(`http://localhost:80/api/recent_play/?token=${jwt}&username=${username}`)
        .then(
            (response) => {
                console.log("Get Recent Eps succesful")
                console.log(response)
                this.setState(
                    {
                        recently : response.data.episodes,
                        doneRecently : true,
                    }
                )
                console.log(this.state.recently)
            } 
        )


        axios.get(`http://localhost:80/api/getSuggestion?token=${jwt}&username=${username}`)
        .then(
            (response) => {
                console.log("Get Suggest Eps succesful")
                console.log(response)
                this.setState(
                    {
                        recommend : response.data.podcasts,
                        doneRecommend : true,
                    }
                )
                console.log("REKOMEN: "+ this.state.recommend)
            } 
        )

        .catch(function(error){
            console.log(error);
        })
        
    }

    render(){
    const {classes} = this.props;
    const {trending, newReleased, recently, recommend,loadingItem} = this.state;

    return (
        <div className={classes.root}>

            {/* Check fetching data from backend */}
            { !(this.state.doneNew == true && this.state.doneTrending == true && 
            this.state.doneTrending == true && this.state.doneRecommend == true) ? <LinearProgress color="secondary" /> : null }
            
            <Container fixed>

            {/* New Release */}
            
            {!this.state.doneNew ? (
                <div>
                    <Grid container spacing={7}>
                        <Grid item xs >
                            <Skeleton width="50%"/>
                        </Grid>
                    </Grid>  
                    <Grid container spacing={3}>
                        {loadingItem.map((item,i)=>
                        <Grid item xs={2}>
                            <Skeleton variant="rect" width={190} height={118} />
                            <Box pt={0.5}>
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Box>
                        </Grid>
                        )}
                    </Grid>
                </div>
            ) : (
            <div>  
                <Grid container alignItems="center" justify="left">
                    <Grid item className={classes.titlegrid} >
                        <Link to="/newrelease" className={classes.link}>    
                            <Typography variant="h4">
                                New Released
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>  
                <Grid container spacing={3}>
                    {newReleased.slice(0,6).map((item,i)=>
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
                                                {item.title.length >= 50 ? (item.title.slice(0,45)).concat('...') : item.title}
                                            </Typography>
                                    </Grid>
                                </CardContent>
                                </Link>
                            </Card>
                        </Grid>
                    )}
                </Grid>
                    
                {newReleased.slice(0,6).length == 6 && 
                    <Grid 
                        container 
                        spacing={1}
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        >
                        <Grid item xs={1}>
                            <Link to="/newrelease">
                                <h5>Show More >></h5>
                            </Link>
                        </Grid>
                    </Grid>
                }
            </div>   
            )}
                
            {/* TRENDING */}

            {!this.state.doneTrending ? (
                <div>
                    <Grid container spacing={7}>
                        <Grid item xs >
                            <Skeleton width="50%"/>
                        </Grid>
                    </Grid> 
                    <Grid container spacing={3}>
                        {loadingItem.map((item,i)=>
                            <Grid item xs={2}>
                            <Skeleton variant="rect" width={190} height={118} />
                            <Box pt={0.5}>
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Box>
                        </Grid>
                        )}
                </Grid>
                </div>
            ) : (
            <div>
                <Grid container alignItems="center" justify="left">
                    <Grid item className={classes.titlegrid} >
                        <Link to="/trending" className={classes.link}> 
                            <Typography variant="h4">
                                Trending
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {trending.slice(0,6).map((item,i)=>
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
                                    {item.title.length >= 50 ? (item.title.slice(0,45)).concat('...') : item.title}
                                    </Typography>
                            </Grid>
                            </CardContent>
                            </Link>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                {trending.slice(0,6).length == 6 &&
                    <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <Grid item xs={1}>
                        <Link to="/trending">
                            <h5>Show More >></h5>
                        </Link>
                    </Grid>
                </Grid>
                } 
            </div>
            )}               
                
            {/* Recently Played */}

            {!this.state.doneRecently ? (
                <div>
                    <Grid container spacing={7}>
                        <Grid item xs >
                            <Skeleton width="50%"/>
                        </Grid>
                    </Grid> 
                    <Grid container spacing={3}>
                        {loadingItem.map((item,i)=>
                            <Grid item xs={2}>
                                <Skeleton variant="rect" width={190} height={118} />
                                <Box pt={0.5}>
                                    <Skeleton />
                                    <Skeleton width="60%" />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </div>
            ) : (
            <div>
                {recently.length != 0 &&
                <Grid container alignItems="center" justify="left">
                    <Grid item className={classes.titlegrid} >
                        <Link to="/recentlyplayed" className={classes.link}> 
                            <Typography variant="h4">
                                Recently Played
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
                }
                <Grid container spacing={3}>
                    {recently.slice(0,6).map((item,i)=>
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
                                            {item.title.length >= 50 ? (item.title.slice(0,45)).concat('...') : item.title}
                                        </Typography>
                                </Grid>
                            </CardContent>
                            </Link>
                            </Card>
                        </Grid>
                        
                    )}
                </Grid>
                    {recently.slice(0,6).length == 6 &&              
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
                    }
            </div>
            )}
            
            {/* Recommended For You */}
                
            {!this.state.doneRecommend ? (
            <div>
                <Grid container spacing={7}>
                    <Grid item xs >
                        <Skeleton width="50%"/>
                    </Grid>
                </Grid> 
                <Paper className={classes.paper}>
                    <Grid container xs={12}spacing={2}>
                        {loadingItem.map((item,i)=>

                            <Grid container xs={12}spacing={2}>
                                <Grid item xs={3}>
                                    <Skeleton variant="rect" width={190} height={80}/>
                                </Grid>

                                <Grid item xs={7} sm container>
                                    <Skeleton width="80%"/>
                                    <Skeleton width="60%" />    
                                        
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </div>
            ) :(
            <div>
            <Grid container alignItems="center" justify="left">
                <Grid item className={classes.titlegrid} >
                    <Link to="/recommendedforyou" className={classes.link}> 
                        <Typography variant="h4">
                            Recommended For You
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
            {recommend.slice(0,6).map((item,i)=>
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
                                    <img className={classes.img} alt="complex" src={item.image} />
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
            <Grid 
                container 
                spacing={1}
                direction="row"
                justify="flex-end"
                alignItems="center">
                <Grid item xs={3}>
                    <Link to="/recommendedforyou">
                        <h5>Show More >></h5>
                    </Link>
                </Grid>
            </Grid>
            </div>
            )}
                
            </Container>
        </div>
    )
}
}
HomePageComp.propTypes = {
    classes : PropTypes.object.isRequired,
    
}



export default withStyles(useStyles)(HomePageComp);
