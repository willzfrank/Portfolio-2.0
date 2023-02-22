import { Variants, Transition } from 'framer-motion';

type Direction = 'left' | 'right' | 'up' | 'down';


export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.4,
    },
  },
};

type SlideInProps = {
  direction: Direction;
  type: Transition;
  delay: number;
  duration: number;
};

export const slideIn = ({
  direction,
  type,
  delay,
  duration,
}: SlideInProps): Variants => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});

type StaggerContainerProps = {
  staggerChildren: number;
  delayChildren: number;
};

export const staggerContainer = ({
  staggerChildren,
  delayChildren,
}: StaggerContainerProps) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

interface TextVariantProps {
  delay: number;
}

export const textVariant: (props: TextVariantProps) => Transition = ({
  delay,
}) => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1.25,
      delay,
    },
  },
});

export const textContainer = {
  hidden: {
    opacity: 0,
  },
  show: (delay = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: delay + 0.1,
    },
  }),
};

export const textVariant2 = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.3,
    },
  },
};

interface FadeInAnimationOptions {
  direction: 'left' | 'right' | 'up' | 'down';
  type: string;
  delay: number;
  duration: number;
}

export const fadeIn = ({
  direction,
  type,
  delay,
  duration,
}: FadeInAnimationOptions) => ({
  hidden: {
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});

export const planetVariants = (direction: 'left' | 'right') => ({
  hidden: {
    x: direction === 'left' ? '-100%' : '100%',
    rotate: 120,
  },
  show: {
    x: 0,
    rotate: 0,
    transition: {
      type: 'spring',
      duration: 1.8,
      delay: 0.5,
      ease: 'easeOut',
    },
  },
});

export const zoomIn = (delay: number, duration: number) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration,
      delay,
    },
  },
});

export const footerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.5,
      duration: 0.5, // Added a duration property to the show transition
    },
  },
};
