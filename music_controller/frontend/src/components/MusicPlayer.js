import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

function MusicPlayer(props) {
    const songProgress = (props.time / props.duration) * 100;
  
    const skipSong = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/skip", requestOptions);
    }
  
    // Define pauseSong and playSong as functions
    const pauseSong = () => {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/pause", requestOptions);
    }
  
    const playSong = () => {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/play", requestOptions);
    }
  
    if (props.is_playing) {
      return (
        <Grid container alignItems="center">
            <Card style={{ padding: "16px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <Grid container alignItems="center">
                <Grid item xs={4}>
                <img src={props.image_url} height="100%" width="100%" alt="Album Cover" />
                </Grid>
                <Grid item xs={8} style={{ paddingLeft: "16px" }}>
                <Typography component="h5" variant="h5">
                    {props.title}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                    {props.artist}
                </Typography>
                <div>
                    <IconButton
                    onClick={() => {
                        props.is_playing ? pauseSong() : playSong();
                    }}
                    >
                    {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton onClick={() => skipSong()}>
                    {props.votes} / {props.votes_required}
                    <SkipNextIcon />
                    </IconButton>
                </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
            </Card>
        </Grid>
      );
    } else {
      return (
          <Card style={{ padding: "16px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width:"300px"}}>
            <Typography variant="h6" component="h6" style={{ color: "#c90022" }}>
              No song is currently playing.
            </Typography>
          </Card>
      );
    }
  }  

export default MusicPlayer;
