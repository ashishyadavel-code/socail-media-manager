import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, deletePost, toggleLike, addComment } from '../api';
import { Heart, MessageCircle, Send, Trash2, MoreHorizontal } from 'lucide-react';
import './Feed.css';

// Decode JWT and return payload fields
const decodeToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const navigate = useNavigate();

  // Grab both user_id and username from token
  const { user_id: currentUserId, username: currentUsername } = decodeToken();

  useEffect(() => {
    fetchPosts();
    const handler = () => setMenuOpen(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
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

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(postId);
    setMenuOpen(null);
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleLike = async (postId, currentLiked, currentCount) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          is_liked_by_user: !currentLiked,
          likes_count: currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        };
      }
      return p;
    }));
    try {
      await toggleLike(postId);
    } catch (err) {
      console.error('Failed to toggle like', err);
      // Revert if failed (optional, simplified here)
    }
  };

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Post link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const submitComment = async (postId) => {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await addComment(postId, commentText);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), res.data]
          };
        }
        return p;
      }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
      alert('Failed to post comment.');
    } finally {
      setCommenting(false);
    }
  };

  // Check ownership by BOTH id and username
  const isMyPost = (post) => {
    if (!post?.user) return false;
    if (currentUserId && post.user.id === currentUserId) return true;
    if (currentUsername && post.user.username === currentUsername) return true;
    return false;
  };

  if (loading) return <div className="text-center mt-5">Loading Feed...</div>;

  return (
    <div className="feed-container animate-fade-in">
      <div className="stories-bar glass-panel">
        <div className="story-circle create-story">
          <span className="plus-icon">+</span>
        </div>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">No posts yet. Follow some people!</div>
        ) : (
          posts.map(post => {
            const owner = isMyPost(post);
            const isDeleting = deleting === post.id;
            const commentsArray = post.comments || [];

            return (
              <div
                key={post.id}
                className={`post-card glass-panel${isDeleting ? ' post-deleting' : ''}`}
              >
                {/* ── Header ── */}
                <div className="post-header">
                  <div
                    className="avatar"
                    onClick={() => post.user && navigate(`/profile/${post.user.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div
                    className="post-user-info"
                    onClick={() => post.user && navigate(`/profile/${post.user.id}`)}
                    style={{ cursor: 'pointer', flex: 1 }}
                  >
                    <h4>{post.user?.username || 'Unknown User'}</h4>
                    <span className="post-time">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ── 3-dot menu ── */}
                  <div
                    className="post-menu-wrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="action-btn post-menu-btn"
                      onClick={() =>
                        setMenuOpen(prev => (prev === post.id ? null : post.id))
                      }
                      title="Post options"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuOpen === post.id && (
                      <div className="post-menu-dropdown">
                        {owner ? (
                          <button
                            className="post-menu-item delete-item"
                            onClick={() => handleDelete(post.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={15} />
                            {isDeleting ? 'Deleting…' : 'Delete Post'}
                          </button>
                        ) : (
                          <div className="post-menu-item post-menu-info">
                            Not your post
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Media ── */}
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

                {/* ── Actions ── */}
                <div className="post-actions" style={{ alignItems: 'center' }}>
                  <button 
                    className="action-btn"
                    onClick={() => handleLike(post.id, post.is_liked_by_user, post.likes_count || 0)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Heart 
                      size={24} 
                      fill={post.is_liked_by_user ? '#e05252' : 'none'} 
                      color={post.is_liked_by_user ? '#e05252' : 'currentColor'} 
                    />
                    {post.likes_count > 0 && <span style={{ fontSize: '14px', fontWeight: 500 }}>{post.likes_count}</span>}
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setActiveCommentPostId(prev => prev === post.id ? null : post.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={24} />
                    {commentsArray.length > 0 && <span style={{ fontSize: '14px', fontWeight: 500 }}>{commentsArray.length}</span>}
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleShare(post.id)}
                  >
                    <Send size={24} />
                  </button>
                </div>

                {/* ── Caption ── */}
                <div className="post-content">
                  <p>
                    <strong
                      className="clickable-username"
                      onClick={() => post.user && navigate(`/profile/${post.user.id}`)}
                    >
                      {post.user?.username}
                    </strong>{' '}
                    {post.caption}
                  </p>
                </div>

                {/* ── Comments Drawer ── */}
                {activeCommentPostId === post.id && (
                  <div className="comments-section" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
                    <div className="comments-list" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {commentsArray.length === 0 ? (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No comments yet. Be the first!</div>
                      ) : (
                        commentsArray.map(c => (
                          <div key={c.id} style={{ fontSize: '14px' }}>
                            <strong style={{ cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => c.user && navigate(`/profile/${c.user.id}`)}>
                              {c.user?.username || 'User'}
                            </strong>{' '}
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{c.content}</span>
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="input-field"
                        style={{ padding: '8px 12px', flex: 1 }}
                        onKeyDown={e => { if(e.key === 'Enter') submitComment(post.id); }}
                      />
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', borderRadius: '8px' }}
                        onClick={() => submitComment(post.id)}
                        disabled={commenting || !commentText.trim()}
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;

