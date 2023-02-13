import React, { useState, useEffect } from 'react';
import { Container, Count } from './PreloaderStyles';

const Preloader = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => (prevCount >= 100 ? prevCount : prevCount + 1));
    }, 20);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container>
      <Count count={count}>{count}</Count>
    </Container>
  );
};

export default Preloader;
