console.log('Route', Route);
console.log('Router', Router);
console.log('Routes', Routes);
console.log('HomePage', HomePage);
console.log('CreateRoomPage', CreateRoomPage);
console.log('RoomPage', RoomPage);
console.log('RoomJoinPage', RoomJoinPage);

import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage"; // Import the CreateRoomPage component
import RoomPage from "./Room";
import RoomJoinPage from "./RoomJoinPage"; // Import the RoomPage component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} /> {/* Define the room route */}
          {/* Add more routes as needed */}
        </Routes>
      </Router>
      </div>
    );
  }
}
  
const appDiv = document.getElementById("app");
render(<App />, appDiv);
