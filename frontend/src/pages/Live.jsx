import React, { useRef, useState, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Play } from 'lucide-react';
import './Live.css';

const Live = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Initialize camera stream
  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Could not access camera or microphone. Please check permissions.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleGoLive = () => {
    if (!stream) {
      startStream();
    }
    setIsLive(true);
  };

  const handleEndLive = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setIsLive(false);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="live-container fade-in">
      <div className="live-header">
        <h1 className="live-title">{isLive ? "Live Now" : "Live Studio"}</h1>
        {isLive && <div className="live-badge pulse">LIVE</div>}
      </div>

      <div className="live-content glass-panel">
        <div className="video-wrapper">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted /* Mute local playback to avoid echo */
            className={`live-video ${!stream ? 'hidden' : ''}`}
          />
          {!stream && (
            <div className="camera-placeholder">
              <Camera size={64} className="placeholder-icon" />
              <p>Camera is off</p>
            </div>
          )}
          
          {isLive && (
            <div className="live-stats">
              <span>👁 0 Viewers</span>
              <span>00:00:00</span>
            </div>
          )}
        </div>

        <div className="live-controls">
          <div className="media-controls">
            <button 
              className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`} 
              onClick={toggleAudio}
              disabled={!stream && !isLive}
              title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button 
              className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`} 
              onClick={toggleVideo}
              disabled={!stream && !isLive}
              title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
            >
              {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
          </div>

          <div className="broadcast-controls">
            {!isLive ? (
              <button className="btn-primary go-live-btn" onClick={handleGoLive}>
                <Play size={20} /> Start Live Setup
              </button>
            ) : (
              <button className="btn-danger end-live-btn" onClick={handleEndLive}>
                End Live
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
