import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';

function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  

const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 4),
      outline: 'none',
    },
    account: {
      width:150,
      height:150,
    },
    info: {
      textAlign:"left",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    cpass: {
      width: '95%',
    },
  }));

function UserSettingModal() {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <div>
            <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={open}
                  onClose={handleClose}
                  >
                  <div style={modalStyle} className={classes.paper}>
                  <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justify="center"
                    >
                      <Grid item xs={12}>   
                        <form noValidate autoComplete="off">
                        <Grid 
                          container 
                          spacing={1}
                          direction="row"
                          justify="center"
                          alignItems="center">
                          <Grid item xs={5}>
                              <AccountCircle className={classes.account}/>
                          </Grid>
                        </Grid>
                          <Grid 
                              container
                              direction="column"
                              justify="center"
                              alignItems="stretch"
                          >
                              {/* Username */}
                              <TextField
                                  required
                                  id="outlined-required"
                                  label="Username"
                                  className={classes.textField}
                                  margin="normal"
                                  variant="outlined"
                              />   
                              {/* Bio */}
                              <TextField
                                required
                                id="outlined-required"
                                label="Bio"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                              />
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                                >          
                                  <Button variant="contained" color="primary" component={Link} to="/home" className={classes.cpass}>
                                    Change Password
                                  </Button>
                                </Grid>
                              </Grid>
                              <Grid 
                                container 
                                spacing={1}
                                direction="row"
                                justify="flex-end"
                                alignItems="flex-end"
                                >
                                <Grid item xs ={3}>
                                    <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                                </Grid>
                                <Grid item xs ={3}>
                                    <Button variant="contained" color="primary">Save</Button>
                                </Grid>
                              </Grid> 
                            </Grid>
                          </form>
                        </Grid> 
                      </Grid> 
                  </div>
              </Modal>
        </div>
    )
}

export default UserSettingModal
