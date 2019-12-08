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
  circular:{
    textAlign : 'center',
  },
  circularpaper: {
    padding: theme.spacing(2),
    margin: 'auto',
    marginBottom : theme.spacing(2),
    textAlign : 'center',
    
  },
});


class SearchResult extends Component {
    constructor(props){
        super(props);
        this.state = {
            result : [],
            showPlayer : false,
            doneSearch : undefined,
        }
        this.handlePlayButton = this.handlePlayButton.bind(this);
    }

    

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
        var search = sessionStorage.getItem("search");
        console.log(search)
        axios.get(`http://localhost:80/api/searchPodcast?token=${jwt}&query=${search}&page=1`)
        .then(
            (response) => {
                console.log("Get Latest Eps succesful")
                console.log(response)
                this.setState(
                    {
                        result : response.data.podcasts,
                        doneSearch : true,
                    }
                )
                console.log(this.state.result)
            } 
        )

        .catch(function(error){
            console.log(error);
        })
    };

    handlePlayButton = e =>{
        e.preventDefault();
        const willPlay = this.state.willPlay
        willPlay.push(e.target.item)
        this.setState({
            willPlay : willPlay 
        });
        console.log(this.state.willPlay)

        // this.props.history.push({
        //     state:{
        //     uuid : this.state.uuid,
        //   }})
        //   console.log(this.state.uuid);
    }

   



    render(){
        const {classes} = this.props;
        const {result} = this.state;
        
        return (
            
            <div className={classes.root}>
                
                <Grid container alignItems="center" justify="center">
                    <Grid item className={classes.titlegrid} >
                    <Typography variant="h2" className={classes.title}>
                        Search Results
                    </Typography>
                    </Grid>
                </Grid>
            
            {!this.state.doneSearch ? (
                <div className={classes.circularpaper}>
                    <CircularProgress className={classes.circular}/>
                    </div>
            ) :(
                <div>
                    {result.map((item,i) =>
                {
                    return(
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
                                    <PlayCircleOutline className={classes.play} onClick={this.handlePlayButton} id={item.uuid}/>                    
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

SearchResult.propTypes = {
    classes : PropTypes.object.isRequired,
}

export default withRouter(withStyles(useStyles)(SearchResult));