import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { XCircle } from 'lucide-react'; // Ikon silang untuk hapus
import { useNavigate } from 'react-router-dom';
import './Watchlist.css'; // Kita buat CSS-nya nanti

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 1. Ambil Data Realtime dari Firestore
  useEffect(() => {
    if (currentUser) {
      // Dengar perubahan data di dokumen user
      const unsubscribe = onSnapshot(doc(db, 'users', currentUser.email), (doc) => {
        if (doc.exists()) {
          setMovies(doc.data().savedShows || []);
        }
      });
      return unsubscribe; // Bersihkan listener saat komponen ditutup
    }
  }, [currentUser]);

  // 2. Fungsi Hapus Film
  const deleteShow = async (passedID) => {
    try {
      const result = movies.filter((item) => item.id !== passedID);
      await updateDoc(doc(db, 'users', currentUser.email), {
        savedShows: result,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) {
    return <div className="watchlist-page">Please log in first.</div>;
  }

  return (
    <div className="watchlist-page">
      <h1 className="watchlist-title">My List</h1>

      <div className="watchlist-grid">
        {movies.length === 0 ? (
          <p>Belum ada film yang disimpan.</p>
        ) : (
          movies.map((item) => (
            <div key={item.id} className="watchlist-card">
              
              <img
                onClick={() => navigate(`/drama/${item.id}`)}
                src={`https://image.tmdb.org/t/p/w500${item.img || item.poster_path}`}
                alt={item.title}
                className="watchlist-img"
              />
              
              <div className="watchlist-overlay">
                <p onClick={() => navigate(`/drama/${item.id}`)} className="watchlist-text">
                    {item.title}
                </p>
                <XCircle 
                    onClick={() => deleteShow(item.id)} 
                    className="watchlist-remove" 
                    size={24} 
                />
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Watchlist;