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
