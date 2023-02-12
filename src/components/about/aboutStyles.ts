import styled from 'styled-components';

export const AboutBox = styled.section`
  padding: 3em 0;
  border-top: 1px solid #c7c7c7;
  font-size: 2em;
  line-height: 1.6em;
  font-weight: normal;
  margin: 0;
  transition: all 1s ease-in-out 0s;

  @media screen and (max-width: 768px) {
    padding: 2em 10px;
    font-size: 1.5em;
  }
`;

export const AboutTitle = styled.span`
  font-size: 0.5em;
  margin-right: 5em;
  position: relative;
  top: 20px;
  width: fit-content;
  display: inline-block;
  overflow: hidden;
  font-family: 'Playfair Display SC', serif;
  transition: all 1s ease-in-out 0s;

  @media screen and (max-width: 768px) {
    font-size: 0.6em;
    margin-right: 4em;
    top: 15px;
  }
`;

export const MoreBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 2em;
  font-size: 1.5rem;
  transition: all 1s ease-in-out 0s;

  @media screen and (max-width: 768px) {
    margin-top: 1em;
  }

  .morebtn {
    text-decoration: none;
  }
`;
