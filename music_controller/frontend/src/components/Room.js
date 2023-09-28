import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    spotifyAuthenticated: false,
    song: {},
  });

  const [showSettings, setShowSettings] = useState(false);

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomDetails((prevState) => ({
          ...prevState,
          spotifyAuthenticated: data.status,
        }));
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
    .then((response) => {
      if (!response.ok) {
        return {};
      } else {
        return response.json();
      }
    })
    .then((data) => {
      setRoomDetails((prevState) => ({
        ...prevState,
        song: data,
      }));
      console.log(data);
    });
  };

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        navigate("/");
        return;
      }
      const data = await response.json();
      setRoomDetails({
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      });
      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoomDetails();
    getCurrentSong(); // Fetch the current song when the component mounts
  }, [roomCode, navigate]);


  useEffect(() => {
    getRoomDetails();
    getCurrentSong(); // Fetch the current song when the component mounts

    // Equivalent to componentDidMount
    const interval = setInterval(getCurrentSong, 1000);

    // Equivalent to componentWillUnmount
    return () => clearInterval(interval);
  }, [roomCode, navigate]);


  const leaveButtonPressed = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      await fetch("/api/leave-room", requestOptions);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
            className="mediumWidth"  
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
            className="mediumWidth"  
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const RenderSettingsButton = () => {
    if (roomDetails.isHost) {
      return (
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateShowSettings(true)}
            className="mediumWidth"  
          >
            Settings
          </Button>
        </Grid>
      );
    }
    return null;
  };

  const renderRoomDetails = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          {}
        </Grid>
        <Grid item xs={12} align="center">
          <MusicPlayer {...roomDetails.song} />
        </Grid>
        <Grid item xs={12} align="center">
          {}
        </Grid>
        <RenderSettingsButton />
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
            className="mediumWidth"  
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      {showSettings ? renderSettings() : renderRoomDetails()}
    </Grid>
  );
}

export default Room;
