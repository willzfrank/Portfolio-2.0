import styled from 'styled-components';

export const WorkContentBox = styled.div`
  max-width: 40%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    padding: 0 1rem;
  }
`;

export const WorkContentTitle = styled.h2`
  font-size: 4em;

  @media screen and (max-width: 768px) {
    font-size: 3em;
  }
`;

export const WorkContentText = styled.p`
  font-size: 1.2em;
  line-height: 1.6em;
  width: max-content;
  transition: all 1s ease-in-out 0s;
  margin-top: 1.6em;

  @media screen and (max-width: 768px) {
    margin-top: 1em;
    width: 100%;
  }
`;

export const WorkBox = styled.section`
  padding: 8em 0px;
  border-top: 1px solid rgb(199, 199, 199);
`;
