import styled from 'styled-components';

export const ProjectHeader = styled.section``;

export const ProjectHeaderTitle = styled.div`
  height: 86vh;
  position: relative;

  .projectheader_title {
    position: absolute;
    bottom: 0;
    left: 0;
    animation: float 2s ease-in-out infinite;

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0);
      }
    }

    h6 {
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 500;
      transition-property: color, background-color, border-color,
        text-decoration-color, fill, stroke, opacity, box-shadow, transform,
        filter, backdrop-filter, -webkit-backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 0.5s;
    }

    h1 {
      margin: 1rem 0;
      font-size: 3.75rem;
      line-height: 1;
      font-weight: 700;
      transition-property: color, background-color, border-color,
        text-decoration-color, fill, stroke, opacity, box-shadow, transform,
        filter, backdrop-filter, -webkit-backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 0.5s;
    }
  }
`;

export const ProjectContributors = styled.section`
  padding: 2em 0;
  border-top: 1px solid #c7c7c7;

  .contributer {
    margin-bottom: 2em;
  }

  h3 {
    margin-bottom: 1.2em;
    font-size: 1.17em;
    font-weight: normal;
  }

  p {
    transition: 1s ease-in-out;
    color: #595959;
    margin-bottom: 1.2em;
  }
`;

export const ProjectContent = styled.section`
  .project_contentLink {
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
    line-height: 1.5;
    text-decoration: none;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    margin-bottom: 1rem;
  }
  .project_homeLink {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10rem 0;
    font-size: 3rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

export const Dashspan = styled.span`
  width: 60px;
  position: relative;
  display: inline-block;
  transition: width 1.5s ease 0s;
  margin-right: 1rem;

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

export const ProjectContent1 = styled.section`
  p {
    max-width: 50%;
    font-weight: normal;
    font-size: 1.1em;
    line-height: 1.6em;
    margin-bottom: 2em;
  }

  .project_imgContainer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 100px;
    background-color: #DCDCDC;

    .coverImg {
      transition: all 2s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 4em;
      margin-bottom: 4em;
    }
  }
`;

export const LongerDashspan = styled.span`
  width: 300px;
  position: relative;
  display: inline-block;
  transition: width 1.5s ease 0s;
  margin-right: 2rem;

  &::after {
    content: '';
    height: 1px;
    width: 100%;
    position: absolute;
    top: -15px;
    left: 5px;
    background: rgb(0, 0, 0);
  }
`;
