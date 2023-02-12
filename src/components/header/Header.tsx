import { HeaderTitle } from './headerStyles';

const Header = () => {
  return (
    <HeaderTitle
      className="xx-large mb-1 text-animate"
      id="index-h1"
      data-scroll
      data-scroll-call="text-animate+index-h1"
    >
      I’m Francis, <br /> a Frontend Developer based in Lagos, Nigeria &#127758;
    </HeaderTitle>
  );
};

export default Header;
