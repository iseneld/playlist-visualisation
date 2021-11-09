/*

  Follow the instructions for "Calling the Spotify playlist API" and
  "Rendering a playlist visualisation" in the README 

*/

function getAccessToken() {
  const hash = window.location.hash;
  const hashWithoutHash = hash.substring(1);

  const params = hashWithoutHash.split('&');
  const keyValues = params.map((param) => param.split('='));

  const accessToken = keyValues[0][1];

  console.log('Access token: ' + accessToken);
  return accessToken;
}

// getAccessToken();

function getPlaylist(playlistId) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  };

  return fetch(url, { headers }).then((response) => response.json());
}

function renderPlaylist(playlistId) {
  /*
    <div class="playlist-item">
      <img class="playlist-item-img" src="IMG_URL" />
      <div class="playlist-item-title">SONG_TITLE</div>
    </div>
  */

  const container = document.querySelector('#tracks');

  getPlaylist(playlistId).then((playlist) => {
    console.log(playlist);
    const tracks = playlist.tracks.items;
    const audioPlayer = document.querySelector('#player');

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i].track;

      const playlistItem = document.createElement('div');
      playlistItem.classList.add('playlist-item');

      const playlistImg = document.createElement('img');
      playlistImg.classList.add('playlist-item-img');
      playlistImg.setAttribute('src', track.album.images[0].url);

      const playlistItemTitle = document.createElement('div');
      playlistItemTitle.classList.add('playlist-item-title');
      playlistItemTitle.innerHTML = track.name;

      playlistItem.addEventListener('click', () => {
        if (currentlyActive === track.id) {
          audioPlayer.pause();
          currentlyActive = null;
        } else {
          currentlyActive = track.id;
          if (track.preview_url) {
            audioPlayer.setAttribute('src', track.preview_url);
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }
        }
      });

      playlistItem.append(playlistImg);
      playlistItem.append(playlistItemTitle);
      container.append(playlistItem);
    }
  });
}

let currentlyActive;
renderPlaylist('37i9dQZF1DX3rxVfibe1L0');