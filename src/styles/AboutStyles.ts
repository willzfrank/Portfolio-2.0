import styled from 'styled-components';

export const AboutContainer = styled.section`
  width: 99.5%;
  max-width: 1600px;
  margin: auto;
  min-height: 87vh;
  padding: 2em 0px;
  grid-template-columns: auto 1fr;
  display: grid;
`;

export const Thumbnail = styled.div`
  max-width: 540px;
  width: 45vw;
  padding-right: 2.4em;

  .image__container {
    clip-path: inset(0px);
    transition: all 2s cubic-bezier(0.16, 1, 0.3, 1) 0s;
    overflow: hidden;

    .img {
      width: 100% !important;
      overflow-clip-margin: content-box;
      overflow: clip;
      object-fit: cover;
      height: auto !important;
    }
  }
`;

export const AboutHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.6em;
  border-top: 1px solid rgb(199, 199, 199);
  justify-content: space-between;

  .large {
    font-size: 2em;
    line-height: 1.6em;
    transition: all 1s ease-in-out 0s;
    font-weight: normal;
    margin: 0px;
  }

  .medium {
    transition: all 1s ease-in-out 0s;
    font-size: 1.2em;
    line-height: 1.6em;
    font-weight: normal;
    margin: 0px;
  }
`;

export const SkillsContainer = styled.section`
  padding: 6em 0px;
  border-top: 1px solid rgb(199, 199, 199);

  h2 {
    font-weight: normal;
    margin: 0px;
    overflow: hidden;
    font-size: 4em;
  }
`;

export const SkillsList = styled.ul`
  margin: 2em 0;

  list-style-type: none;
  display: flex;
  align-items: center;
  font-size: 1.2em;
  width: 95%;
  justify-content: space-between;

  li {
    text-transform: uppercase;
  }
`;

export const ExperienceContainer = styled.section`
  padding: 6em 0px;
  border-top: 1px solid rgb(199, 199, 199);

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
  }
  h2 {
    font-weight: normal;
    margin: 0px;
    overflow: hidden;
    font-size: 4em;
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

  .muted {
    margin-top: 0.8em;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 2.4em;
    padding-top: 2.4em;
    font-size: 1.2em;
    border-bottom: 1px solid rgb(199, 199, 199);
  }
`;

export const ExperienceDate = styled.div`
  align-items: center;
  transition: all 1s ease-in-out 0s;
  display: flex;
  gap: 0.8em;
`;
