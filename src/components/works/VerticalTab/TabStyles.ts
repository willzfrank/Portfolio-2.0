import styled from 'styled-components';

export const Tab = styled.div`
  float: left;
  width: 50%;
  height: 500px;
  margin-top: 4em;
`;

export const TabButton = styled.button`
  transition: opacity 0.4s ease-in-out 0s;
  display: block;
  background-color: inherit;
  color: black;
  padding: 22px 16px;
  width: 100%;
  border: none;
  outline: none;
  text-align: left;
  cursor: pointer;
  transition: 0.3s;
  font-size: 17px;

  &.active {
    li {
      opacity: 1;
    }
  }
  &:not(.active) {
    li {
      opacity: 0.5;
    }
  }

  .project {
    transition: border-bottom 0.4s ease-in-out;
    display: grid;
    grid-template-columns: 28px 50% 1fr 28px;
    align-items: center;
    position: relative;
    padding: 3em 0px;
    border-bottom: 1px solid rgb(199, 199, 199);
    list-style-type: none;
  }

  .project:hover {
    border-bottom: 3px solid rgb(199, 199, 199);
    transition: 0.5s;
  }
`;

export const TabContent = styled.div`
  margin-top: 4em;
  float: left;
  padding: 0px 12px;
  width: 50%;
  height: 550px;
  border: 2px solid red;
  /* clip-path: inset(0px 100% 0px 0px); */
`;

export const TabImage = styled.div`
  transition: clip-path 0.6s cubic-bezier(0.87, 0, 0.13, 1) 0s;
  height: 100%;
  width: 100%;

  .tab_img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
    transform: scale(1.4);
    overflow-clip-margin: content-box;
    overflow: clip;
    transition: transform 4s cubic-bezier(0.16, 1, 0.3, 1) 0s;
  }
`;

export const Num = styled.p`
  position: relative;
  top: 0px;
  align-self: flex-start;
  margin-left: 0.4em;
  margin-top: 0.4em;
  font-size: 0.8em;
  color: rgb(89, 89, 89);
  font-family: 'Roboto Mono', monospace;
`;

export const TitleText = styled.p`
  word-break: break-word;
  hyphens: auto;
  font-family: 'Montserrat', sans-serif;
`;
