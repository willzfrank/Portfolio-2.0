import React from 'react';
import { PointerContainer } from './pointer.styles';

const Pointer = () => {
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <PointerContainer
      style={{
        left: `${mouseX}px`,
        top: `${mouseY}px`,
      }}
    />
  );
};

export default Pointer;
