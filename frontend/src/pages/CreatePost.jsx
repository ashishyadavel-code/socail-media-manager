import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { UploadCloud } from 'lucide-react';
import './CreatePost.css';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [postType, setPostType] = useState('post'); // 'post' or 'heels'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (postType === 'heels' && files.length > 0) {
      const invalidFiles = files.filter(f => !f.type.startsWith('video/'));
      if (invalidFiles.length > 0) {
        alert('Please upload valid video files for Heels.');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const endpoint = postType === 'heels' ? '/content/heels/' : '/content/posts/';
      
      if (files.length > 0) {
        // Upload each file (multiple for heels or just one post if postType is post)
        for (const file of files) {
          const formData = new FormData();
          formData.append('caption', caption);
          if (file.type.startsWith('video/')) {
            formData.append('video', file);
          } else {
            formData.append('image', file);
          }
          await api.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Text-only post
        const formData = new FormData();
        formData.append('caption', caption);
        await api.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate(postType === 'heels' ? '/heels' : '/');
    } catch (err) {
      console.error('Failed to upload', err);
      alert('Failed to upload! Ensure your backend server is running and check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container animate-fade-in">
      <div className="glass-panel form-box">
        <h2 style={{ marginBottom: '15px' }}>
          Create New {postType === 'post' ? 'Post' : 'Heels Video'}
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            className={`btn ${postType === 'post' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => { setPostType('post'); setFiles([]); }}
            style={{ flex: 1 }}
          >
            📷 Normal Post
          </button>
          <button 
            type="button" 
            className={`btn ${postType === 'heels' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => { setPostType('heels'); setFiles([]); }}
            style={{ flex: 1 }}
          >
            🎥 Heels Video
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <textarea 
            className="input-field text-caption" 
            placeholder={postType === 'heels' ? "Describe your Heels video..." : "Write a caption..."} 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="4"
          />
          
          <div className="upload-area">
            <input 
              type="file" 
              id="file-upload" 
              multiple={postType === 'heels'}
              accept={postType === 'heels' ? "video/*" : "image/*,video/*"}
              onChange={handleFileChange}
              style={{display: 'none'}}
            />
            <label htmlFor="file-upload" className="upload-label glass-panel" style={{ padding: files.length > 0 ? '10px' : '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {files.length > 0 ? (
                <>
                  <div style={{fontWeight: 'bold', marginBottom: '10px'}}>
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                  </div>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {files.slice(0, 3).map((file, i) => (
                      file.type.startsWith('video/') ? (
                        <video key={i} src={URL.createObjectURL(file)} style={{maxHeight: '100px', maxWidth: '100px', borderRadius: '8px'}} />
                      ) : (
                        <img key={i} src={URL.createObjectURL(file)} alt="Preview" style={{maxHeight: '100px', maxWidth: '100px', borderRadius: '8px', objectFit: 'cover'}} />
                      )
                    ))}
                    {files.length > 3 && <span style={{display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>+{files.length - 3} more</span>}
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={48} color="var(--accent-primary)" />
                  <span style={{ marginTop: '16px' }}>
                    {postType === 'heels' ? 'Click to select multiple Videos' : 'Click to select Image or Video'}
                  </span>
                </>
              )}
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Uploading...' : (postType === 'heels' ? 'Publish Heels' : 'Share Post')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
