import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserWatchlist } from '../services/firestoreService';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { User, Star, LogOut, Film, MessageSquare } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format Tanggal
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          // 1. Ambil Watchlist
          const watchlistData = await getUserWatchlist(currentUser.uid);
          setWatchlist(watchlistData);

          // 2. Ambil Review User Ini (Query ke collection 'reviews' where author == email)
          const q = query(
            collection(db, "reviews"), 
            where("author", "==", currentUser.email)
            // Note: Jika ingin orderBy created_at, perlu buat index di firebase console. 
            // Untuk sekarang kita sort manual di javascript saja biar cepat.
          );
          
          const querySnapshot = await getDocs(q);
          const reviewsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Sort review dari yang terbaru
          reviewsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setMyReviews(reviewsData);

        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        {/* --- HEADER PROFILE --- */}
        <div className="profile-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Avatar" 
            className="profile-avatar-large"
          />
          <div className="profile-info-text">
            <h1>{currentUser.email}</h1>
            <p className="profile-join-date">Member since {formatDate(currentUser.metadata.creationTime)}</p>
            
            <div className="profile-stats">
                <div className="stat-box">
                    <Film size={18} /> 
                    <span>{watchlist.length} Watchlist</span>
                </div>
                <div className="stat-box">
                    <MessageSquare size={18} /> 
                    <span>{myReviews.length} Reviews</span>
                </div>
            </div>

            <button onClick={handleLogout} className="btn-logout-small">
               <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="profile-content">
            
            {/* --- SECTION 1: WATCHLIST PREVIEW --- */}
            <div className="content-section">
                <div className="section-header">
                    <h3>My Watchlist</h3>
                    <Link to="/watchlist" className="see-all-link">See All</Link>
                </div>
                
                {watchlist.length > 0 ? (
                    <div className="mini-watchlist-grid">
                        {watchlist.slice(0, 5).map(item => (
                            <Link key={item.movieId} to={`/drama/${item.movieId}`} className="mini-poster-card">
                                <img 
                                    src={item.posterPath ? `https://image.tmdb.org/t/p/w200${item.posterPath}` : 'https://via.placeholder.com/150'} 
                                    alt={item.title} 
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="empty-text">Belum ada drama yang disimpan.</p>
                )}
            </div>

            <div className="divider"></div>

            {/* --- SECTION 2: REVIEWS HISTORY --- */}
            <div className="content-section">
                <h3>My Reviews History</h3>
                
                <div className="reviews-history-list">
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : myReviews.length > 0 ? (
                        myReviews.map(review => (
                            <div key={review.id} className="review-history-card">
                                <div className="rh-header">
                                    {/* Karena kita tidak simpan judul film di review sebelumnya, kita tampilkan ID atau link */}
                                    <span className="rh-date">{formatDate(review.created_at)}</span>
                                    <div className="rh-rating">
                                        <Star size={14} fill="#e50914" stroke="#e50914"/> 
                                        {review.author_details?.rating || '-'} / 10
                                    </div>
                                </div>
                                <p className="rh-content">"{review.content}"</p>
                                <Link to={`/drama/${review.dramaId}`} className="rh-link">
                                    Lihat Drama &rarr;
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">Kamu belum pernah menulis review.</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;