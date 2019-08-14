import React, { Component } from 'react';
import {component} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Link as RouterLink, BrowserRouter, Route} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import bgImg from '../images/bg.jpg';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import CategoryWelcomePage from './CategoryWelcomePage';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import podlogo from '../images/podlogo_text_dark.png';

const useStyles = theme =>({
  '@global':{
    body : {
      background: 'linear-gradient(326deg, #050115 0%, #100a26 47%, #3c0b65 95%)', 
    },
  },
  paper : {
    width : theme.spacing(45),
    display : 'flex',
    flexDirection : 'column',
    alignItems : 'center',
    backgroundColor : theme.palette.common.white,
    padding : theme.spacing(5),
  
},
form : {
  width : '100%',
  marginTop : theme.spacing(1),
},

submit : {
  margin : theme.spacing(2,0,2),
  background: 'linear-gradient(326deg, #050115 0%, #100a26 47%, #3c0b65 95%)',

},

logo :{
  width : theme.spacing(22),
  
},

link : {
  textDecoration : 'none',
  
},

});

const formValid = ({ formErrors, ...rest}) =>{
  let valid = true;

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  Object.values(rest).forEach(val =>{
    val === null && (valid = false);
  });
  return valid;
}



class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
      password : "",
      formErrors : {
        username : "",
        password : "",
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };
  

  onChange = e => {
    e.preventDefault();
    const {id, value} = e.target;
    let formErrors = this.state.formErrors;

    switch(id){
      case "username":
        formErrors.username = value.length < 3
        ? "Enter an username"
        : ""
        break;

      case "password":
        formErrors.password = value.length < 6
        ? "Minimum 6 characters required"
        : ""
        break;

      default:
        break;
    }

    this.setState({formErrors, [id] : value}, console.log(this.state));

  };

  onSubmit = e => {
    e.preventDefault();
    if(formValid(this.state)){
      console.log(this.state.username,
       this.state.password);
      }

    else{
      console.error("Form Error");

    }
    
    const userData = {
      username : this.state.username,
      password : this.state.password
    }

    var apiUrl = 'http://localhost:80/main/login';
    var self = this;
    var payload = {
      "username" : this.state.username,
      "password" : this.state.password
    }
    axios.post(apiUrl,payload)
    .then(
      function(response){
        console.log(response);
        
        if(response.status == 200 && response.data.error == null){
          console.log("Login successful");
          alert("Login Success");
          let authToken = response.data.token;
          sessionStorage.setItem("JWT", authToken);
          sessionStorage.setItem("username", self.state.username );
          self.props.history.push({
            pathname:'/home',
            state:{
            username : self.state.username,
          }});
         
        }

        else if(response.status == 200 && response.data.error == true){
          console.log("Username password do not match");
          alert("Username Password do not match");
        }

      }
      
    )

    .catch(function(error)
    {
      console.log(error);
      alert("Network Error, Please try again");
    });
    
 
  };
 

  render(){

    const {classes} = this.props;
    const {formErrors} = this.state;
        return (
          <Grid container component="main" maxWidth="lg" spacing={0} direction="row"
          alignItems="center" justify="center" style={{minHeight: '100vh'}}>
            <div className={classes.paper}>
              <img src={podlogo} className={classes.logo}/>
              
              <form className={classes.form} noValidate onSubmit={this.onSubmit}>

                <TextField 
                  variant="outlined"
                  type="text"
                  label="Username"
                  id="username"
                  margin="normal"
                  required
                  fullWidth
                  onChange = {this.onChange}
                  helperText = {formErrors.username}
                  error ={formErrors.username.length === 0 ? false : true}
                  />
                 

                  <TextField 
                  variant="outlined"
                  type="password"
                  label="Password"
                  id="password"
                  margin="normal"
                  required
                  fullWidth 
                  onChange = {this.onChange}
                  helperText = {formErrors.password}
                  error ={formErrors.password.length === 0 ? false : true}
                  />
                  

                  <Button className={classes.submit}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth>
                    Login
                  </Button>

              </form>

              <Grid container>
                <Grid item>
                  <RouterLink to="/register" className={classes.link}>
                    <Link variant="body2" >
                      {"Don't have an account ? Sign Up"}
                    </Link>
                  </RouterLink>
                </Grid>
              </Grid>
            </div>

          </Grid>
        );
  }
      
}

Login.propTypes ={
  classes : PropTypes.object.isRequired,
}


export default withRouter(withStyles(useStyles)(Login));