import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import image from '../podcast.jpg'


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  header: {
    height: 20,
    width:60,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  }
}));

export default function LinearListUITypeNew() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title="NEW"
      />
      <CardMedia
        className={classes.media}
        image={image}
        title="Title"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Description Here
        </Typography>
      </CardContent>
    </Card>
  );
}
