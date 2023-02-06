import styled from 'styled-components';

export const ScrollingText = styled.p`
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 100px;
  /* overflow: hidden; */
  width: 100vw;
  animation: scrolling-text 6s linear infinite;
  font-size: 10vw;

  @keyframes scrolling-text {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

export const ChatContainer = styled.section`
  padding: 2em 0px;
  border-top: 1px solid rgb(199, 199, 199);

  .chat_text {
    font-size: 1.2em;
    line-height: 1.6em;
  }
`;

export const ScrollingTextContainer = styled.div`
  /* transition: all 1s ease-in-out 0s;
  width: 100vw;
  position: relative;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  padding: 3em 0px;
  overflow: hidden; */
  /* width: 100%;
  overflow: hidden; */
  white-space: nowrap;
  animation: scrollingText 15s linear infinite;

  @keyframes scrollingText {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;
