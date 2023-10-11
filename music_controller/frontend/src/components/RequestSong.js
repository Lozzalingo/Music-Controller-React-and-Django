import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";

function RequestSong() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [title, setTitle] = useState("Search a Song Name or Artist");
  const [message, setMessage] = useState("");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false); // Flag to track if the search button is clicked

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const limitSongTitle = (title) => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };

  const limitArtist = (title) => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };

  useEffect(() => {
    fetch("/spotify/queued-songs")
      .then((response) => response.json())
      .then((data) => {
        setQueuedSongs(data.queued_songs);
      })
      .catch((error) => {
        console.error("Error fetching queued songs:", error);
      });
  }, []);

  const searchSongs = () => {
    fetch(`/spotify/search-songs/search?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.searched_songs);
        setTitle("Song Results");
        setMessage("");
        setSearchButtonClicked(true);
      })
      .catch((error) => {
        console.error("Error searching songs:", error);
      });
  };

  const addToQueue = async (uri) => {
    if (!uri) {
      console.error("URI is not valid:", uri);
      return; // Early return if URI is not valid
    }

    setMessage(""); // Reset the message

    // Log the URI of the song you're trying to add
    console.log("URI of the song being added:", uri);

    const songInQueue = queuedSongs.find((song) => song.uri === uri);

    if (songInQueue) {
      setMessage("Song already in queue");
    } else {
      try {
        // Add the track to the queue
        await fetch(`/spotify/add-to-queue?uri=${uri}`);

        // Fetch the updated queue
        const queueResponse = await fetch("/spotify/queued-songs");
        if (!queueResponse.ok) {
          throw new Error("Failed to fetch the updated queue.");
        }

        const queueData = await queueResponse.json();

        setMessage("Song added to queue");

        // Update the queuedSongs state with the updated queue
        setQueuedSongs(queueData.queued_songs);

        console.log("Track added to the queue successfully.");
      } catch (error) {
        console.error("Error adding track to queue:", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <p>{message}</p>
      <TextField
        type="text"
        placeholder="What do you want to listen to?"
        value={query}
        onChange={handleInputChange}
        //style={{ width: "100%" }}
        style={{ minWidth: "250px" }}
      />
      <div>
        <br></br>
        <Button
          onClick={searchSongs}
          variant="contained"
          color="primaryCustom"
          className="mediumWidth"
          style={{ marginBottom: "20px" }}
        >
          Search
        </Button>
      </div>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "55vh",
          overflowX: "hidden",
        }}
      >
        {searchResults.map((song, index) => (
          <Card
            key={song.id}
            style={{
              padding: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginTop: "8px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              height: "50px",
            }}
          >
            <img
              src={song.image_url}
              height="42px"
              width="42px"
              alt={song.title}
              style={{ marginRight: "8px" }}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
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
            </div>
            <div>
              <Button
                onClick={() => addToQueue(song.uri)}
                variant="contained"
                color="tertiaryCustom"
                style={{ minWidth: "100px" }}
              >
                Request
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Button
        color="secondaryCustom"
        component={Link}
        to="/"
        variant="contained"
        style={{ marginTop: searchButtonClicked ? "20px" : "0" }}
        className="mediumWidth"
      >
        Go Back to Room
      </Button>
    </div>
  );
}

export default RequestSong;
