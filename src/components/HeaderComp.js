import React, {useEffect,useState,useRef} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Category from '@material-ui/icons/Category';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Subs from '@material-ui/icons/Subscriptions';
import { Button, Container, Grid } from '@material-ui/core';
import ToolTip from '@material-ui/core/ToolTip';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import podlogo from '../images/podlogo_text_dark.png';
import axios from 'axios';
import useReactRouter from 'use-react-router';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    marginTop:12,
    marginRight:28,
    height:35,
    width:125,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: '100%',

  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 600,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  red: {
    backgroundColor: 'red',
  },
  blue: {
    backgroundColor: 'blue',
  },
  link :{
    textDecoration : 'none',
    color : '#3c0b65',
  },
  linkButton : {
    color : 'white',
    textDecoration : 'none',
  }
}));

export default function PrimarySearchAppBar(props) {
  const {history, location, match} = useReactRouter();

    const [category, setCategory] = useState([]);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorCategoryEl, setAnchorCategoryEl] = React.useState(null);
    const [search, setSearch] = React.useState("");

    useEffect(()=> {
      
      axios.get('http://localhost:80/api/category/list?token='.concat(sessionStorage.getItem("JWT")))
      .then(
          (res => 
           setCategory(res.data.categories)
          ));

      }, []);
        
     



  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClickCategory(event) {
    setAnchorCategoryEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleCloseCategory() {
    setAnchorCategoryEl(null);
  }  

  function signout(){
    sessionStorage.removeItem("JWT");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("uuid");
    sessionStorage.removeItem("Player");
    history.push({
      pathname : "/login"
    })
  }
  

  function onChange(e){
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    
  }

  


  function onEnter(e){
    if(e.key === 'Enter'){
      console.log(search);
      history.push({
        pathname : "/searchresult"
    })
    sessionStorage.setItem("search",search)
    window.location.reload(false)
  }
}

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Container fixed> 
            <Grid 
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}>
              <Grid item xs={3}>
                <Grid 
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                  >
                  <Link to ="/home">
                    <img alt="logo" src={podlogo}className={classes.logo}/>
                  </Link>
                  <Button
                    aria-controls="customized-category"
                    aria-haspopup="true"
                    variant="text"
                    color="inherit"
                    onClick={handleClickCategory}
                  >
                  <Category />
                    Category
                  <ArrowDropDownIcon />
                  </Button>
                    <StyledMenu
                      id="customized-category"
                      anchorEl={anchorCategoryEl}
                      keepMounted
                      open={Boolean(anchorCategoryEl)}
                      onClose={handleCloseCategory}
                    >
                      <Box width={200}>
                      {category.map(item => (
                        <Link to={{
                          pathname : `/category/${item}`,
                          state : { 
                            categoryName : `${item}`
                          }
                        }
                          

                          } className={classes.link}>
                          <MenuItem>
                            <Typography variant="inherit">{item}</Typography>
                          </MenuItem>
                        </Link>
                        
                      ))
                      }
                      </Box>
                    </StyledMenu>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon/>
                  </div>
                  <InputBase
                    placeholder="Search"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange = {onChange}
                    onKeyDown = {onEnter}
                    inputProps={{ 'aria-label': 'Search' }}
                  />
                </div>
              </Grid>
                
              <Grid item xs={4}>
                <Grid 
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    >
                  <div className={classes.sectionDesktop}>
                    
                  <Link to = '/subscription' className={classes.linkButton}>
                    <Button
                          aria-controls="customized-menu"
                          aria-haspopup="true"
                          variant="text"
                          color="inherit">
                        <Subs />
                        Subscription
                      </Button>
                    </Link>

                  <Link to = '/trending' className={classes.linkButton}>
                  <Button
                          aria-controls="customized-menu"
                          aria-haspopup="true"
                          variant="text"
                          color="inherit">
                        <StarIcon />
                        Trending
                      </Button>
                  </Link>
                  
                  
                  <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="text"
                    color="inherit"
                    onClick={handleClick}
                  >
                  {sessionStorage.getItem("username")}
                  <ArrowDropDownIcon />
                  </Button>
                    <StyledMenu
                      id="customized-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <Box width={200}>
                        <Link to={{
                          pathname : `/profile`, 
                        }} className={classes.link}>
                          <StyledMenuItem>
                            <ListItemText primary="Profile" />
                          </StyledMenuItem>
                        </Link>
                        <Link to={{
                          pathname : `/playlist`,
                        }} className={classes.link}>
                          <StyledMenuItem>
                            <ListItemText primary="Playlist" />
                          </StyledMenuItem>
                        </Link>
                        <StyledMenuItem>
                          <ListItemText primary="Log Out" onClick={signout}/>
                        </StyledMenuItem>
                      </Box>
                    </StyledMenu>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
  </div>
  );
}
