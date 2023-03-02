import styled from 'styled-components';

export const FooterContainer = styled.footer`
  /* padding: 8em 0px; */
  border-top: 1px solid rgb(199, 199, 199);
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-top: 3.3333333333333335rem;
  padding-bottom: 0.7222222222222222rem;

  @media screen and (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .footer_bottom {
    border-top: 1px solid rgb(199, 199, 199);
    padding-top: 1.3333333333333335rem;
    /* padding-bottom: 0.7222222222222222rem; */
  }
`;

export const FooterBox = styled.div`
  max-width: 1340px;
  display: flex;
  flex-wrap: wrap;
  overflow-wrap: break-word;
  position: relative;
  /* padding: 0px 1.66667rem; */
  justify-content: space-between;
`;

export const FooterTitle = styled.div`
  h2 {
    text-align: left;
    font-size: 1.5rem;
    line-height: 1.611rem;
    font-weight: bold;

    span {
      font-weight: 400;
    }
  }
`;

export const FooterButton = styled.button`
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  /* display: inline-block; */
  margin: 2rem 0 3rem 0;
  border-color: black;
  border-width: 0.05rem;
  transition: all 0.5s cubic-bezier(1, 0, 0, 1);
  font-size: 0.8rem;
  padding: 1rem 2rem;
  letter-spacing: -0.005rem;
  border-radius: 2.7rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    /* background: #000; */
    background-color: rgb(231, 250, 236);

    transition: all 1s ease-in-out 0s;
  }

  &:before {
    position: absolute;
    content: '';
    display: inline-block;
    top: -180px;
    left: 0;
    width: 30px;
    height: 100%;
    background-color: #fff;
    animation: shiny-btn1 3s ease-in-out infinite;
  }

  &:active {
    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
      -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
      inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2),
      inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  }

  @-webkit-keyframes shiny-btn1 {
    0% {
      -webkit-transform: scale(0) rotate(45deg);
      opacity: 0;
    }
    80% {
      -webkit-transform: scale(0) rotate(45deg);
      opacity: 0.5;
    }
    81% {
      -webkit-transform: scale(4) rotate(45deg);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(50) rotate(45deg);
      opacity: 0;
    }
  }
`;

export const FollowContainer = styled.div`
  font-size: 2rem;
  line-height: 2rem;
  h6 {
    font-weight: 400;
  }

  .list_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    margin: 1rem 0;

    .uil-twitter {
      &:hover {
        color: #1da1f2;
        cursor: pointer;
        transition: all 1s ease-in-out 0s;
      }
    }

    .uil-linkedin {
      &:hover {
        color: #0e76a8;
        cursor: pointer;
        transition: all 1s ease-in-out 0s;
      }
    }
  }
`;
