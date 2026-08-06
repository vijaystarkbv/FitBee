import React, { useEffect, useRef, useState } from 'react';
import { getExerciseVideoUrl } from '../../../data/exerciseVideoRegistry';

interface ExerciseVideoPlayerProps {
  exerciseName: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  exerciseName,
  primaryMuscles = [],
  secondaryMuscles = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Load Video URL based on Exercise Name
  useEffect(() => {
    const url = getExerciseVideoUrl(exerciseName);
    setVideoUrl(url);
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(true);
  }, [exerciseName]);

  // Sync Video Speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const selectSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const primaryLabel = primaryMuscles.length > 0 ? primaryMuscles.join(', ') : 'None';
  const secondaryLabel = secondaryMuscles.length > 0 ? secondaryMuscles.join(', ') : 'None';

  return (
    <div className="fitbee-3d-wrapper">
      <div
        ref={containerRef}
        className="fitbee-3d-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          backgroundColor: '#000000',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {videoUrl && !hasError ? (
          <>
            {/* HTML5 Video Player */}
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                setIsLoading(false);
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                  videoRef.current.playbackRate = playbackSpeed;
                }
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              onClick={togglePlay}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                cursor: 'pointer',
              }}
            />

            {/* Loading Spinner */}
            {isLoading && (
              <div className="fitbee-3d-loading">
                <div className="fitbee-spinner" />
                <span>Loading Exercise Demonstration Video...</span>
              </div>
            )}

            {/* TOP-RIGHT CONTROLS OVERLAY (Pause, Speed, Mute, Fullscreen) */}
            <div className="fitbee-3d-controls-overlay">
              {/* Pause / Play Button */}
              <button
                className="fitbee-ctrl-btn"
                onClick={togglePlay}
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? (
                  <>
                    <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Speed Selector */}
              <div className="fitbee-speed-wrapper">
                <button
                  className="fitbee-ctrl-btn"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  title="Change Speed"
                >
                  <span>{playbackSpeed}×</span>
                  <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Speed Dropdown Menu */}
                {showSpeedMenu && (
                  <div className="fitbee-speed-menu">
                    {[0.5, 0.75, 1.0, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        className={`fitbee-speed-option ${playbackSpeed === speed ? 'active' : ''}`}
                        onClick={() => selectSpeed(speed)}
                      >
                        {speed}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mute / Unmute Button */}
              <button
                className="fitbee-ctrl-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9L5 13H1v-2h4l4 4z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ) : (
                  <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                className="fitbee-ctrl-btn"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>

            {/* BOTTOM TIMELINE SEEKBAR OVERLAY */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px 16px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 10,
              }}
            >
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  accentColor: '#5C8D89',
                  cursor: 'pointer',
                  height: '4px',
                }}
              />
              <span style={{ color: '#E0E0E0', fontSize: '12px', fontFamily: 'monospace', minWidth: '70px', textAlign: 'right' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </>
        ) : (
          /* FALLBACK UI IF VIDEO NOT YET UPLOADED */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#8E8E96',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>Video Demonstration Coming Soon</h3>
            <p style={{ fontSize: '13px', color: '#A0A0AA', maxWidth: '320px' }}>
              High-definition demonstration video for <strong style={{ color: '#5C8D89' }}>{exerciseName}</strong> is currently being formatted.
            </p>
          </div>
        )}
      </div>

      {/* Legend Bar Below Player */}
      <div className="fitbee-legend-bar">
        <div className="fitbee-legend-item">
          <span className="fitbee-legend-dot primary" />
          <span className="fitbee-legend-label">Primary Target ({primaryLabel})</span>
        </div>
        <div className="fitbee-legend-item">
          <span className="fitbee-legend-dot secondary" />
          <span className="fitbee-legend-label">Secondary Target ({secondaryLabel})</span>
        </div>
      </div>
    </div>
  );
};
