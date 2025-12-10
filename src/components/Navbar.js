import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [showBlack, setShowBlack] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // State untuk input search

  const { currentUser, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBlack(true);
      } else {
        setShowBlack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIKA UTAMA SEARCH ---
  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Jika ada kata kunci, pindah ke halaman search
    if (searchInput.trim()) {
      navigate(`/search?q=${searchInput}`);
    } else {
      // Jika input dikosongkan, kembali ke Home
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false); 
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className={`nav ${showBlack && "nav-black"}`}>
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          DRAMAFLIX
        </Link>
        <ul className="nav-links-primary">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/series">Series</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          {currentUser && <li><Link to="/watchlist">My List</Link></li>}
        </ul>
      </div>

      <div className="nav-right">
        
        {/* --- SEARCH BAR DI NAVBAR --- */}
        <form onSubmit={handleSearch} className="search-box">
            <button type="submit">
              <Search color="white" size={20} />
            </button>
            
            <input 
              type="text"
              placeholder="Titles, people, genres"
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
        </form>

        <Bell className="icon" size={20} style={{ marginLeft: '15px' }} />
        
        {currentUser ? (
          <div className="profile-menu">
            <div 
              className="profile-trigger" 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                alt="Avatar" 
                className="nav-avatar"
              />
              <ChevronDown size={16} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
            </div>

            {showDropdown && (
              <div className="dropdown-content">
                <div className="dropdown-item info">
                  Logged in as: <br/>
                  <strong style={{fontSize: '12px'}}>{currentUser.email}</strong>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" style={{textDecoration: 'none'}}>
                    <User size={16} /> Profile
                </Link>
                <div className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <LogOut size={16} /> Sign out
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-signin-btn">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;