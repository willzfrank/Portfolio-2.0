import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Tab,
  TabButton,
  TabContent,
  TabImage,
  Num,
  TitleText,
} from './TabStyles';
const VerticalTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('London');

  useEffect(() => {
    document.getElementById('defaultOpen')?.click();
  }, []);

  const openCity = (cityName: string) => {
    setActiveTab(cityName);
  };

  return (
    <>
      <Tab>
        <TabButton
          className={activeTab === 'London' ? 'active' : ''}
          onClick={() => openCity('London')}
          id="defaultOpen"
        >
          <li
            className="project"
            data-thumbnail="/assets/img/2021/shopify-blog-thumb.png"
          >
            <Num id="project-01-num">01</Num>
            <TitleText id="project-01-title">Artsy</TitleText>
            <TitleText id="project-01-type">
              Photography - Ecommerce, Typescript, NextJs
            </TitleText>
            <Link href="https://artsy-swart.vercel.app/" className="link">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.63668 21.2132L17.9887 10.8611L17.9887 20.3646L20.3646 20.3646V6.78819H6.78816L6.78816 9.16407L16.2917 9.16407L5.93963 19.5161L7.63668 21.2132Z"
                  fill="black"
                />
              </svg>
            </Link>
          </li>
        </TabButton>
        <TabButton
          className={activeTab === 'Paris' ? 'active ' : ''}
          onClick={() => openCity('Paris')}
        >
          <li
            className="project"
            data-thumbnail="/assets/img/2021/shopify-blog-thumb.png"
          >
            <Num id="project-01-num">02</Num>
            <TitleText id="project-01-title">Machala Vehicles</TitleText>
            <TitleText id="project-01-type">
              Vehicle Website, Javascript, CSS
            </TitleText>
            <Link
              href="https://lexusniitdemo.vercel.app/"
              className="link"
              target="_blank"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.63668 21.2132L17.9887 10.8611L17.9887 20.3646L20.3646 20.3646V6.78819H6.78816L6.78816 9.16407L16.2917 9.16407L5.93963 19.5161L7.63668 21.2132Z"
                  fill="black"
                />
              </svg>
            </Link>
          </li>
        </TabButton>
        <TabButton
          className={activeTab === 'Tokyo' ? 'active' : ''}
          onClick={() => openCity('Tokyo')}
        >
          <li
            className="project"
            data-thumbnail="/assets/img/2021/shopify-blog-thumb.png"
          >
            <Num id="project-01-num">03</Num>

            <TitleText id="project-01-title">Vsonet Education</TitleText>
            <TitleText id="project-01-type">
              Tech Website, Javascript, CSS
            </TitleText>
            <Link
              href="https://vsoneteducationdemo.netlify.app/"
              className="link"
              target="_blank"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.63668 21.2132L17.9887 10.8611L17.9887 20.3646L20.3646 20.3646V6.78819H6.78816L6.78816 9.16407L16.2917 9.16407L5.93963 19.5161L7.63668 21.2132Z"
                  fill="black"
                />
              </svg>
            </Link>
          </li>
        </TabButton>
      </Tab>

      <TabContent
        style={{ display: activeTab === 'London' ? 'block' : 'none' }}
      >
        <h3>London</h3>
        <p>London is the capital city of England.</p>
      </TabContent>

      <TabContent style={{ display: activeTab === 'Paris' ? 'block' : 'none' }}>
        <h3>Paris</h3>
        <p>Paris is the capital of France.</p>
      </TabContent>

      <TabContent style={{ display: activeTab === 'Tokyo' ? 'block' : 'none' }}>
        <TabImage>
          <Image src="" alt="" className="tab_img" />
        </TabImage>
      </TabContent>
    </>
  );
};

export default VerticalTabs;
