import { styled, css } from "uebersicht";

export const refreshFrequency = 1000; // Use ms (every second)

export const command = `osascript <<< 'tell application "Spotify"
  if it is running then
    set myTrack to current track
    if myTrack is not "missing value" then set myArtist to artist of myTrack
    if myTrack is not "missing value" then set myTitle to name of myTrack
    if myTrack is not "missing value" then set myAlbum to album of myTrack
    if myTrack is not "missing value" then set myArtwork to artwork url of myTrack
    if myTrack is not "missing value" then set myDuration to duration of myTrack
    if myTrack is not "missing value" then return myArtist & "|" & myTitle & "|" & myAlbum & "|" & myArtwork & "|" & player position & "|" & myDuration
  end if
end tell'`;

export const updateState = (event, prev) => {
  if (event.error) {
    return { ...prev, warning: `We got an error: ${event.error}` };
  }

  switch (event.type) {
    case "UB/COMMAND_RAN":
      const [
        spotifyArtist,
        spotifyTitle,
        spotifyAlbum,
        spotifyArtwork,
        playback,
        spotifyDuration
      ] = event.output.split("|");

      return {
        output: {
          spotifyArtist,
          spotifyTitle,
          spotifyAlbum,
          spotifyArtwork,
          playback,
          spotifyDuration
        }
      };
    default:
      return prev;
  }
};

export const render = ({ output, error }) => {
  if (error) {
    return (
      <Error>
        Something went wrong: <strong>{String(error)}</strong>
      </Error>
    );
  }

  const {
    spotifyArtist,
    spotifyTitle,
    spotifyAlbum,
    spotifyArtwork,
    playback,
    spotifyDuration
  } = output;

  if (spotifyArtist && spotifyTitle && spotifyAlbum && spotifyArtwork) {
    return (
      <Spotify className={visible}>
        <SpotifyIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
          <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
        </SpotifyIcon>
        <Artwork src={spotifyArtwork} alt="" />
        <TrackInfo>
          <span className={title}>{spotifyTitle}</span>
          <span className={artist}>{spotifyArtist}</span>
          <span className={album}>{spotifyAlbum}</span>
          <PlaybackBar>
            <Fill
              style={{
                width: `${(playback / spotifyDuration) * 100000}%`
              }}
            />
          </PlaybackBar>
        </TrackInfo>
      </Spotify>
    );
  } else return <Spotify />;
};

export const className = css`
  font-family: -apple-system, Helvetica Neue;
  font-size: 12px;
  left: 0;
  bottom: 0;
`;

export const Error = styled("div")`
  font-size: 1rem;
  color: #fff;
  background: red;
  padding: 1rem;
`;

export const Spotify = styled("div")`
  font-size: 1rem;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0.25rem;
  color: #fff;
  display: flex;
  align-items: center;
  min-width: 300px;
  opacity: 0;
  transition: 2s ease all;
`;

export const SpotifyIcon = styled("svg")`
  color: hsla(141, 74%, 42%, 1);
  fill: currentColor;
  height: 1rem;
  position: absolute;
  left: -0.25em;
  bottom: -0.25em;
  background: black;
  border-radius: 100%;
  box-shadow: -1px 0 0 2px black;
  display: none;
`;

export const visible = css`
  opacity: 1;
  transition: 2s ease all;
`;

export const title = css`
  display: block;
  font-size: 1rem;
  font-weight: 600;
`;

export const artist = css`
  display: block;
  opacity: 0.75;
  font-size: 0.875rem;
`;

export const album = css`
  display: block;
  opacity: 0.5;
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

export const Artwork = styled("img")`
  width: 90px;
  border-radius: 8px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.12);
  margin-right: 0.5rem;
`;

export const TrackInfo = styled("div")`
  display: block;
  line-height: 1.5;
  letter-spacing: 0.0125em;
`;

export const PlaybackBar = styled("div")`
  display: block;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  margin-top: 0.5rem;
  border-radius: 4px;
  overflow: hidden;
`;

export const Fill = styled("div")`
  display: block;
  height: 100%;
  background: hsla(141, 74%, 42%, 1);
  position: absolute;
  left: 0;
  top: 0;
  transition: 0.25s ease all;
  border-radius: 0 4px 4px 0;
`;
