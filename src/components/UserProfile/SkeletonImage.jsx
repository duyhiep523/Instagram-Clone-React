import React from 'react';
import './SkeletonImage.css';

const SkeletonImage = ({ width = '100%', height = '100%', style = {} }) => (
  <div
    className="skeleton-image"
    style={{ width, height, ...style }}
  />
);

export default SkeletonImage;
