import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
  path: string;
}

const sections: Section[] = [
  { id: 'skills', title: 'Skills', path: '/skills' },
  { id: 'projects', title: 'Projects', path: '/projects' },
  { id: 'careers', title: 'Careers', path: '/careers' },
  { id: 'contact', title: 'Contact', path: '/contact' },
];

const TopBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white h-16 z-10 bg-opacity-60 backdrop-filter backdrop-blur-lg">
      <div className="max-w-5xl mx-auto flex justify-between items-center h-full">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold mr-6 flex items-center">
            <img src="/logo192.png" alt="logo" width={36} className="mr-4" />
            김지섭
          </Link>
          <ul className="flex items-center">
            {sections.map(section => (
              <li
                key={section.id}
                className={`px-4 py-2 cursor-pointer ${
                  location.pathname === section.path
                    ? 'text-blue-500 font-bold'
                    : 'text-gray-600'
                }`}>
                <Link to={section.path}>{section.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex items-center">
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
          {/* <Web
            className="cursor-pointer mx-2"
            onClick={() => (window.location.href = 'https://blog.example.com')}
          />
          <GitHub
            className="cursor-pointer mx-2"
            onClick={() => (window.location.href = 'https://github.com')}
          /> */}
        </ul>
      </div>
    </nav>
  );
};

export default TopBar;
