import { HeaderTitle } from './headerStyles';
import { motion } from 'framer-motion';
import { textContainer, textVariant2 } from '../../utils/motion';

const Header = () => {
  return (
    <motion.header variants={textVariant2} initial="hidden" whileInView="show">
      <HeaderTitle
        className="xx-large mb-1 text-animate"
        id="index-h1"
        data-scroll
        data-scroll-call="text-animate+index-h1"
      >
        I’m Francis, <br /> a Frontend Developer based in Lagos, Nigeria
        &#127758;
      </HeaderTitle>
    </motion.header>
  );
};

export default Header;
