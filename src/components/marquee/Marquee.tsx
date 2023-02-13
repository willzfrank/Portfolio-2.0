import React from 'react';
import { SkillsList } from '@/styles/AboutStyles';

const Marquee = () => {
  return (
    <SkillsList>
      Javascript <span> • </span>ReactJS <span> • </span> NextJS{' '}
      <span> • </span> TypeScript <span> • </span> Material UI <span> • </span>{' '}
      Tailwind CSS <span> • </span> Styled-Components <span> • </span> Git{' '}
      <span> • </span> HTML 5 <span> • </span> SASS <span> • </span> SCSS{' '}
      <span> • </span> CSS3 <span> • </span> Responsive Design <span> • </span>{' '}
      Performance Optimization <span> • </span> Agile Development{' '}
      <span> • </span> REST <span> • </span> GRAPH QL
    </SkillsList>
  );
};

export default Marquee;
