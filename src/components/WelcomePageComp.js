import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import wpbg from '../images/wpbg.jpg';
import {Link as RouterLink, BrowserRouter} from 'react-router-dom';
import CssBaseLine from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

const useStyles = theme =>({
    '@global':{
      body : {
        background : 'url('+wpbg+')',
        backgroundSize : 'cover',
        boxShadow: 'inset 0 0 0 1000px rgb(16,10,38, 0.8)',
        // background : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    },

    paper : {
        
    }, 
    
    button : {
        width : "50%",
        background: '#3c0b65',
        
    },

    gridContainer :{
        marginTop : theme.spacing(5),
    },
    
    gridItem : {
        textAlign : "center",
    },

    judul : {
        fontWeight : "500",
        color : "white",
    }
  
  });

class WelcomePage extends Component {
    render(){
        const {classes} = this.props;
    return (
        <Grid container component="main" maxWidth="lg" spacing={0} direction="row"
        alignItems="center" justify="center" style={{minHeight: '100vh'}}>
            
            <div className = {classes.paper}>
                <Typography component="h1" variant="h2" className={classes.judul}>
                    Podcast Recommendation System
                </Typography>
                <Typography component="h2" variant="h5" className={classes.judul}>
                    Built by VGJ Team.
                </Typography>

                <Grid container className={classes.gridContainer}>
                    <Grid item xs={6} className={classes.gridItem}>
                        <RouterLink to="/register">
                        <Button 
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        >Register</Button></RouterLink>
                        
                        
                    </Grid>

                    <Grid item xs={6} className={classes.gridItem}>
                  
                        <RouterLink to="/login"><Button 
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        >Login</Button>
                        </RouterLink>
                        
                    </Grid>
                </Grid>
            
            </div>
        </Grid>

    );
    }
    
}

WelcomePage.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(WelcomePage);
