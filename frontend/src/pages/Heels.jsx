import React, { useRef, useState, useEffect } from 'react';
import { api, getMediaUrl } from '../api';
import './Heels.css';

const Heels = () => {
  const [heels, setHeels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeels();
  }, []);

  const fetchHeels = async () => {
    try {
      const res = await api.get('/content/heels/');
      setHeels(res.data);
    } catch (err) {
      console.error('Failed to fetch heels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && heels.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.play().catch(err => console.log('Auto-play blocked:', err));
            } else {
              entry.target.pause();
            }
          });
        },
        { threshold: 0.6 }
      );

      const videos = document.querySelectorAll('.heels-video');
      videos.forEach((video) => observer.observe(video));

      return () => {
        observer.disconnect();
      };
    }
  }, [loading, heels]);

  if (loading) return <div className="loading" style={{color: '#0ff', textAlign: 'center', marginTop: '20px'}}>Loading SYS_HEELS...</div>;

  return (
    <div className="heels-container animate-fade-in">
      <h2 style={{color: '#0ff', fontFamily: 'monospace', textAlign: 'center', marginBottom: '15px', textShadow: '0 0 10px #0ff'}}>HEELS_FEED.sys</h2>
      
      <div className="heels-feed">
        {heels.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888'}}>No heels found. Upload one!</p>
        ) : (
          heels.map((heel, i) => (
            <div key={heel.id || i} className="heel-video-container">
              <video 
                src={getMediaUrl(heel.video)}
                autoPlay={i === 0}
                loop 
                playsInline 
                controls 
                className="heels-video" 
              />
              <div className="heels-overlay">
                <div style={{ marginBottom: '10px', textShadow: '0 0 5px black' }}>
                  <strong>@{heel.user?.username}</strong>
                  <p>{heel.caption}</p>
                </div>
                <button className="heels-action-btn" title="Like">❤</button>
                <button className="heels-action-btn" title="Comment">💬</button>
                <button className="heels-action-btn" title="Share">↗</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Heels;
