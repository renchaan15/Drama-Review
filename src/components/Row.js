import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Row.css';

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // Hook navigasi
  const API_KEY = '2137a2f6435a1fc23b24c33c73038047'; 
  const BASE_URL = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      const fullUrl = `https://api.themoviedb.org/3${fetchUrl}&api_key=${API_KEY}`;
      try {
        const request = await fetch(fullUrl);
        const data = await request.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Handler klik
  const handleClick = (movie) => {
    navigate(`/drama/${movie.id}`);
  };

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          ((isLargeRow && movie.poster_path) ||
          (!isLargeRow && movie.backdrop_path)) && (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)} // Tambahkan event klik
              className={`row-poster ${isLargeRow && "row-posterLarge"}`}
              src={`${BASE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.name}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Row;