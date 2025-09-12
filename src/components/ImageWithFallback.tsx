import { useState, ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

const ImageWithFallback = ({ src, fallbackSrc, ...props }: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={imgSrc}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;