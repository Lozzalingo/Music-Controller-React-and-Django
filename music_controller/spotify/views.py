import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote


class AuthURL(APIView):
    def get(self, request, fornat=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request_me(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status.HTTP_204_NO_CONTENT)


class QueuedSongs(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        host = room.host

        # Check if a song is currently playing in the room
        is_song_playing = self.check_if_song_is_playing(room)

        if not is_song_playing:
            return Response({"message": "No song is currently playing in the room."}, status=status.HTTP_400_BAD_REQUEST)

        endpoint = "player/queue"
        response = execute_spotify_api_request_me(host, endpoint)

        try:
            # Access relevant data from the dictionary
            queue = response.get("queue", [])

            # Create a list to hold queued song information
            queued_songs = []

            # Iterate through the queue and extract song details
            for song_data in queue:
                song_name = song_data.get("name", "Unknown")
                uri = song_data.get("uri", "")
                artists = ", ".join(artist.get("name", "Unknown")
                                    for artist in song_data.get("artists", []))
                album_cover = song_data.get('album', {}).get(
                    'images', [{}])[0].get('url', '')
                song_id = song_data.get('id')
                queued_songs.append({
                    "title": song_name,
                    "artist": artists,
                    "image_url": album_cover,
                    "uri": uri,
                    "song_id": song_id
                })

            # Return a JSON response with the structured data
            return Response({"queued_songs": queued_songs})

        except KeyError:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

    def check_if_song_is_playing(self, room):
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request_me(room.host, endpoint)

        if 'error' in response or 'item' not in response:
            return False

        item = response.get('item')
        is_playing = response.get('is_playing')

        # Return True if a song is playing, otherwise return False
        return is_playing


class SearchSongs(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        host = room.host

        # Define the search query
        query = request.GET.get('q')

        if not query:
            return Response({'error': 'Query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        endpoint = f"search?q={query}&type=track"
        response = execute_spotify_api_request(host, endpoint)

        try:
            # Access relevant data from the dictionary
            tracks = response.get("tracks", {}).get("items", [])

            # Create a list to hold track information
            track_data = []

            # Iterate through the tracks and extract track details
            for track in tracks:
                artists = ", ".join(artist.get("name", "Unknown")
                                    for artist in track.get("artists", []))
                album_cover = track.get('album', {}).get(
                    'images', [{}])[0].get('url', '')
                track_data.append({
                    "title": track.get("name", "Unknown"),
                    "artist": artists,
                    "image_url": album_cover,
                    "uri": track.get("uri", ""),
                    "name": track.get("name", ""),
                    "type": track.get("type", ""),
                    "id": track.get("id", "")
                })

            # Return a JSON response with the structured data
            return Response({"searched_songs": track_data})

        except KeyError:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

    def check_if_song_is_playing(self, room):
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request_me(room.host, endpoint)

        if 'error' in response or 'item' not in response:
            return False

        item = response.get('item')
        is_playing = response.get('is_playing')

        return is_playing


class AddToQueue(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_414_REQUEST_URI_TOO_LONG)

        host = room.host
        
        is_song_playing = self.check_if_song_is_playing(room)

        if not is_song_playing:
            return Response({"message": "No song is currently playing in the room."}, status=status.HTTP_400_BAD_REQUEST)

        # uri =  "spotify:track:5VLO9fzXQ3oUxDAWQ9327o"
        # Get the URI of the selected track from the query parameters
        uri = self.request.GET.get('uri')
        if not uri:
            return JsonResponse({'error': 'Track URI is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Define the Spotify API endpoint for adding a track to the queue
        endpoint = f'player/queue?uri={uri}'

        # Make the Spotify API request to add the track to the queue
        response = execute_spotify_api_post_request(host, endpoint)

        if response.get('error'):
            return JsonResponse({'error': 'Failed to add the track to the queue.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse({'message': 'Track added to the queue successfully.'}, status=status.HTTP_200_OK)

    def check_if_song_is_playing(self, room):
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request_me(room.host, endpoint)

        if 'error' in response or 'item' not in response:
            return False

        item = response.get('item')
        is_playing = response.get('is_playing')

        return is_playing
