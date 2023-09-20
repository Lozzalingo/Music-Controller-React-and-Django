import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";

export default function CreateRoomPage(props) {
  // Use defaultProps for default values
  // Use defaultProps for default values
  const {
    votesToSkip: defaultVotesToSkip = 2,
    guestCanPause: defaultGuestCanPause = true,
    update: defaultUpdate = false,
    roomCode: defaultRoomCode = null,
    updateCallback: defaultUpdateCallback = () => {},
  } = props;

  // Use state to manage the values
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotesToSkip);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate(); 

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false);
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch('/api/create-room', requestOptions)
      .then((response) => response.json())
      .then((data) => navigate('/room/' + data.code)); // Use navigate here
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };
    fetch('/api/update-room', requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg('Room updated successfully!');
      } else {
        setErrorMsg('Error updating room...');
      }
      props.updateCallback();
    });
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = props.update ? 'Update Room' : 'Create a Room';

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg !== '' || successMsg !== ''}>
          {successMsg !== '' ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg('');
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg('');
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            value={(guestCanPause ? guestCanPause.toString() : "").toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: 'center' },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );  
}