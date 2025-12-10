import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import Icon Check untuk status "Saved"
import { Play, Plus, Check } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';
// Import fungsi database
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from '../services/firestoreService';
import './Banner.css';

const Banner = ({ fetchUrl }) => {
  const [movie, setMovie] = useState(null);
  // State untuk status tombol My List
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const API_KEY = '2137a2f6435a1fc23b24c33c73038047'; 

  // 1. FETCH MOVIE BANNER
  useEffect(() => {
    async function fetchData() {
      const endpoint = fetchUrl || `/trending/all/week`;
      try {
        const request = await fetch(
          `https://api.themoviedb.org/3${endpoint}?api_key=${API_KEY}&language=en-US`
        );
        const data = await request.json();
        
        // Ambil 1 film random
        const randomMovie = data.results[
          Math.floor(Math.random() * data.results.length - 1)
        ];
        setMovie(randomMovie);
      } catch (error) {
        console.error("Gagal ambil banner:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // 2. CEK STATUS WATCHLIST (Setiap kali movie berubah)
  useEffect(() => {
    const checkWatchlist = async () => {
      if (currentUser && movie) {
        const myList = await getUserWatchlist(currentUser.uid);
        // Cek apakah ID film banner ada di list user
        const found = myList.find(item => item.movieId.toString() === movie.id.toString());
        setIsInWatchlist(!!found);
      }
    };
    checkWatchlist();
  }, [currentUser, movie]);

  // 3. FUNGSI HANDLE KLIK MY LIST
  const handleWatchlist = async () => {
    if (!currentUser) {
      alert("Please login to add to My List");
      navigate("/login");
      return;
    }

    if (!movie) return;

    setLoadingBtn(true);
    
    if (isInWatchlist) {
      // Jika sudah ada, HAPUS
      await removeFromWatchlist(currentUser.uid, movie.id);
      setIsInWatchlist(false);
    } else {
      // Jika belum ada, TAMBAH
      await addToWatchlist(currentUser.uid, {
        movieId: movie.id,
        title: movie.title || movie.name || movie.original_name,
        posterPath: movie.poster_path,
        voteAverage: movie.vote_average
      });
      setIsInWatchlist(true);
    }
    setLoadingBtn(false);
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <header 
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner-contents">
        <h1 className="banner-title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="banner-buttons">
          {/* TOMBOL 1: SEE DETAILS */}
          <button 
            className="banner-btn play-btn" 
            onClick={() => navigate(`/drama/${movie.id}`)}
          >
            {/* Menggunakan Icon Play tapi teks See Details */}
            <Play size={20} fill="black" /> See Details
          </button>

          {/* TOMBOL 2: MY LIST (SUDAH BERFUNGSI) */}
          <button 
            className="banner-btn" 
            onClick={handleWatchlist}
            disabled={loadingBtn}
          >
             {isInWatchlist ? (
               // Tampilan jika sudah disimpan
               <> <Check size={20} /> Saved </>
             ) : (
               // Tampilan jika belum disimpan
               <> <Plus size={20} /> My List </>
             )}
          </button>
        </div>

        <h1 className="banner-description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner-fadeBottom" />
    </header>
  );
}

export default Banner;