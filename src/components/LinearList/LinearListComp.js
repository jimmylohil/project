import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearListUIType from './LinearListUIType';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grid2: {
    backgroundColor: 'yellow',
},
}));

function CenteredGrid(props) {
  const classes = useStyles();
  const title = props.title &&
    <div>
      <Grid 
        container 
        spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="center">
        <Grid item xs={3}>
            <h1>{props.title}</h1>
        </Grid>
      </Grid>
    </div>

  return (
    <div className={classes.root}>
      {title}
        <Grid container spacing={3}>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
            <Grid item xs={2}>
              <LinearListUIType type={props.type}/>
            </Grid>
        </Grid>
    </div>
  );
}

export default CenteredGrid;