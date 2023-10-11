import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import Info from "./Info";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <Grid container spacing={1} align="center" alignItems="center">
        <Grid item xs={12} align="center">
          <Typography
            variant="h3"
            color="textPrimary"
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "#292929",
              padding: "15px 20px",
              borderRadius: "10px",
            }}
          >
            DJ Vote System
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondaryCustom"
            component={Link}
            to="/join"
            className="mediumWidth"
          >
            Join a Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            className="mediumWidth"
            color="primaryCustom"
            component={Link}
            to="/create"
          >
            Create a Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            className="mediumWidth"
            color="tertiaryCustom"
            component={Link}
            to="/info"
          >
            Info
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        <Routes>
          <Route
            exact
            path="/"
            element={
              this.state.roomCode ? (
                <Navigate to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              )
            }
          />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/info" element={<Info />} />
          <Route path="/create" element={<CreateRoomPage />} />
        </Routes>
      </div>
    );
  }
}
