import styled from 'styled-components';

export const ContactContainer = styled.section`
  max-width: 1340px;
  padding-top: 3.3rem;
  margin-top: 5rem;
  padding-bottom: 6.6rem;
  margin-bottom: 0rem;

  @media screen and (max-width: 768px) {
    padding-bottom: 2rem;
    padding-top: 0;
    margin-top: 2rem;
  }

  .contact_container2 {
    margin-right: auto;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    padding: 0px 1.66667rem;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      padding: 0 0.5rem;
    }

    .contact_title {
      width: calc(16.6667%);
      max-width: calc(16.6667%);
      flex: 0 0 calc(16.6667%);
      padding-left: 0.83333rem;
      padding-right: 0.83333rem;
      padding-top: 0rem;
      padding-bottom: 0.5rem;
      transition: all 1s ease-in-out 0s;

      @media screen and (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;
        padding: 0 0.5rem;
      }

      h6 {
        font-size: 0.8888888888888888rem;
        line-height: 1.2222222222222223rem;
        letter-spacing: 0rem;
        font-weight: normal;
        /* color: rgb(50, 50, 50); */
        color: #dbdada;
      }
    }

    .contact_content {
      width: calc(75%);
      max-width: calc(75%);
      flex: 0 0 calc(75%);
      padding-left: 0.83333rem;
      padding-right: 0.83333rem;
      padding-top: 0rem;
      padding-bottom: 1.16rem;

      @media screen and (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;
        padding: 0 0.5rem;
        font-size: 13px;
      }
      button {
        padding: 1rem 2rem;
        border-radius: 2.7rem;
        border-width: 0.05rem;
        font-weight: bold;

        &:hover {
          /* background: #000; */
          background: rgb(231, 250, 236);

          cursor: pointer;
          color: #fff;
          transition: all 1s ease-in-out 0s;
        }
      }

      h5 {
        flex: 0 0 calc(66.6667%);
        font-family: 'League Spartan', sans-serif;
        padding-top: 0rem;
        font-size: 1.5em;
        line-height: 1.6em;
        transition: all 1s ease-in-out 0s;
        font-weight: normal;
        padding-bottom: 1em;
        overflow-wrap: break-word;
      }

      h2 {
        margin-bottom: 1rem;
        transition: all 1s ease-in-out 0s;
        font-size: 3rem;
        line-height: 3.4rem;
        letter-spacing: -0.17rem;
        /* color: rgb(50, 50, 50); */
        word-wrap: break-word;
        span {
          font-weight: normal;
        }
      }
    }
  }
`;

export const ContactSocials = styled.ul`
  margin: 2em 0;
  list-style: none;
  border-top: 1px solid rgb(199, 199, 199);
  border-bottom: 1px solid rgb(199, 199, 199);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 3rem 0;
`;
