import React from 'react';

import Link from 'next/link';

import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { navVariants } from '../../utils/motion';

import {
  NavbarContainer,
  NavbarTitle,
  TitleSpan,
  Dashspan,
  NavbarBtn,
  NavbarListContainer,
  SmallDash,
  MobileNavbarList,
  MobileNavbar,
  MobileNavHeader,
  CloseNavbarBtn,
} from './NavbarStyles';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [sticky, setSticky] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router]);

  return (
    <motion.div
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className="nav_sticky"
    >
      <NavbarContainer
        className={`navbar ${sticky ? 'sticky' : ''}`}
        style={{ transition: 'background-color 0.3s ease-in-out' }}
      >
        <div
          className="section slimmer no-border flex between center"
          data-scroll-section
        >
          <div className="grid column-25 mobile-100 center grow">
            <div className="site-title">
              <Link className="secondary" href="/">
                <NavbarTitle
                  id="nav-h1"
                  data-scroll
                  data-scroll-call="text-animate+nav-h1"
                  // className="mobile-hide"
                >
                  <TitleSpan>Godswill </TitleSpan>
                  <TitleSpan> Francis</TitleSpan>
                </NavbarTitle>
              </Link>
            </div>
            <p className="role mobile-hide">
              <span
                className="text-animate"
                id="nav-role"
                data-scroll
                data-scroll-call="text-animate+nav-role"
              >
                <TitleSpan>Frontend Developer</TitleSpan>
              </span>
              <Dashspan
                className="dash"
                id="role-dash"
                data-scroll
                data-scroll-call="animate-in+role-dash"
                data-scroll-delay="1"
              ></Dashspan>
            </p>
          </div>
          <NavbarBtn
            className="mobile-menu mobile-only animate__fadeIn"
            id="mobile-menu-btn"
            data-scroll
            data-scroll-call="animate-in+mobile-menu-btn"
            onClick={toggleMenu}
          >
            Menu
          </NavbarBtn>
          <div className="nav_links">
            <NavbarListContainer className="links mobile-hide">
              <li className="link">
                <Link href="/project/" className="secondary project_link">
                  <span
                    className="text-animate"
                    id="link-projects"
                    data-scroll
                    data-scroll-call="text-animate+link-projects"
                  >
                    Projects &nbsp;
                    <sup
                      className="num muted mono animate__fadeIn"
                      id="project-count"
                      data-scroll
                      data-scroll-call="animate-in+project-count"
                    >
                      4
                    </sup>
                  </span>{' '}
                </Link>
              </li>

              <li className="link">
                <Link href="/about" className="secondary">
                  <p
                    className="text-animate"
                    id="link-About"
                    data-scroll
                    data-scroll-call="text-animate+link-About"
                  >
                    About
                  </p>
                </Link>
              </li>

              <li className="link">
                <Link href="/contact" className="secondary">
                  <p
                    className="text-animate"
                    id="link-Contact"
                    data-scroll
                    data-scroll-call="text-animate+link-Contact"
                  >
                    Contact
                  </p>
                </Link>
              </li>
            </NavbarListContainer>
          </div>
        </div>
        {/* {isOpen && ( */}
        <MobileNavbar className={`${isOpen ? 'left' : 'right'}`}>
          <MobileNavHeader>
            <Link href="/" className="mobile-secondary">
              <p>Godswill Francis</p>
            </Link>
            <CloseNavbarBtn className="mobile-menu left" onClick={toggleMenu}>
              Close
            </CloseNavbarBtn>
          </MobileNavHeader>
          <MobileNavbarList>
            <li className="link">
              <Link href="/project/" className="mobile-secondary project_link">
                <span
                  className="text-animate"
                  id="link-projects"
                  data-scroll
                  data-scroll-call="text-animate+link-projects"
                >
                  Projects &nbsp;
                  <sup
                    className="num muted mono animate__fadeIn"
                    id="project-count"
                    data-scroll
                    data-scroll-call="animate-in+project-count"
                  >
                    4
                  </sup>
                </span>{' '}
              </Link>
            </li>

            <li className="link">
              <Link href="/about" className="mobile-secondary">
                <p
                  className="text-animate"
                  id="link-About"
                  data-scroll
                  data-scroll-call="text-animate+link-About"
                >
                  About
                </p>
              </Link>
            </li>

            <li className="link">
              <Link href="/contact" className="mobile-secondary">
                <p
                  className="text-animate"
                  id="link-Contact"
                  data-scroll
                  data-scroll-call="text-animate+link-Contact"
                >
                  Contact
                </p>
              </Link>
            </li>
          </MobileNavbarList>
          <p className="role bottom white mobile-only ">
            Frontend Developer
            <SmallDash className="dash"></SmallDash>
          </p>
        </MobileNavbar>
        {/* )} */}
      </NavbarContainer>
    </motion.div>
  );
};

export default Navbar;
