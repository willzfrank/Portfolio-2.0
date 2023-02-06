import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  FooterContainer,
  FooterBox,
  FooterTitle,
  FooterButton,
  FollowContainer,
} from './FooterStyles';

type Props = {};

const Footer = (props: Props) => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <FooterContainer>
      <FooterBox>
        <FooterTitle>
          <h2>
            GODSWILL FRANCIS <span> — FRONTEND / NIGERIA</span>
          </h2>
          <FooterButton>
            <Link
              href="mailto:willzudoh4@gmail.com"
              target="_blank"
              className="link"
            >
              SEND AN EMAIL
            </Link>
          </FooterButton>
        </FooterTitle>
        <FollowContainer>
          <h6>FOLLOW ME</h6>
          <div className="list_container">
            <li>
              <Link
                href="https://github.com/willzfrank"
                className="link"
                target="_blank"
              >
                <i className="uil uil-github"></i>
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com/willzfrank001"
                className="link"
                target="_blank"
              >
                <i className="uil uil-twitter"></i>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/godswill-udoh/"
                target="_blank"
                className="link"
              >
                <i className="uil uil-linkedin"></i>
              </Link>
            </li>
          </div>
        </FollowContainer>
      </FooterBox>

      <div className="footer_bottom">
        Website made in Nigeria with ♥ by Godswill Francis — © @iamwillzfrank /
        {year} / All rights reserved.
      </div>
    </FooterContainer>
  );
};

export default Footer;
