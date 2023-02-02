import React from 'react';
import { HeaderTitle } from './headerStyles';

type Props = {};

const Header = (props: Props) => {
  return (
    <div>
      <div className="section slimmer no-border" data-scroll-section>
        <HeaderTitle
          className="xx-large mb-1 text-animate"
          id="index-h1"
          data-scroll
          data-scroll-call="text-animate+index-h1"
        >
          I’m Francis, <br /> a Frontend Developer based in Lagos, Nigeria
          &#127758;
        </HeaderTitle>
      </div>
    </div>
  );
};

export default Header;
