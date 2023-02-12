import styled from 'styled-components';

export const WorkContentBox = styled.div`
  max-width: 40%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

export const WorkContentTitle = styled.h2`
  font-size: 4em;

  @media screen and (max-width: 768px) {
    font-size: 2em;
    font-weight: normal;
  }
`;

export const WorkContentText = styled.p`
  font-size: 1.2em;
  line-height: 1.6em;
  width: max-content;
  transition: all 1s ease-in-out 0s;
  margin-top: 1.6em;

  @media screen and (max-width: 768px) {
    margin-top: 0.8em;
    width: 100%;
    font-size: 1.1em;
  }
`;

export const WorkBox = styled.section`
  padding: 4rem 0;
  border-top: 1px solid rgb(199, 199, 199);

  @media screen and (max-width: 768px) {
    padding: 1.5rem 0.5rem;
  }
`;
