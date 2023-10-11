import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Queue(props) {
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch queued song data from your Django API
    fetch("/spotify/queued-songs")
      .then((response) => response.json())
      .then((data) => {
        setQueuedSongs(data.queued_songs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching queued songs:", error);
        setIsLoading(false);
      });
  }, []);

  // Function to limit the song title to 100 characters
  const limitSongTitle = (title) => {
    if (title.length > 28) {
      return title.substring(0, 28) + "...";
    }
    return title;
  };

  const limitArtist = (title) => {
    if (title.length > 30) {
      return title.substring(0, 30) + "...";
    }
    return title;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Songs Coming Up
      </Typography>
      <div style={{ overflowY: "auto", maxHeight: "75vh" }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Grid container alignItems="center">
            {queuedSongs.map((song, index) => (
              <Card
                key={index}
                style={{
                  padding: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "8px",
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={song.image_url}
                  height="42px"
                  width="42px"
                  alt="Album Cover"
                  style={{ marginRight: "8px" }} // Add spacing between image and text
                />
                <CardContent>
                  <Typography
                    component="h6"
                    variant="h6"
                    style={{ lineHeight: "2", fontSize: "16px" }}
                  >
                    {limitSongTitle(song.title)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ lineHeight: "1.2", fontSize: "12px" }}
                  >
                    {limitArtist(song.artist)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}
      </div>
      <Button
        color="primaryCustom"
        component={Link}
        className="mediumWidth"
        to="/"
        variant="contained"
        style={{ marginTop: "20px" }}
      >
        Go Back to Room
      </Button>
    </div>
  );
}

export default Queue;
