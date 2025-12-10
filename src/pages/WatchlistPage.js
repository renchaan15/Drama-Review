import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWatchlist, removeFromWatchlist } from '../services/firestoreService';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, AlertCircle } from 'lucide-react'; // Icon untuk hapus & info
import './WatchlistPage.css'; // Kita buat CSS-nya setelah ini

const WatchlistPage = () => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Ambil Data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setLoading(true);
        const data = await getUserWatchlist(currentUser.uid);
        setWatchlist(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  // 2. Fungsi Hapus
  const handleRemove = async (movieId, e) => {
    e.stopPropagation(); // Mencegah klik tembus ke gambar (supaya gak pindah halaman)
    
    if (window.confirm("Hapus drama ini dari daftar tontonan?")) {
      const success = await removeFromWatchlist(currentUser.uid, movieId);
      
      if (success) {
        // Update tampilan secara langsung (hapus item dari array state)
        setWatchlist(watchlist.filter(item => item.movieId !== movieId));
      }
    }
  };

  // 3. Jika belum login
  if (!currentUser) {
    return (
      <div className="watchlist-container empty-state">
        <AlertCircle size={48} color="#e50914" />
        <h2>Silakan Login</h2>
        <p>Anda perlu login untuk melihat daftar tontonan.</p>
        <Link to="/login" className="watchlist-btn">Login Sekarang</Link>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h1 className="page-title">Daftar Tontonan Saya</h1>

      {loading ? (
        <p className="loading-text">Memuat daftar...</p>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada drama yang disimpan.</p>
          <Link to="/" className="watchlist-btn">Cari Drama</Link>
        </div>
      ) : (
        /* GRID TAMPILAN */
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div 
              key={item.movieId} 
              className="watchlist-card"
              onClick={() => navigate(`/drama/${item.movieId}`)} // Klik kartu ke detail
            >
              <div className="img-wrapper">
                <img
                  src={item.posterPath ? `https://image.tmdb.org/t/p/w300${item.posterPath}` : 'https://via.placeholder.com/200x300'}
                  alt={item.title}
                />
                
                {/* Overlay Hitam saat Hover */}
                <div className="hover-overlay">
                  <span className="view-text">Lihat Detail</span>
                </div>
              </div>

              <div className="card-info">
                <h3>{item.title}</h3>
              </div>

              {/* Tombol Hapus (Pojok Kanan Atas) */}
              <button 
                className="delete-btn"
                onClick={(e) => handleRemove(item.movieId, e)}
                title="Hapus dari daftar"
              >
                <XCircle size={24} color="white" fill="#e50914" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;