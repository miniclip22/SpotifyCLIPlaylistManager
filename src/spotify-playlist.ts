import axios from 'axios';
import * as fs from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to display help information
function showHelp() {
    console.log(`
Usage: ts-node spotify-playlist.ts [OPTIONS]

Options:
  -h, --help                 Show this help message and exit
  -n, --name <playlist_name> Specify the playlist name
  -f, --file <file_path>     Specify the input file path (default: songs.txt)
  -d, --delete               Delete songs from the playlist (requires --song)
  -s, --song <song_index>    Song index to delete from the playlist (use with --delete)
  -x, --song-format <format> Custom format for song entries (default: '[song name] by [artist name]')
  -v, --usage                Show usage examples and exit
  `);
}

// Function to parse a song entry based on the provided format
function parseSongEntry(entry: string, format: string) {
    const placeholders = format.split('%');
    let song = '';
    let artist = '';

    for (const ph of placeholders) {
        const parts = entry.split(ph);

        if (parts.length === 2) {
            song = parts[0].trim();
            artist = parts[1].trim();
            break;
        }
    }

    return { song, artist };
}

// Function to check Spotify credentials
async function checkSpotifyCredentials(clientId: string, clientSecret: string) {
    try {
        const token = await authenticate(clientId, clientSecret);
        return token !== null;
    } catch (error) {
        console.error('\x1b[31mInvalid Spotify credentials. Please check your Client ID and Client Secret.\x1b[0m');
        return false;
    }
}

// Function to authenticate with Spotify API
async function authenticate(clientId: string, clientSecret: string) {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            auth: {
                username: clientId,
                password: clientSecret,
            },
            params: {
                grant_type: 'client_credentials',
            },
        });

        const data = response.data;
        return data.access_token || null;
    } catch (error) {
        throw error;
    }
}

// Function to create or modify a playlist
async function createOrModifyPlaylist(playlistName: string, authToken: string) {
    try {
        const playlistId = await createPlaylistAPI(playlistName, authToken);
        return playlistId;
    } catch (error) {
        throw error;
    }
}

// Function to create a new playlist using the Spotify API
async function createPlaylistAPI(playlistName: string, authToken: string) {
    try {
        const response = await axios.post(
            'https://api.spotify.com/v1/me/playlists',
            {
                name: playlistName,
                public: false, // Adjust the privacy settings as needed
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        const data = response.data;
        return data.id;
    } catch (error) {
        throw error;
    }
}

// Function to add a song to the playlist using the Spotify API
async function addSongToPlaylist(
    playlistId: string,
    songName: string,
    artistName: string,
    authToken: string
) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: `${songName} ${artistName}`,
                type: 'track',
            },
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const trackData = response.data.tracks.items[0];
        if (trackData) {
            const trackURI = trackData.uri;

            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { uris: [trackURI] },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
        }
    } catch (error) {
        throw error;
    }
}

// Function to read a file asynchronously
function readFileAsync(filePath: string, encoding: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, encoding, (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    let clientId = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    let userId = process.env.SPOTIFY_USER_ID;
    let authToken = process.env.SPOTIFY_AUTH_TOKEN;
    let songFormat = '[song name] by [artist name]';

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-c':
            case '--client-id':
                clientId = args[i + 1];
                i++;
                break;
            case '-s':
            case '--client-secret':
                clientSecret = args[i + 1];
                i++;
                break;
            case '-u':
            case '--user-id':
                userId = args[i + 1];
                i++;
                break;
            case '-a':
            case '--auth-token':
                authToken = args[i + 1];
                i++;
                break;
            case '-f':
            case '--file':
                // Handle custom file path (optional)
                break;
            case '-n':
            case '--name':
                // Handle custom playlist name (optional)
                break;
            case '-x':
            case '--song-format':
                // Handle custom song format (optional)
                songFormat = args[i + 1];
                i++;
                break;
            case '-d':
            case '--delete':
                // Handle song deletion (optional)
                break;
            case '-s':
            case '--song':
                // Handle song index for deletion (optional)
                break;
            case '-v':
            case '--usage':
                showHelp();
                process.exit(0);
                break;
            default:
                console.error(`Invalid option: ${args[i]}`);
                showHelp();
                process.exit(1);
                break;
        }
    }

    // Check if required credentials are missing
    if (!clientId || !clientSecret || !userId || !authToken) {
        console.error('\x1b[31mSpotify credentials are missing. Please provide all required credentials.\x1b[0m');
        process.exit(1);
    }

    // Check Spotify credentials validity
    const isValid = await checkSpotifyCredentials(clientId, clientSecret);
    if (!isValid) {
        process.exit(1);
    }

    const playlistName = process.env.PLAYLIST_NAME || args[0];

    // Additional functionality can be added here, such as creating or modifying playlists.
    // Below is an example of how you can proceed to manage Spotify playlists.

    // Example: Create a new playlist or modify an existing one
    const playlistId = await createOrModifyPlaylist(playlistName, authToken);
    if (!playlistId) {
        console.error('\x1b[31mFailed to create or modify the playlist.\x1b[0m');
        process.exit(1);
    }

    // Read the input file (default: songs.txt)
    const filePath = process.env.FILE_PATH || 'songs.txt';

    try {
        const data = await readFileAsync(filePath, 'utf8');
        const lines = data.split('\n');

        for (const line of lines) {
            const { song, artist } = parseSongEntry(line, songFormat);
            if (song && artist) {
                await addSongToPlaylist(playlistId, song, artist, authToken);
            }
        }

        console.log('Playlist creation and song addition complete.');
        process.exit(0);
    } catch (error) {
        console.error('\x1b[31mError reading the input file or adding songs to the playlist.\x1b[0m', error);
        process.exit(1);
    }
}

// Run the main function
main();
