import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__toggle" onClick={() => setOpen(!open)}>
        Menu
      </div>
      <div className={`navbar__content ${open ? 'navbar__content--open' : ''}`}>
        <button className="navbar__close" onClick={handleClose}>
          ×
        </button>
        <ul className="navbar__list">
          <li className="navbar__item">
            <a href="#" className="navbar__link">
              Project
            </a>
          </li>
          <li className="navbar__item">
            <a href="#" className="navbar__link">
              About
            </a>
          </li>
          <li className="navbar__item">
            <a href="#" className="navbar__link">
              Contact
            </a>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: white;
        }
        .navbar__toggle {
          display: block;
          padding: 1rem;
          cursor: pointer;
        }
        .navbar__content {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 80%;
          padding: 2rem;
          transform: translateX(-100%);
          transition: transform 300ms ease-out;
        }
        .navbar__content--open {
          transform: translateX(0);
        }
        .navbar__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: block;
          padding: 0.5rem;
          background-color: transparent;
          border: 0;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .navbar__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navbar__item {
          margin-bottom: 1rem;
        }
        .navbar__link {
          display: block;
          padding: 0.5rem 1rem;
          color: black;
          text-decoration: none;
        }
        @media (min-width: 768px) {
          .navbar__content {
            position: static;
            transform: translateX(0);
            width: auto;
            padding: 0;
          }
          .navbar__toggle {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
