import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Menggunakan CSS yang sama

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth(); 
  const navigate = useNavigate(); 

  async function handleSubmit(e) {
    e.preventDefault(); 

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrapper">
      <Link to="/" className="auth-logo">DRAMAFLIX</Link>

      <div className="auth-box">
        <h2>Sign Up</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="auth-input"
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              className="auth-input"
              type="password" 
              placeholder="Add a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button disabled={loading} type="submit" className="auth-button">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign in now.</Link>
        </div>
      </div>
    </div>
  );
}