import React, { useState } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  transition: all 1s ease-in-out;

  &.show-image {
    transform: translateX(0%) scale(1);
  }
`;

const Image: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
  };

  return (
    <ImageContainer
      className={isVisible ? 'show-image' : ''}
      onClick={handleClick}
    >
      <img src="/Screenshot (13) 1.png" alt="Image" />
    </ImageContainer>
  );
};

export default Image;
