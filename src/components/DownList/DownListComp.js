import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DownListUIType from './DownListUIType';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

function DownListComp(props) {
  const classes = useStyles();
  console.log (props.type);
  const title = props.title &&
    <div>
      <Grid 
        container 
        spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="center">
        <Grid item xs={5}>
            <h1>{props.title}</h1>
        </Grid>
      </Grid>
    </div>

  return (
    <div className={classes.root}>
      {title}
        <Grid container spacing={3}>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
            <Grid item xs={12}>
              <DownListUIType type={props.type}/>
            </Grid>
        </Grid>
    </div>
  );
}

export default DownListComp;