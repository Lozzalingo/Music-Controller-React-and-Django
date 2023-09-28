import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
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
      <Grid container spacing={3} align="center" alignItems="center">
      <Grid item xs={12} align="center">
        <Typography variant="h3" color="black"  style={{
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
        <ButtonGroup fullWidth variant="contained" color="primary">
          <Button
            color="primary"
            component={Link}
            to="/join"
            className="mainButton" 
          >
            Join a Room
          </Button>
          <Button
            color="secondary"
            component={Link}
            to="/create"
            className="mainButton"
          >
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup fullWidth variant="contained" color="default">
          <Button component={Link} to="/info">
            Info
          </Button>
        </ButtonGroup>
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