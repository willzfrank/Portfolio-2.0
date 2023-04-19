// import styled from 'styled-components';

// export const PointerContainer = styled.div`
//   position: absolute;
//   width: 3rem;
//   height: 3rem;
//   border-radius: 50%;
//   pointer-events: none;
//   background-color: transparent;
//   box-shadow: 0px 0px 10px 0px #dbdada;
//   transform: translate(-50%, -50%);
//   transition: 0.3s ease-in-out;
// `;

import styled from 'styled-components';

export const PointerContainer = styled.div`
  position: fixed;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  pointer-events: none;
  background-color: transparent;
  box-shadow: 0px 0px 10px 0px #dbdada;
  transform: translate(-50%, -50%);
  transition: 0.3s ease-in-out;
  z-index: 9999;
`;
