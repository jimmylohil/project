import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ShowUI from './ShowUI';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function SquareGrid(props) {
  const classes = useStyles();
  const title = props.title &&
  <div>
    <Grid 
      container 
      spacing={1}
      direction="row"
      justify="flex-start"
      alignItems="center">
      <Grid item xs={props.length}>
          <h1>{props.title}</h1>
      </Grid>
    </Grid>
  </div>

  return (
    <div className={classes.root}>
      {title}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}><ShowUI /></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}><ShowUI /></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}><ShowUI /></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}><ShowUI /></Paper>
        </Grid>
      </Grid>
    </div>
  );
}

