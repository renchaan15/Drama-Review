import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import './SearchPage.css';
import Row from '../components/Row';
import Banner from '../components/Banner';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Ambil query dari URL (dikirim oleh Navbar)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const API_KEY = '2137a2f6435a1fc23b24c33c73038047'; 
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleResultClick = (id) => {
    navigate(`/drama/${id}`);
  };

  return (
    <div className="search-page">
      
      {/* LOGIKA TAMPILAN DINAMIS:
          Jika ada 'query' (User sedang mencari), TAMPILKAN HASIL SAJA.
          Jika TIDAK ada 'query' (Mode Home), TAMPILKAN BANNER & ROW.
      */}

      {query ? (
        // --- MODE PENCARIAN (Banner Disembunyikan) ---
        <div className="results-grid-container" style={{ paddingTop: '100px', paddingLeft:'40px', paddingRight:'40px' }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              Results for: "{query}"
            </h2>
            
            {loading && <p className="status-text">Searching...</p>}
            
            <div className="results-grid">
            {results
                .filter(item => item.poster_path)
                .map((item) => (
                <div 
                    key={item.id} 
                    className="movie-card"
                    onClick={() => handleResultClick(item.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                        alt={item.title || item.name}
                        className="card-img"
                    />
                </div>
            ))}
            </div>
            
            {!loading && results.length === 0 && (
                <p className="status-text">No results found for "{query}"</p>
            )}
        </div>

      ) : (
        // --- MODE HOME (Tampilan Awal / Default) ---
        <>
          <Banner />
          
          <div className="home-rows" style={{ position: 'relative', zIndex: 10, marginTop: '-120px' }}>
              <Row title="Netflix Originals" fetchUrl="/discover/tv?with_networks=213" isLargeRow />
              <Row title="Trending Now" fetchUrl="/trending/all/week?" />
              <Row title="Top Rated" fetchUrl="/movie/top_rated?" />
              <Row title="Action Movies" fetchUrl="/discover/movie?with_genres=28" />
              <Row title="Comedy Movies" fetchUrl="/discover/movie?with_genres=35" />
              <Row title="Horror Movies" fetchUrl="/discover/movie?with_genres=27" />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;