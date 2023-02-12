import React from 'react';
import { SkillsList } from '@/styles/AboutStyles';

const Marquee = () => {
  return (
    <SkillsList>
      Javascript <span> • </span>ReactJS <span> • </span> NextJS{' '}
      <span> • </span> TypeScript <span> • </span> Material UI <span> • </span>{' '}
      Tailwind CSS <span> • </span> Styled-Components <span> • </span> Git
    </SkillsList>
  );
};

export default Marquee;
