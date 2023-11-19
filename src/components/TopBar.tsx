import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
  path: string;
}

const sections: (Section | null)[] = [
  { id: 'skills', title: 'Skills', path: '/skills' },
  { id: 'projects', title: 'Projects', path: '/projects' },
  { id: 'careers', title: 'Careers', path: '/careers' },
  { id: 'contact', title: 'Contact', path: '/contact' },
  null,
  { id: 'blog', title: 'Blog', path: 'https://blog.jisub.kim' },
  { id: 'github', title: 'Github', path: 'https://github.com/kimjisub' },
];

const blur = 'bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg';

const TopBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 w-full h-16 md:h-16 z-10  ${blur}`}>
      <div
        className={`h-16 max-w-5xl mx-auto px-6 flex justify-between items-center `}>
        <div className="flex items-center w-auto flex-grow justify-between">
          <Link to="/" className="text-xl font-bold mr-6 flex items-center">
            <img src="/logo192.png" alt="logo" width={36} className="mr-4" />
            김지섭
          </Link>

          {/* 햄버거 메뉴 버튼 (모바일) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl md:hidden ">
            메뉴 {/* 아이콘 또는 텍스트로 표현 */}
          </button>

          {/* 네비게이션 링크 (데스크탑 & 모바일) */}
          <ul
            className={[
              `absolute md:relative md:flex`,
              `top-16 md:top-0`,
              `bg-white md:bg-transparent`,
              `w-screen md:w-auto `,
              `left-0  md:flex`,
              `md:w-auto md:flex-grow`,
              `transition-transform ${
                isMenuOpen ? '' : '-translate-x-full opacity-0 md:opacity-100'
              } md:translate-x-0`,
            ].join(' ')}>
            {sections.map(section =>
              section ? (
                <li
                  key={section.id}
                  className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none ${
                    location.pathname === section.path
                      ? 'text-blue-500 font-bold'
                      : 'text-gray-600'
                  }`}>
                  <Link to={section.path} onClick={() => setIsMenuOpen(false)}>
                    {section.title}
                  </Link>
                </li>
              ) : (
                <li className="md:flex-grow" />
              ),
            )}
          </ul>
        </div>
        {/* 
        <ul className="hidden md:flex items-center">
          <li className="px-4">
            <a href="https://github.com/kimjisub" target="_" rel="noreferrer">
              Github
            </a>
          </li>
          <li className="px-4">
            <a href="https://blog.jisub.kim" target="_top" rel="noreferrer">
              Blog
            </a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
};

export default TopBar;
