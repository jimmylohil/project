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
import SearchResult from './components/SearchResult';
import UserPageComp from './components/UserPageComp';
import Playlist from './components/Playlist';
import Subscription from './components/Subscription';



class App extends Component{

  render(){
    
    return (
      <BrowserRouter>
          <div className="App">
            <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/register" component = {Register} />
              <Route exact path="/"
                    render={props =>{
                      if(this.isLoggedIn()){
                        return <Redirect to="/home" />
                      }
                      else{
                        return <Redirect to="/login" />
                      }
                    }} />
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
  
  isPlay(){
    return sessionStorage.getItem("Player") != null;
  }

  isPlaying(){
    return sessionStorage.getItem("isPlaying") != null;
  }

   render(){
     return(
      <div>
        <HeaderComp/>
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
          <Route path="/searchresult" component ={SearchResult} />
          <Route path="/profile" component={UserPageComp} />
          <Route path="/playlist" component={Playlist} />
          <Route path="/subscription" component={Subscription} />
        </Switch>
        
        {sessionStorage.setItem("uuid", sessionStorage.getItem("Player"))}
        { this.isPlay() && 
            <Player isPlay={this.isPlaying()} />
        }
        

        
          
      </div>
      
       
     )
   }
 }


export default App;
