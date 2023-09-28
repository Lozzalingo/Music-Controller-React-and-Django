import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

export default function Info(props) {
  const [page, setPage] = useState(pages.JOIN);

  function joinInfo() {
    return (
      <Grid container spacing={3} align="center" alignItems="center">
        <Grid item xs={12} align="center">
          <Typography variant="h3">DJ Voting System</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography>
            The DJ Voting System allows users to create and join virtual rooms
            for synchronized music listening on Spotify.
            Key Features:
            Create a Room: Host a room and invite friends.
            Join a Room: Enter a room using a unique code.
            Music Playback: Hosts can connect to their premium Spotify account.
            Voting System: Participants can influence song selection.
            Settings: Configure room settings as the host.
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h4">How to Create a Room:</Typography>
        </Grid>
        <Grid item xs={12} align="center">
                1. Login to your account.<br></br>
                2. Access the dashboard.<br></br>
                3. Click "Create a Room."<br></br>
                4. Configure room settings.<br></br>
                5. Connect your music service if desired.<br></br>
                6. Click "Create Room" and share the room code.<br></br>
        </Grid>
      </Grid>
    );
  }

  function createInfo() {
    return (
      <Grid container spacing={3} align="center" alignItems="center">
        <Grid item xs={12} align="center">
          <Typography variant="h4">How to Join a Room:</Typography>
        </Grid>
        <Grid item xs={12} align="center">
                1. Copy the room code from your room page.<br></br>
                2. Click "Join A Room" from the homepage.<br></br>
                3. Enter the code.<br></br>
                4. Click "Enter Room".<br></br>
                5. To vote to skip a song, click the skip button.<br></br>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is DJ vote?
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <IconButton
          onClick={() => {
            page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
          }}
        >
          {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
