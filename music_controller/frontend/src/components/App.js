import React, { Component } from "react";
import { render } from "react-dom";
import Theme from "./Theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage";
import RoomPage from "./Room";
import Info from "./Info";
import Queue from "./Queue";
import RoomJoinPage from "./RoomJoinPage";
import RequestSong from "./RequestSong";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={Theme}>
        <div className="center">
          <Router>
            <Routes>
              <Route path="*" element={<HomePage />} />
              <Route path="/create" element={<CreateRoomPage />} />
              <Route path="/info" element={<Info />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/join" element={<RoomJoinPage />} />
              <Route path="/request-song" element={<RequestSong />} />
              <Route path="/room/:roomCode" element={<RoomPage />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
