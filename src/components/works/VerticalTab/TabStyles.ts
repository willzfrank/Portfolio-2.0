import styled, { keyframes } from 'styled-components';

export const TabContainer = styled.section`
  /* margin-bottom: 30em; */

  @media screen and (max-width: 768px) {
    display: none;
    margin-bottom: 0;
  }
`;
export const Tab = styled.div`
  float: left;
  width: 50%;
  height: 500px;
  margin-top: 4em;
  margin-bottom: 6em;
  /* border: 2px solid red; */
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
      transition: opacity 0.4s ease-in-out;
    }
  }
  &:not(.active) {
    li {
      opacity: 0.5;
      transition: opacity 0.4s ease-in-out;
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

    svg {
      animation: float 2s ease-in-out infinite;

      @keyframes float {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0);
        }
      }
    }

    .project:hover {
      border-bottom: 3px solid rgb(199, 199, 199);
      transition: 0.5s;
    }
  }
`;

export const TabContent = styled.div`
  /* margin-top: 4em; */
  float: left;
  padding: 0px 12px;
  width: 50%;
  height: 550px;

  .imgimg {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

export const TabImage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .tab_img {
    display: flex;
    align-items: center;
    justify-content: center;

    object-fit: contain;
    object-position: 50% 50%;
    transition: slideIn 1s ease;

    &:hover {
      transform: scale(1.4);
      transition: 1s ease-in-out;
    }
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
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
