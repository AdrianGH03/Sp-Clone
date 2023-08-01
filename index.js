
// // // JavaScript file


// // //Need redirect, mine is https://redirectmeto.com/http://127.0.0.1:5500/dist/index.html
// // // need client id, and client secret
// // //need authorize URL: https://accounts.spotify.com/authorize;

// // //need authorize function, which creates a URL to authorize

// //EXAMPLE OF ALL
// // var redirect = "redirect url here"
// // var client_id = 'sdfdfsgmndo'
// // var client_secret = "sdsdsdsd";

// // const AUTHORIZE = "https://accounts.spotify.com/authorize"
// // function authorize(){
// //   let url = AUTHORIZE;
// //   url += "?client_id=" + client_id;
// //   url += "&response_type=code";
// //   url += "&show_dialog=true";
// //   url += "&scope=user-read-playback-state user-modify-playback-state user-read-currently-playing"
// //   window.location.href = url;
// // }

// // const fetchData = async () => {
// //   const accessToken = await getToken();

// //   if (accessToken) {
// //     try {
// //       const response = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
// //         headers: {
// //           'Authorization': `Bearer ${accessToken}`
// //         }
// //       });
// //       const data = await response.json();
// //       console.log(data);
// //       // Handle the response data here
// //     } catch (error) {
// //       console.error('Error:', error);
// //     }
// //   }
// // };


// // fetchData();

// const clientId = 'f87d27cfe71b4143b375d4a145e329f3';
// const clientSecret = '7de30f0792434bcea67ba93cc19a4c69';

// const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// const data = new URLSearchParams();
// data.append('grant_type', 'client_credentials');
// data.append('client_id', clientId);
// data.append('client_secret', clientSecret);

// const getToken = async () => {
//   try {
//     const response = await fetch(tokenEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: data,
//     });
//     const dataTwo = await response.json();
//     const accessToken = dataTwo.access_token;
//     return accessToken;
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };


// const getPlaylistTrackUri = async (playlistUrl, accessToken) => {
//     try {
//       // Extract playlist ID from the URL
//       const playlistId = playlistUrl.match(/playlist\/(\w+)/)[1];
//       const limit = 100; // Number of items to retrieve per request
//       let offset = 0; // Starting point of the data to retrieve
  
//       // Keep track of all the retrieved tracks
//       const allTracks = [];
  
//       while (true) {
//         // Make a request to the Spotify API to get playlist tracks with pagination
//         const response = await fetch(
//           `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
  
//         if (!response.ok) {
//           throw new Error('Failed to retrieve playlist tracks');
//         }
  
//         const data = await response.json();
  
//         // Add the retrieved tracks to the allTracks array
//         allTracks.push(...data.items);
  
//         // Check if there are more items to retrieve
//         if (data.next) {
//           // Update the offset for the next request
//           offset += limit;
//         } else {
//           // If there are no more items, break the loop
//           break;
//         }
//       }
  
//       // Call the function to render the images on the DOM
//       renderImages(allTracks);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
  
//   // Function to render the images on the DOM
//   function renderImages(tracks) {
//     const imageContainer = document.getElementById('imageContainer');
    
//     // Clear the existing content
//     imageContainer.innerHTML = '';
    
//     // Loop through each track and add the image to the DOM
//     tracks.forEach((track, index) => {
//       const image = document.createElement('img');
//       const albumName = document.createElement('h1')
//       const songName = document.createElement('h1')
//       const artistName = document.createElement('h1')
//       const songBody = document.createElement('div')
//       const songInfo = document.createElement('div')
//       const songNumber = document.createElement('h1')
//       songNumber.innerText = index + 1
      
//       songBody.classList.add('songBody')
//       songNumber.classList.add('songNumber')
//       songInfo.classList.add('songInfo')

//       songName.innerText = `SONG: ${track.track.name}`;
//       albumName.innerText = `ALBUM: ${track.track.album.name}`
//       artistName.innerText = `ARTIST: ${track.track.artists[0].name}`

//       image.src = track.track.album.images[1].url;

//       songInfo.appendChild(artistName)
//       songInfo.appendChild(albumName)
//       songInfo.appendChild(songName)
      
//       songBody.appendChild(songNumber)
//       songBody.appendChild(image);
//       songBody.appendChild(songInfo)

      

//       imageContainer.appendChild(songBody)

//     });
//   }

// const playlistUrl = 'https://open.spotify.com/playlist/4aHEvG0cTO93AMxxYmuuis'; // Replace with your playlist URL

// (async () => {
//   const accessToken = await getToken(); // Get the access token
//   getPlaylistTrackUri(playlistUrl, accessToken);
// })();


// // document.getElementById('playButton').addEventListener('click', playSong);

// // async function playSong() {
// //   const accessToken = await getToken(); // Get the access token

// //   if (accessToken) {
// //     const url = 'https://api.spotify.com/v1/me/player/play';
// //     const songUri = 'spotify:track:0OM84HfW4XX1kmwCMDPmcS'; // Replace with your desired song URI

// //     const request = new Request(url, {
// //       method: 'PUT',
// //       headers: new Headers({
// //         'Authorization': `Bearer ${accessToken}`,
// //         'Content-Type': 'application/json'
// //       }),
// //       body: JSON.stringify({
// //         uris: [songUri]
// //       })
// //     });

// //     try {
// //       const response = await fetch(request);

// //       if (response.status === 204) {
// //         console.log('Song played successfully');
// //       } else {
// //         console.error('Failed to play song');
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   }
// // }

