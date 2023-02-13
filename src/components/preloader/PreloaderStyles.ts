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
    transform: scale(1.6);
  }
`;

export const Count = styled.div.attrs<CountProps>(({ count }) => ({
  count,
}))<CountProps>`
  font-size: 60px;
  transform-origin: center;
  transform: scale(1);
  font-family: 'MyFont', sans-serif;
  background-color: #333;
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
