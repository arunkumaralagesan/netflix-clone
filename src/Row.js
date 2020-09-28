import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieName, setMovieName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(`${fetchUrl}&page=${page}`);
      setMovies([...movies, ...request.data.results]);
      return request;
    };
    fetchData();
  }, [fetchUrl, page]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
      setMovieName("");
    } else {
      movieTrailer(
        movie?.name ||
          movie?.title ||
          movie?.original_title ||
          movie?.original_name
      )
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setMovieName(
            movie?.name ||
              movie?.title ||
              movie?.original_title ||
              movie?.original_name
          );
        })
        .catch((e) => console.log(e));
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className={`row__posters ${title}`}>
        {movies?.map((movie) => {
          return (
            <div className="row__poster__wrapper">
              <img
                key={movie.id}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                onClick={() => handleClick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              />
              <p>
                {truncate(
                  movie?.name ||
                    movie?.title ||
                    movie?.original_title ||
                    movie?.original_name,
                  20
                )}
              </p>
            </div>
          );
        })}
        <div className="row__fetch__next" onClick={() => setPage(page + 1)}>
          +
        </div>
      </div>
      {trailerUrl && (
        <div className="trailer__wrapper">
          {" "}
          <YouTube videoId={trailerUrl} opts={opts} />
          <button className="watch__button">
            <a
              target="_blank"
              href={`https://www.yts.mx/browse-movies/${movieName}`}
            >
              Watch
            </a>
          </button>
        </div>
      )}
    </div>
  );
}

export default Row;
