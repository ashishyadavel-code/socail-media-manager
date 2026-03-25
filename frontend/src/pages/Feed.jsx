import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Heart, MessageCircle, Send } from 'lucide-react';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/content/posts/');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Feed...</div>;

  return (
    <div className="feed-container animate-fade-in">
      <div className="stories-bar glass-panel">
        <div className="story-circle create-story">
          <span className="plus-icon">+</span>
        </div>
        {/* Placeholder for stories */}
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">No posts yet. Follow some people!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card glass-panel">
              <div 
                className="post-header" 
                onClick={() => post.user && navigate(`/profile/${post.user.id}`)}
                title={`View ${post.user?.username || 'user'}'s profile`}
              >
                <div className="avatar">
                  {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="post-user-info">
                  <h4>{post.user?.username || 'Unknown User'}</h4>
                  <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {post.image && (
                <div className="post-media">
                  <img src={post.image} alt="Post content" />
                </div>
              )}
              {post.video && (
                <div className="post-media">
                  <video src={post.video} controls />
                </div>
              )}
              
              <div className="post-actions">
                <button className="action-btn"><Heart size={24} /></button>
                <button className="action-btn"><MessageCircle size={24} /></button>
                <button className="action-btn"><Send size={24} /></button>
              </div>
              
              <div className="post-content">
                <p>
                  <strong 
                    className="clickable-username"
                    onClick={() => post.user && navigate(`/profile/${post.user.id}`)}
                    title={`View ${post.user?.username || 'user'}'s profile`}
                  >
                    {post.user?.username}
                  </strong> {post.caption}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
