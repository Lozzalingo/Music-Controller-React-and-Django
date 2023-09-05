import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter> {/* Wrap everything in BrowserRouter */}
        <div>
          <HomePage />
        </div>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);