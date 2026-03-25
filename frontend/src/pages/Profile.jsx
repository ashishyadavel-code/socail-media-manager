import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Grid, Film, Bookmark, Settings, MoreHorizontal } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('POSTS'); // POSTS, HEELS, SAVED

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const endpoint = id ? `/users/${id}/profile/` : '/users/profile/';
      const res = await api.get(endpoint);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (profile.is_following) {
        await api.post(`/users/${id}/unfollow/`);
        setProfile({ ...profile, is_following: false, followers_count: profile.followers_count - 1 });
      } else {
        await api.post(`/users/${id}/follow/`);
        setProfile({ ...profile, is_following: true, followers_count: profile.followers_count + 1 });
      }
    } catch (e) {
      alert("Error toggling follow status");
      console.error(e);
    }
  };

  if (loading) return <div className="text-center mt-5" style={{ color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!profile) return <div className="text-center mt-5" style={{ color: 'var(--text-secondary)' }}>User not found.</div>;

  const isOwnProfile = !id;

  return (
    <div className="profile-page animate-fade-in">
      <header className="profile-header-ig">
        <div className="profile-avatar-container">
          <div className="profile-avatar-ig">
            <div className="profile-avatar-inner">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <section className="profile-info-ig">
          <div className="profile-title-row">
            <h2 className="profile-username-ig">{profile.username}</h2>
            <div className="profile-actions-ig">
              {isOwnProfile ? (
                <>
                  <button className="btn-ig">Edit profile</button>
                  <button className="btn-ig">View archive</button>
                  <button className="btn-ig" style={{ background: 'transparent' }}><Settings size={28} /></button>
                </>
              ) : (
                <>
                  <button
                    className={`btn-ig ${!profile.is_following ? 'btn-ig-primary' : ''}`}
                    onClick={handleFollowToggle}
                  >
                    {profile.is_following ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn-ig">Message</button>
                  <button className="btn-ig" style={{ background: 'transparent' }}><MoreHorizontal size={24} /></button>
                </>
              )}
            </div>
          </div>

          <ul className="profile-stats-ig">
            <li className="stat-ig"><span>{profile.posts_count || 0}</span> posts</li>
            <li className="stat-ig"><span>{profile.followers_count || 0}</span> followers</li>
            <li className="stat-ig"><span>{profile.following_count || 0}</span> following</li>
          </ul>

          <div className="profile-bio-ig">
            <div className="profile-bio-name">{profile.first_name ? `${profile.first_name} ${profile.last_name || ''}` : profile.username}</div>
            {profile.bio && <div style={{ whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{profile.bio}</div>}
          </div>
        </section>
      </header>

      <div className="profile-tabs-ig">
        <div className={`tab-ig ${activeTab === 'POSTS' ? 'active' : ''}`} onClick={() => setActiveTab('POSTS')}>
          <Grid /> <span>POSTS</span>
        </div>
        <div className={`tab-ig ${activeTab === 'HEELS' ? 'active' : ''}`} onClick={() => setActiveTab('HEELS')}>
          <Film /> <span>HEELS</span>
        </div>
        {isOwnProfile && (
          <div className={`tab-ig ${activeTab === 'SAVED' ? 'active' : ''}`} onClick={() => setActiveTab('SAVED')}>
            <Bookmark /> <span>SAVED</span>
          </div>
        )}
      </div>

      <div className="profile-grid-ig">
        {/* Placeholder grid items representing posts */}
        {[...Array(9)].map((_, i) => (
          <div key={i} className="grid-item-ig" onClick={() => navigate(activeTab === 'HEELS' ? '/heels' : '/')}>
            <div className="grid-item-placeholder">
              {activeTab === 'HEELS' ? <Film size={32} opacity={0.3} /> : <Grid size={32} opacity={0.3} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
