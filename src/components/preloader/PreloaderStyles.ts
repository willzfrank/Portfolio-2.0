import styled, { keyframes, css } from 'styled-components';
import { HTMLAttributes } from 'react';

interface CountProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const countAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.3);
  }
`;

export const Count = styled.div.attrs<CountProps>(({ count }) => ({
  count,
}))<CountProps>`
  font-size: 8vw;
  line-height: 1.2;
  transform-origin: center;
  transform: scale(1);
  font-family: 'MyFont', sans-serif !important;
  background-color: #1f1f1f;
  z-index: 7000;
  height: 100vh;
  width: 100vw !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  ${({ count }) =>
    count === 100 &&
    css`
      animation: ${countAnimation} 1s forwards;
      animation-delay: 0.5s;
    `};
`;
