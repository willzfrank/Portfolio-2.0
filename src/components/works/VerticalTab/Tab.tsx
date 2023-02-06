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
            <Link href="https://artsy-swart.vercel.app/" className="link">
              <TitleText id="project-01-title">Artsy</TitleText>
            </Link>
            <TitleText id="project-01-type">
              Photography - Ecommerce, Typescript, NextJs
            </TitleText>
            <Link href="https://github.com/willzfrank/ARTSY" className="link">
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
            <Link
              href="https://lexusniitdemo.vercel.app/"
              className="link"
              target="_blank"
            >
              <TitleText id="project-01-title">Machala Vehicles</TitleText>
            </Link>
            <TitleText id="project-01-type">
              Vehicle Website, Javascript, CSS
            </TitleText>
            <Link
              href="https://github.com/willzfrank/Lexus-Demo-"
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
            <Link
              href="https://vsoneteducationdemo.netlify.app/"
              className="link"
              target="_blank"
            >
              <TitleText id="project-01-title">Vsonet Education</TitleText>
            </Link>
            <TitleText id="project-01-type">
              Tech Website, Javascript, CSS
            </TitleText>
            <Link
              href="https://github.com/willzfrank/Vsonet_Education"
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
        <div className="imgimg">
          <Image
            src="/auctionbid.png"
            alt="auctionimg"
            width={700}
            height={400}
            className="tab_img"
          />
        </div>
      </TabContent>

      <TabContent style={{ display: activeTab === 'Paris' ? 'block' : 'none' }}>
        <div className="imgimg">
          <Image
            src="/Screenshot (1).png"
            alt="auctionimg"
            width={700}
            height={500}
            className="tab_img"
          />
        </div>
      </TabContent>

      <TabContent style={{ display: activeTab === 'Tokyo' ? 'block' : 'none' }}>
        <TabImage>
          <div className="imgimg">
            <Image
              src="/auctionbid.png"
              alt="auctionimg"
              width={700}
              height={400}
              className="tab_img"
            />
          </div>
        </TabImage>
      </TabContent>
    </>
  );
};

export default VerticalTabs;
