import React, { useState } from 'react';
import { api } from '../api';
import { Search as SearchIcon, User as UserIcon, Image as ImageIcon } from 'lucide-react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        api.get(`/users/list/?search=${query}`),
        api.get(`/content/posts/?search=${query}`)
      ]);
      
      setResults({
        users: usersRes.data,
        posts: postsRes.data
      });
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container animate-fade-in">
      <div className="glass-panel search-box">
        <form onSubmit={handleSearch} className="search-form">
          <SearchIcon className="search-icon" size={20} />
          <input 
            type="text" 
            className="input-field search-input" 
            placeholder="Search for users or posts..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
        </form>
      </div>

      <div className="search-results">
        <div className="results-section">
          <h3><UserIcon size={20}/> Users</h3>
          <div className="results-grid">
            {results.users.map(u => (
              <div key={u.id} className="glass-panel user-card">
                <div className="user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                <div>{u.username}</div>
              </div>
            ))}
            {results.users.length === 0 && !loading && query && <p className="text-secondary">No users found.</p>}
          </div>
        </div>

        <div className="results-section mt-4">
          <h3><ImageIcon size={20}/> Posts</h3>
          <div className="results-grid">
            {results.posts.map(p => (
              <div key={p.id} className="glass-panel post-card-small">
                {p.image ? (
                  <img src={p.image} alt="post" />
                ) : (
                  <div className="text-content">"{p.caption}"</div>
                )}
                <div className="post-author">By: {p.user?.username}</div>
              </div>
            ))}
            {results.posts.length === 0 && !loading && query && <p className="text-secondary">No posts found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
