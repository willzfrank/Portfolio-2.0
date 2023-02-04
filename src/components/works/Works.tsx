import React from 'react';
import VerticalTabs from './VerticalTab/Tab';
import {
  WorkContentBox,
  WorkContentTitle,
  WorkContentText,
  WorkBox,
} from './WorkStyles';

type Props = {};

const Works = (props: Props) => {
  return (
    <WorkBox>
      <WorkContentBox>
        <WorkContentTitle id="projects-h2">Selected works</WorkContentTitle>
        <WorkContentText
          className="mt-4 max-40 medium animate__fadeIn"
          id="projects-desc"
          data-scroll
          data-scroll-call="animate-in+projects-desc"
        >
          Here are some of my best projects. For a complete list, visit the{' '}
          <a href="/projects">Projects page</a>.
        </WorkContentText>
      </WorkContentBox>
      <VerticalTabs />
    </WorkBox>
  );
};

export default Works;
