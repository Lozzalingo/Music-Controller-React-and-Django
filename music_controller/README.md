# DJ Voting System
#### Video Demo:  https://youtu.be/bf14BcXc6po
#### Description: 
# Overview

My project provides a democratic solution to decide on what songs are played on Spotify. The application could be used in nightclubs, house parties, road trips, or any situation where music selection affects multiple people.

The application's home page provides users with two options. The first option is to create a room, and the second option is to join a room. There is no need to log in or create an account; the application uses web browser sessions to track preferences and settings. Users who choose to create a room have their role defined as a host.

When a user clicks 'create a room,' they will be asked to log into their Spotify account. Once they have authorized the application, they are presented with a selection of room customization options. Hosts can allow guests to play/pause the music and set the number of votes required to skip a song.

Once the host has defined their preferences, they should click 'create a room' again, which will present them with a room code. From the home screen, this code will allow other users to join the room the host created. Hosts and users have similar options inside a room; however, the host has the additional option of updating the room settings, which uses the same view as the create room workflow.

The other options are 'request a song,' 'see requests,' and 'leave the room.'

If a user clicks on the 'request a song' button, they are presented with a search bar, where they can search Spotify by typing in an artist's name or a song title. They are then able to add songs from their search to the host's Spotify queue.

If a user clicks on the 'see requests' option, they are presented with a list of songs currently queued in the host's Spotify account. However, this option only works if a song is currently playing.

If a user clicks on 'leave the room,' they are returned to the home screen, and can join a new room or create a room. If a host or guest tries to return to the home screen without clicking 'leave the room,' they will be automatically redirected back into the room they've created/joined using their session ID.

# Design Choices

## Spotify

My Spotify API design choices were made to minimize the effort for users to create a room and start making song requests; however, upon reflection, I would make some changes. Adding songs to a host's queue is the most direct way to line up a series of song requests; however, Spotify's API provides several limitations, such as removing songs from the queue, and loading songs from the queue when a song isn't playing. This problem can be solved by using Spotify's create a playlist option. The API allows for songs to be added and removed from playlists, and it acts as a clean slate, meaning previously queued songs won't appear as requests. However, it will require an additional step for the room host. They will need to create a playlist alongside creating a room. Finally, an additional feature that I could add to make the application better could include a voting system for queue songs, meaning the queue song with the most votes plays next.

## Django

I decided to choose Django as a backend framework to build upon CS50's introduction into Flask. Django has a robust reputation as a secure backend framework, is a natural progression from learning Flask, and is highly rated among backend developers.

## React

I decided to choose React as a front-end framework because I want to build a full-stack application using one of the most widely used, documented, and sought-after front-end frameworks available. Furthermore, I already have a lot of experience writing JavaScript, and it will allow me to progress nicely into using React Native for full-stack JavaScript mobile applications.

# Frontend Files

## App.js

My `App.js` file defines the main component for the frontend of my application. It serves as the entry point for the application and handles the routing of different views. It defines what should be rendered to the DOM and returns JSX syntax that represents the UI of the application.

## CreateRoomPage.js

My `CreateRoomPage.js` file defines a React functional component responsible for creating and updating a host's room settings in my web application. The component is used to configure settings such as the number of votes required to skip a song and whether guests can control playback.

## HomePage.js

The home page provides options for users to either join an existing room, create a new room, or access information about the application.

## Info.js

The info page provides information about the application's purpose and functionality, as well as instructions on how to create and join rooms. The component also allows users to navigate between different sections of the information page.

## MusicPlayer.js

The `musicplayer.js` file contains a component that displays information about the currently playing Spotify song from the host's account, including its title, artist, album cover, playback progress, and playback controls (play, pause, and skip). It interacts with the backend Django server to control the playback of music.

## Queue.js

This `queue.js` file fetches data about the queued songs from the Spotify API endpoint and displays them in a user-friendly manner. It includes a loading function that displays while the songs are being fetched and two functions that limit the amount of characters displayed for the song title and artist title to keep the UI aesthetically pleasing.

## RequestSongs.js

The `RequestSongs.js` file communicates with the Spotify API to search for songs based on user input and allows users to view search results, add songs to the host's queue.

## Room.js

The `Room.js` page is responsible for displaying information and actions related to a specific room in the application, such as the room's joining code, the music player component, the host's room settings, and a way to leave the room, and navigate to song requests or see already requested songs.

## RoomJoinPage.js

The `RoomJoinPage` allows users to join a room by entering a room code. It captures user input, communicates with the server to attempt room joining, and provides error feedback if the room code is not valid. It also includes navigation options for returning to the home page.

## Theme.js

The `theme.js` file defines a custom Material-UI theme with customized color palettes for the application.

## index.js

This code is used for decorative purposes and creates a dynamic gradient animation that continuously transitions between predefined colors for the background of my application.

## index.css

The `index.css` file contains a set of CSS rules to style different elements within the application, such as the main container, buttons, and messages.

## urls.py

The `urls.py` file routes various URLs to a single view.

## views.py

The `view.py` file renders the 'frontend/index.html' template when accessed, allowing Django to respond to requests with the content of that HTML template.

## apps.py

The `apps.py` file provides the configuration for the "frontend" app in my Django project. It specifies the name of the app as "frontend," which helps Django identify and manage this app within the project.

# Backend Files

## API  

### apps.py

This `apps.py` file is a configuration file for my "api" Django application. It specifies the primary key field type and the application's name. These settings can be further customized as needed for the specific requirements of the application.

### models.py

The `models.py` file contains the models that represent the structure of the
