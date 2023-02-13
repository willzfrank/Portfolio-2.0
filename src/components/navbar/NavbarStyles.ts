import styled from 'styled-components';

export const NavbarContainer = styled.nav`
  font-family: 'Playfair Display SC', serif;
  position: relative;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.3s ease-in-out;
  padding: 0 1rem;

  @media screen and (max-width: 768px) {
    padding: 0;
  }

  .bottom {
    position: absolute;
    bottom: 1.6em;
  }
  .secondary {
    color: rgb(0, 0, 0);
    text-decoration: none;
    cursor: pointer;
  }
  .text-animate {
    width: fit-content;
    display: inline-block;
    word-break: break-word;
    hyphens: auto;
    overflow: hidden;
  }
`;

export const NavbarTitle = styled.h1`
  font-size: 1em;
  font-weight: normal;
  width: fit-content;
  display: inline-block;
  margin: 0px;
  word-break: break-word;
  hyphens: auto;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    display: flex;
    width: max-content;
    padding-left: 0.5rem;
  }
`;

export const TitleSpan = styled.span`
  opacity: 1;
  transform: translate(0px);
  display: inline-block;
  margin: 0 2px;
`;

export const Dashspan = styled.span`
  width: 60px;
  position: relative;
  display: inline-block;
  transition: width 1.5s ease 0s;
  &::after {
    content: '';
    height: 1px;
    width: 100%;
    position: absolute;
    top: -5px;
    left: 5px;
    background: rgb(0, 0, 0);
  }
`;

export const CloseNavbarBtn = styled.button`
  transition: all 1s ease-in-out 0s;
  border: none;
  font-size: 1em;
  color: #ccc !important;
  cursor: pointer;
  background-color: black;
`;
export const NavbarBtn = styled.button`
  transition: all 1s ease-in-out 0s;
  border: none;
  font-size: 1em;
  cursor: pointer;
  padding-right: 1em;
  @media screen and (min-width: 768px) {
    display: none !important;
  }
`;

export const NavbarListContainer = styled.ul`
  display: flex;
  .project_link {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .link:first-of-type {
    margin-left: 0;
    color: rgb(89, 89, 89);
  }
  .link:nth-child(2),
  .link:nth-child(3) {
    display: inline-block;
    margin-left: 2em;
    color: rgb(89, 89, 89);
  }
`;

export const SmallDash = styled.span`
  position: relative;
  width: 0px;
  display: inline-block;
  transition: width 1.5s ease 0s;
`;

export const MobileNavbarList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  font-size: 2em;
  li {
    padding: 1em 0;
    color: #ccc !important;
  }
`;

export const MobileNavbar = styled.div`
  display: none;
  z-index: 999;
  position: fixed;
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  background-color: black;
  top: 0;
  /* right: 0%; */
  padding: 1.6em;
  color: #ccc;

  .mobile-secondary {
    color: #ccc;
    text-decoration: none;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

export const MobileNavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
