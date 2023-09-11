Spotify CLI Playlist Manager

The Spotify CLI Playlist Manager is a command-line tool that allows you to create, manage, and enhance your Spotify playlists directly from your terminal. You can add songs to your playlists, delete songs, and perform various playlist-related actions effortlessly.

Features:

- Create new Spotify playlists or manage existing ones.

- Add songs to your playlists using song and artist information.

- Detect and handle duplicate songs in playlists.

- Delete songs from a playlist with ease.

- Customizable song entry format.

- Command-line interface for easy interaction.

Prerequisites:

Before you begin, ensure you have met the following requirements:

- Node.js installed on your system.

- A Spotify Developer account with credentials (Client ID and Client Secret).

- A valid Spotify user account.

Installation:

1\. Clone this repository to your local machine:

   git clone https://github.com/yourusername/spotify-cli-playlist-manager.git

2\. Navigate to the project directory:

   cd spotify-cli-playlist-manager

3\. Install the required dependencies:

   npm install

Usage:

To use the Spotify CLI Playlist Manager, follow these steps:

1\. Authenticate with your Spotify credentials:

   npm run authenticate -- --client-id <your-client-id> --client-secret <your-client-secret> --user-id <your-user-id> --auth-token <your-auth-token>

2\. Create a new playlist or specify an existing playlist name:

   npm run create-playlist -- --name "My New Playlist"

3\. Add songs to your playlist from a text file (default: songs.txt):

   npm run add-songs -- --file <file-path> --song-format "<custom-format>"

4\. Manage your playlist by adding, deleting, or performing other actions.

5\. Enjoy managing your Spotify playlists from the command line!

Command Line Options:

- -h, --help: Show help message and exit.

- -n, --name <playlist_name>: Specify the playlist name.

- -f, --file <file_path>: Specify the input file path (default: songs.txt).

- -d, --delete: Delete songs from the playlist (requires --song).

- -s, --song <song_index>: Song index to delete from the playlist (use with --delete).

- -x, --song-format <format>: Custom format for song entries (default: '[song name] by [artist name]').

- -u, --usage: Show usage examples and exit.

Examples:

- To authenticate with Spotify:

  npm run authenticate -- --client-id <your-client-id> --client-secret <your-client-secret> --user-id <your-user-id> --auth-token <your-auth-token>

- To create a new playlist:

  npm run create-playlist -- --name "My New Playlist"

- To add songs from a file:

  npm run add-songs -- --file songs.txt

- To delete a song from the playlist:

  npm run delete-song -- --song 3

License:

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments:

- This project was inspired by the need for a convenient way to manage Spotify playlists via the command line.

Happy playlist managing!
