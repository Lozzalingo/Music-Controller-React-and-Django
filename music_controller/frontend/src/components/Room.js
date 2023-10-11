import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
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
        if (!isComponentMounted) return; // Check if component is mounted
        setRoomDetails((prevState) => ({
          ...prevState,
          spotifyAuthenticated: data.status,
        }));
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              if (!isComponentMounted) return; // Check if component is mounted
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
        if (!isComponentMounted) return; // Check if component is mounted
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
        if (!isComponentMounted) return; // Check if component is mounted
        navigate("/");
        return;
      }
      const data = await response.json();
      if (!isComponentMounted) return; // Check if component is mounted
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

  // Add a state variable to track if the component is mounted
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    getRoomDetails();
    getCurrentSong(); // Fetch the current song when the component mounts

    // Set isComponentMounted to true when the component mounts
    setIsComponentMounted(true);

    // Equivalent to componentDidMount
    const interval = setInterval(() => {
      // Check if the component is still mounted before updating state
      if (isComponentMounted) {
        getCurrentSong();
      }
    }, 1000);

    // Equivalent to componentWillUnmount
    return () => {
      // Set isComponentMounted to false when the component unmounts
      setIsComponentMounted(false);
      clearInterval(interval);
    };
  }, [roomCode, navigate, isComponentMounted]);

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
            color="secondaryCustom"
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
        <Button
          variant="contained"
          color="primaryCustom"
          onClick={() => updateShowSettings(true)}
          className="mediumWidth"
          style={{
            marginRight: "5px",
            marginLeft: "5px",
            marginTop: "5px",
            marginBottom: "5px",
          }}
        >
          Settings
        </Button>
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
        <Grid item xs={12} align="center">
          <Button
            component={Link}
            to="/request-song"
            variant="contained"
            color="quaternaryCustom"
            className="mediumWidth"
            style={{
              marginRight: "5px",
              marginLeft: "5px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
            //onClick={requestSongButtonPressed}
          >
            Request Song
          </Button>
          <Button
            component={Link}
            to="/queue"
            variant="contained"
            color="tertiaryCustom"
            className="mediumWidth"
            style={{
              marginRight: "5px",
              marginLeft: "5px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            See Requests
          </Button>
          <Button
            variant="contained"
            color="secondaryCustom"
            onClick={leaveButtonPressed}
            className="mediumWidth"
            style={{
              marginRight: "5px",
              marginLeft: "5px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            Leave Room
          </Button>
          <RenderSettingsButton />
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
