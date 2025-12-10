import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Import CSS baru

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Failed to log in. Please check your email/password.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrapper">
      {/* Logo opsional, memberi kesan aplikasi mandiri */}
      <Link to="/" className="auth-logo">DRAMAFLIX</Link>

      <div className="auth-box">
        <h2>Sign In</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="auth-input"
              type="email" 
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              className="auth-input"
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button disabled={loading} type="submit" className="auth-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          New to DramaFlix? 
          <Link to="/register" className="auth-link">Sign up now.</Link>
        </div>
      </div>
    </div>
  );
}