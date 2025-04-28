import Image from 'next/image';
import React from 'react';
import VideoPlayer from './video-player';

interface FeatureBlockProps {
  media: {
    src: string;
    type: 'image' | 'video';
  };
  title?: React.ReactNode;
  subtitle?: string;
  kicker?: string;
  inverted?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  kickerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  // Video specific props
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  media,
  title,
  subtitle,
  kicker,
  inverted = false,
  containerClassName = '',
  imageClassName = '',
  contentClassName = '',
  kickerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  // Video props with defaults
  autoplay = true,
  controls = false,
  muted = true,
  loop = true,
}) => {
  const renderMedia = () => {
    if (media.type === 'image') {
      return (
        <Image
          src={media.src}
          className="w-full h-auto rounded-lg shadow-md"
          alt={title as string}
          width={500}
          height={500}
        />
      );
    }

    return (
      <VideoPlayer
        src={media.src}
        controls={controls}
        autoplay={autoplay}
        muted={muted}
        loop={loop}
      />
    );
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Add the animation class here */}
      <div className={`flex flex-col ${inverted ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center animate-fade-in`}>
        <div className={`w-full md:w-1/2 ${imageClassName}`}>
          {renderMedia()}
        </div>

        <div className={`w-full md:w-1/2 ${contentClassName}`}>
          {kicker && (
            <p className={`text-sm font-medium uppercase tracking-wider text-gray-500 mb-2 ${kickerClassName}`}>
              {kicker}
            </p>
          )}

          {title && (
            <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
              {title}
            </h2>
          )}

          {subtitle && (
            <p className={`text-lg text-gray-600 ${subtitleClassName}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureBlock;