import styled from 'styled-components';

export const HeaderTitle = styled.h1`
  font-size: 8vw;
  line-height: 1em;
  word-break: break-word;
  hyphens: auto;
  overflow: hidden;
  margin-bottom: 0.4em;

  @media screen and (max-width: 768px) {
    font-size: 3.73em;
    line-height: 1.1em;
    padding: 0 10px;
  }
`;
