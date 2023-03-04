import styled from 'styled-components';

export const HeaderTitle = styled.h1`
  font-size: 8vw;
  line-height: 1;
  word-break: break-word;
  hyphens: auto;
  overflow: hidden;
  margin-bottom: 0.4em;
  padding: 4rem 0;
  transition: all 0.2s ease-in-out;

  @media only screen and (max-width: 884px) and (min-width: 430px) {
    font-size: 9.5vh !important;
    line-height: 1.3;
    padding: 2rem 0.5rem;
  }

  /* @media only screen and (max-width: 430px) {
    font-size: 7.8vh !important;
    line-height: 1.3;
    padding: 1rem 0.2rem;
    border: 2px solid red;
  } */

  @media only screen and (min-width: 320px) and (max-width: 430px) {
    font-size: 7.6vh !important;
    line-height: 1.3;
    padding: 1.5rem 0.5rem;
  }
`;
