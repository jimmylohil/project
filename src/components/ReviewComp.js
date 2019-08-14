import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import images from '../images/podlogo_text_dark.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  bigAvatar: {
    margin: 10,
    width: 90,
    height: 90,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  const [value] = React.useState(3);

  return (
    <div className={classes.root}>
        <Grid 
            container 
            spacing={1}
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.grid}
            >
            {/* Episode Image */}
            <Grid item xs={4} >
                <Grid 
                    container 
                    spacing={1}
                    direction="column"
                    justify="center"
                    alignItems="center" >
                    <Avatar alt="Podcast" src={images}className={classes.bigAvatar} />
                </Grid>
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <h2 className={classes.title}>Username</h2>
                </Grid>
            </Grid>
            {/* Episode Name */}
            <Grid item xs={7} >
                <Grid 
                    container 
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    >
                    <Grid item xs ={12}>
                        <Grid 
                        container 
                        spacing={1}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start">
                            <Rating value={value} readOnly /> 
                        </Grid>
                    </Grid>
                    <Grid item xs ={12}>
                    <Grid 
                        container 
                        spacing={1}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start">
                            <h5 className={classes.title}>Comment Here</h5>
                        </Grid>
                    </Grid>  
                </Grid>
            </Grid>
        </Grid>
    </div>
  );
}
