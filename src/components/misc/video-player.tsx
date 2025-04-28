'use client';

import React from 'react';

interface VideoPlayerProps {
    src: string;
    controls?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    controls = false,
    autoplay = true,
    muted = true,
    loop = true,
    className = '',
}) => {
    return (
        <video
            className={`w-full h-auto rounded-lg shadow-md ${className}`}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            playsInline
            style={{ backgroundColor: '#000' }}
            onError={(e) => {
                console.error('Video error:', e);
                const video = e.target as HTMLVideoElement;
                console.error('Video error details:', video.error);
            }}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer; 