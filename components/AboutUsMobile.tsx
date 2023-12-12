import React, {useState} from 'react';
import {TypeAnimation} from 'react-type-animation';
import {Tour} from 'antd';
import Lottie from 'lottie-react';
import type {TourProps} from 'antd';
import {
  AboutAnimation,
  VisionAnimation,
  MissionAnimation,
} from '@/public/animations';
import Image from 'next/image';
import {Button} from './ui/button';
const AboutUsMobile: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [stepKey, setStepKey] = useState<number>(0);

  const steps: TourProps['steps'] = [
    {
      title: (
        <p style={{fontSize: '0.9em', display: 'inline-block'}}>About Us</p>
      ),
      description: (
        <TypeAnimation
          key={`about-${stepKey}`}
          sequence={[
            'We are a dedicated team passionate about education and technology. Our goal is to empower students by creating a centralized platform where they can access and share valuable educational resources. We believe in the power of knowledge and the positive impact it can have on individuals and society.',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: '0.5em',
            display: 'inline-block',
            lineBreak: 'auto',
            width: '50%',
          }}
          repeat={Infinity}
        />
      ),
      //   cover: (
      //     <Lottie animationData={AboutAnimation} loop={true} height={'50%'} />
      //   ),
      nextButtonProps: {
        className: 'bg-sky-500 text-white hover:bg-sky-400  w-[10px]',
      },
    },
    {
      title: (
        <p style={{fontSize: '0.9em', display: 'inline-block'}}>Our Vision</p>
      ),
      description: (
        <TypeAnimation
          key={`vision-${stepKey}`}
          sequence={[
            'Our vision is to become the go-to platform for students seeking a comprehensive repository of university notes and educational content. We aim to foster a collaborative learning community where students can easily navigate through courses, access supplementary materials, and engage in interactive learning experiences.',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: '0.5em',
            display: 'inline-block',
            lineBreak: 'auto',
            width: '50%',
          }}
          repeat={Infinity}
        />
      ),
      //   cover: (
      //     <Lottie animationData={VisionAnimation} loop={true} height={'50%'} />
      //   ),
      nextButtonProps: {
        className: 'bg-sky-500 text-white hover:bg-sky-400  w-[10px]',
      },
    },
    {
      title: (
        <p style={{fontSize: '0.9em', display: 'inline-block'}}>Our Mission</p>
      ),
      description: (
        <TypeAnimation
          key={`mission-${stepKey}`}
          sequence={[
            'Our mission is to simplify the learning process by providing a user-friendly platform that seamlessly integrates notes and multimedia content.',
            1000,

            'We strive to create a hub that fosters collaboration among students, encourages the sharing of knowledge, and ultimately contributes to academic success.',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: '0.5em',
            display: 'inline-block',
            lineBreak: 'auto',
            width: '50%',
          }}
          repeat={Infinity}
        />
      ),
      nextButtonProps: {
        className: 'bg-sky-500 text-white hover:bg-sky-400  w-[10px]',
      },
    },
    {
      title: (
        <p style={{fontSize: '0.9em', display: 'inline-block'}}>Founders</p>
      ),
      description: (
        <TypeAnimation
          key={`founder1-${stepKey}`}
          sequence={[
            'Emmanuel, a skilled developer, merges technology and academia. A 2nd-year pharmacy student dedicated to advancing education through innovation. Currently in his 2nd year of pharmacy studies, Emmanuel is committed to innovating educational tools, contributing his technical prowess to the meyoneeducation Platform.',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: '0.5em',
            display: 'inline-block',
            lineBreak: 'auto',
            width: '50%',
          }}
          repeat={Infinity}
        />
      ),
      cover: (
        <div className="w-full flex flex-row items-center justify-between">
          <Image src={'/me.png'} alt="pic1" width={20} height={20} />
        </div>
      ),
      nextButtonProps: {
        className: 'bg-sky-500 text-white hover:bg-sky-400  w-[10px]',
      },
    },
    {
      title: (
        <p style={{fontSize: '0.9em', display: 'inline-block'}}>Founders</p>
      ),
      description: (
        <TypeAnimation
          key={`founder2-${stepKey}`}
          sequence={[
            'David Moses Ansumana, a visionary, conceived the idea for this platform. In his 2nd year of pharmacy studies, David is not only an advocate for accessible education but also a catalyst for change, driving the creation of the meyoneeducation Platform to benefit students',
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: '0.5em',
            display: 'inline-block',
            lineBreak: 'auto',
            width: '50%',
          }}
          repeat={Infinity}
        />
      ),
      cover: (
        <div className="w-full flex flex-row items-center justify-between">
          <Image src={'/him.jpg'} alt="pic1" width={20} height={20} />
        </div>
      ),
      nextButtonProps: {
        className: 'bg-sky-500 text-white hover:bg-sky-400 w-[10px]',
      },
    },
  ];

  // ... your existing code ...

  return (
    <div className="w-full">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setOpen(true);
          setStepKey(0);
        }}
        className="hover:bg-sky-200">
        Get to know us
      </Button>
      <div className="w-[10px]">
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </div>
    </div>
  );
};

export default AboutUsMobile;
