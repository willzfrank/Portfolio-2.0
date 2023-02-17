import styled from 'styled-components';

export const AboutContainer = styled.section`
  width: 99.5%;
  max-width: 1600px;
  margin: auto;
  min-height: 87vh;
  padding: 2em 0px;
  grid-template-columns: auto 1fr;
  display: grid;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column-reverse;
  }

  h6 {
    font-size: 1rem;
    line-height: 1.75rem;
    font-weight: 500;
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke, opacity, box-shadow, transform,
      filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.5s;
    padding: 0 0.5rem 1rem 0.5rem;
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }
`;

export const Thumbnail = styled.div`
  max-width: 540px;
  width: 45vw;
  padding-right: 2.4em;

  @media screen and (max-width: 768px) {
    width: 100vw;
    margin: auto;
  }

  .image__container {
    clip-path: inset(0px);
    transition: all 2s cubic-bezier(0.16, 1, 0.3, 1) 0s;
    overflow: hidden;

    @media screen and (max-width: 768px) {
      width: 100vw;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;
    }

    .img {
      width: 100% !important;
      overflow-clip-margin: content-box;
      overflow: clip;
      object-fit: cover;
      height: auto !important;

      @media screen and (max-width: 768px) {
        height: auto !important;
        width: 100% !important;
      }
    }
  }
`;

export const AboutHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.6em;
  border-top: 1px solid rgb(199, 199, 199);
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    border: none;
  }

  .large {
    font-size: 2em;
    line-height: 1.6em;
    transition: all 1s ease-in-out 0s;
    font-weight: normal;
    margin: 0px;

    @media screen and (max-width: 768px) {
      font-size: 1.4em;
      padding: 0 0.5rem;
    }
  }

  .medium {
    transition: all 1s ease-in-out 0s;
    font-size: 1.2em;
    line-height: 1.6em;
    font-weight: normal;
    margin: 0px;

    @media screen and (max-width: 768px) {
      margin-top: 1.6em;
      padding: 0 0.5rem;
      font-size: 1.1em;
    }
  }
`;

export const SkillsContainer = styled.section`
  padding: 6em 0px;
  border-top: 1px solid rgb(199, 199, 199);

  .skills {
    padding: 2em 0.5rem !important;

    span {
      padding: 10px 20px;
      border-left: 2px solid rgb(89, 89, 89);
      background: rgba(162, 165, 214, 0.082);
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      margin: 0 15px 15px 0;
      font-family: Montserrat, 'League Spartan', 'Playfair Display SC';
    }
  }

  h2 {
    font-weight: normal;
    margin: 0px;
    overflow: hidden;
    font-size: 4em;

    @media screen and (max-width: 768px) {
      font-size: 2.7em;
    }
  }
`;

export const SkillsList = styled.ul`
  overflow: hidden;
  overflow-wrap: break-word;
  padding: 1rem 0;
  font-family: 'Rubik Moonrocks', cursive;
  color: #e5e5e5;
  font-size: 5.56rem;
  line-height: 6.33rem;
  margin-right: 0.89rem;
  text-transform: uppercase;
  display: inline-block;
  white-space: nowrap;
  animation: marquee 25s linear infinite;

  @keyframes marquee {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(-9050px, 0);
    }
  }

  @media screen and (max-width: 768px) {
    margin: 1rem 0;
    animation: marquee 30s linear infinite;
    @keyframes marquee {
      from {
        transform: translate(0, 0);
      }
      to {
        transform: translate(-10900px, 0);
      }
    }
  }
`;
export const ExperienceContainer = styled.section`
  padding: 6em 0px;
  border-top: 1px solid rgb(199, 199, 199);

  @media screen and (max-width: 768px) {
    padding: 4em 0.5rem;
  }

  .resume {
    align-self: flex-end;
    justify-content: flex-end;
    text-align: right;
    display: flex;
    width: 100%;
    cursor: pointer;
    font-weight: normal;
    margin: 2em 0;
    justify-self: end;
    font-size: 2em;
    line-height: 1.6em;
    transition: all 1s ease-in-out 0s;

    @media screen and (max-width: 768px) {
      font-size: 1.5em;
      justify-content: flex-start;
      align-self: flex-start;
      text-align: left;
      justify-self: flex-start;
    }
  }
  h2 {
    font-weight: normal;
    margin: 0px;
    overflow: hidden;
    font-size: 4em;

    @media screen and (max-width: 768px) {
      font-size: 2.7em;
    }
  }
`;

export const ExperienceList = styled.ul`
  font-size: 1.2em;
  width: 95%;
  align-items: center;
  margin: auto;
  justify-self: center;
  position: relative;
  list-style-type: none;
  padding: 0px;

  @media screen and (max-width: 768px) {
    justify-content: space-between !important;
    width: 100%;
  }

  .muted {
    margin-top: 0.8em;

    @media screen and (max-width: 768px) {
      margin-top: 0.4em;
      font-size: 1rem;
    }
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 2.4em;
    padding-top: 2.4em;
    font-size: 1.2em;
    border-bottom: 1px solid rgb(199, 199, 199);
    line-height: 1.9rem;

    @media screen and (max-width: 768px) {
      padding-bottom: 1.2em;
      padding-top: 1.2em;
      gap: 4rem;
      font-size: 1.1rem;
    }

    .project_title {
      font-weight: bold;
    }
  }
`;

export const ExperienceDate = styled.div`
  align-items: center;
  transition: all 1s ease-in-out 0s;
  display: flex;
  gap: 0.8em;
`;
