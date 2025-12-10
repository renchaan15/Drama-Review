import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
// 1. Tambahkan import Icon Check dan Plus
import { Play, Star, Send, Plus, Check } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase'; 
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 
// 2. Import service watchlist
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from '../services/firestoreService';
import './DramaDetail.css';

const DramaDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth(); 

  const [drama, setDrama] = useState(null);
  const [cast, setCast] = useState([]);
  
  // State Trailer & Review
  const [trailerKey, setTrailerKey] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [userReview, setUserReview] = useState(""); 
  const [userRating, setUserRating] = useState(10); 

  // 3. State baru untuk status Watchlist
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const API_KEY = '2137a2f6435a1fc23b24c33c73038047';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // --- AMBIL DATA DARI TMDB API ---
        const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits,reviews,videos`;
        const response = await fetch(url);
        let data = await response.json();
        
        if (data.success === false) {
           const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,reviews,videos`;
           const movieRes = await fetch(movieUrl);
           data = await movieRes.json();
        }

        setDrama(data);
        setCast(data.credits?.cast?.slice(0, 10) || []);
        
        const videos = data.videos?.results || [];
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailerKey(trailer ? trailer.key : videos[0]?.key);

        const apiReviews = data.reviews?.results || [];

        // --- AMBIL REVIEW DARI FIREBASE ---
        const q = query(
            collection(db, "reviews"), 
            where("dramaId", "==", id)
        );
        const querySnapshot = await getDocs(q);
        const firebaseReviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setReviews([...firebaseReviews, ...apiReviews]);

        // --- 4. CEK APAKAH SUDAH ADA DI WATCHLIST ---
        if (currentUser) {
            // Ambil seluruh watchlist user untuk dicek
            // (Idealnya buat fungsi khusus cek satu ID di service, tapi ini cara cepat)
            const myWatchlist = await getUserWatchlist(currentUser.uid);
            const found = myWatchlist.find(item => item.movieId.toString() === id.toString());
            setIsInWatchlist(!!found); // true jika ketemu, false jika tidak
        }

      } catch (error) {
        console.error("Gagal ambil detail:", error);
      }
    };
    
    fetchDetail();
  }, [id, currentUser]); // Tambahkan currentUser ke dependency

  // --- 5. FUNGSI HANDLE TOMBOL WATCHLIST ---
  const handleWatchlistToggle = async () => {
    if (!currentUser) {
        alert("Silakan login untuk menyimpan ke daftar tontonan.");
        return;
    }

    setWatchlistLoading(true);

    if (isInWatchlist) {
        // Jika sudah ada, Hapus
        const success = await removeFromWatchlist(currentUser.uid, drama.id);
        if (success) setIsInWatchlist(false);
    } else {
        // Jika belum ada, Tambah
        const movieData = {
            movieId: drama.id,
            title: drama.name || drama.title,
            posterPath: drama.poster_path,
            voteAverage: drama.vote_average
        };
        const success = await addToWatchlist(currentUser.uid, movieData);
        if (success) setIsInWatchlist(true);
    }
    setWatchlistLoading(false);
  };

  // --- FUNGSI KIRIM REVIEW ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu untuk menulis review!");
      return;
    }
    if (!userReview.trim()) return;

    const newReviewData = {
      dramaId: id,
      author: currentUser.email,
      content: userReview,
      created_at: new Date().toISOString(),
      author_details: { rating: parseInt(userRating) }
    };

    try {
        const docRef = await addDoc(collection(db, "reviews"), newReviewData);
        const newReviewWithId = { id: docRef.id, ...newReviewData };
        setReviews([newReviewWithId, ...reviews]); 
        setUserReview(""); 
        alert("Review berhasil disimpan!");
    } catch (error) {
        console.error("Error adding review: ", error);
    }
  };

  if (!drama) return <div className="loading">Loading...</div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${drama.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${drama.poster_path}`;

  return (
    <div className="detail-page">
      <Navbar />
      
      <div 
        className="detail-header" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="detail-header-overlay"></div>
      </div>

      <div className="detail-content">
        <div className="info-flex">
            <div className="poster-card">
                <img src={posterUrl} alt={drama.name || drama.title} />
            </div>

            <div className="title-info">
                <h1>{drama.name || drama.title}</h1>
                <div className="genres">
                    {drama.genres?.map(g => (
                        <span key={g.id} className="genre-tag">{g.name}</span>
                    ))}
                </div>
                <div className="meta-data">
                    <span className="rating">⭐ {drama.vote_average?.toFixed(1)}/10</span>
                    <span> | {drama.first_air_date ? drama.first_air_date.split('-')[0] : drama.release_date?.split('-')[0]}</span>
                </div>
                
                <div className="action-bar" style={{marginTop: '20px'}}>
                    
                    {/* --- 6. TOMBOL WATCHLIST YANG SUDAH BERFUNGSI --- */}
                    <button 
                        className={`btn-primary ${isInWatchlist ? 'btn-saved' : ''}`}
                        onClick={handleWatchlistToggle}
                        disabled={watchlistLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {watchlistLoading ? (
                            "Processing..."
                        ) : isInWatchlist ? (
                            <> <Check size={18} /> Saved </>
                        ) : (
                            <> <Plus size={18} /> Add to Watchlist </>
                        )}
                    </button>

                    {trailerKey && (
                      <a href="#trailer-section" className="btn-secondary" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px'}}>
                         <Play size={16} fill="currentColor" /> Watch Trailer
                      </a>
                    )}
                </div>
            </div>
        </div>

        <div className="section">
            <h3>Synopsis</h3>
            <p className="overview">{drama.overview}</p>
        </div>

        <div className="section">
            <h3>Cast & Characters</h3>
            <div className="cast-list">
                {cast.map(actor => (
                    <div key={actor.id} className="cast-card">
                        <img 
                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/100x150"} 
                            alt={actor.name} 
                        />
                        <p className="actor-name">{actor.name}</p>
                        <p className="character-name">{actor.character}</p>
                    </div>
                ))}
            </div>
        </div>

        {trailerKey && (
          <div className="section" id="trailer-section">
            <h3>Official Trailer</h3>
            <div className="video-responsive">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="section">
            <h3>Reviews ({reviews.length})</h3>
            <div className="review-form-card">
              <h4>Write a Review</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Your Rating: </label>
                  <select 
                    value={userRating} 
                    onChange={(e) => setUserRating(e.target.value)}
                    className="rating-select"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} ⭐</option>
                    ))}
                  </select>
                </div>
                <textarea 
                  placeholder={currentUser ? `Write your thoughts as ${currentUser.email}...` : "Please login to review"}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows="3"
                  className="review-textarea"
                  disabled={!currentUser}
                />
                <button 
                  type="submit" 
                  className="btn-submit-review"
                  style={{ opacity: currentUser ? 1 : 0.5, cursor: currentUser ? 'pointer' : 'not-allowed' }}
                >
                  <Send size={16} /> Post Review
                </button>
              </form>
            </div>

            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name" style={{ color: rev.dramaId ? '#e50914' : 'inherit', fontWeight: rev.dramaId ? 'bold' : 'normal' }}>
                        {rev.author} {rev.dramaId && "(App User)"}
                      </span>
                      <span className="reviewer-rating">
                        <Star size={14} fill="#e50914" stroke="#e50914" /> 
                        {rev.author_details?.rating ? rev.author_details.rating : '-'} / 10
                      </span>
                    </div>
                    <p className="review-content">
                      {rev.content.length > 400 
                        ? rev.content.substring(0, 400) + "..." 
                        : rev.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">No reviews yet. Be the first to write one!</p>
              )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DramaDetail;