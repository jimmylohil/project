import React from 'react';
import {Component} from 'react';
import './App.css';
import Login from './components/LoginComp';
import Register from './components/RegisterComp';
import WelcomePage from './components/WelcomePageComp';
import CategoryWelcomePage from './components/CategoryWelcomePage'
import {BrowserRouter, Route, Link, Switch, Redirect, withRouter} from 'react-router-dom';
import Player from './components/Player.js';
import HomePageComp from './components/HomePageComp.js';
import HeaderComp from './components/HeaderComp';
import NewReleasePage from './components/NewReleasePage';
import TrendingPage from './components/TrendingPage';
import RecommendedForYou from './components/RecommendedForYou';
import RecentlyPlayed from './components/RecentlyPlayed';
import CategoryPage from './components/CategoryPage';
import axios from 'axios';
import ShowPageComp from './components/ShowPageComp';
import EpisodePageComp from './components/EpisodePageComp';





class App extends Component{

  render(){

    return (
        <BrowserRouter>
          <div className="App">
            <Switch>
              {/* <Route path="/home" component={HomePageComp} />
              <Route path = "/header" component={HeaderComp} /> */}
              <Route exact path="/" component={Login} />
              <Route path="/login" component={Login}/>
              <Route path="/register" component = {Register} />
              {/* <Route path="/newrelease" component = {NewReleasePage} />
              <Route path="/categorywelcomepage" component={CategoryWelcomePage} />
              <Route path="/trending" component={TrendingPage} />
              <Route path="/category/" component={CategoryPage} />
              <Route path="/showpage" component={ShowPageComp} />
              <Route path="/episodepage" component={EpisodePageComp} />
              <Route path="/recommendedforyou" component={RecommendedForYou} /> */}
              
              
              
              <Route path="/"
                    render={props =>{
                      if(this.isLoggedIn()){
                        return <LoggedInRoutes {...props} />
                      }
                      else{
                        return <Redirect to="/login" />
                      }
                    }} />
            </Switch>
            
          </div>
        </BrowserRouter>
  
    );
  }

   isLoggedIn(){
     return sessionStorage.getItem("JWT") != null;
   }
  
}

 class LoggedInRoutes extends Component{
   render(){
     return(
      <div>
        <HeaderComp />
        <Switch>
          <Route path="/home" component = {HomePageComp} />
          <Route path="/trending" component={TrendingPage} />
          <Route path="/categorywelcomepage" component={CategoryWelcomePage} />
          <Route path="/recommendedforyou" component={RecommendedForYou} />
          <Route path="/recentlyplayed" component={RecentlyPlayed} />
          <Route path="/category" component={CategoryPage} />
          <Route path="/showpage" component={ShowPageComp} />
          <Route path="/episodepage" component={EpisodePageComp} />
          <Route path="/newrelease" component = {NewReleasePage} />
        </Switch>
        <Player />
        
          
      </div>
      
       
     )
   }
 }


export default App;
