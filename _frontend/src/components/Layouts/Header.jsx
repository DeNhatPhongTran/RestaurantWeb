import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import '../../styles/HeaderStyle.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useApi();
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <h1 className="logo__text">TasteGood</h1>
        </Link>

        <button 
          className="header__toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span>☰</span>
        </button>

        <nav className={`header__nav ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav__link" onClick={closeMenu}>Trang chủ</Link>
          <Link to="/menu" className="nav__link" onClick={closeMenu}>Thực đơn</Link>
          <a href="/reservation" className="nav__link" onClick={closeMenu}>Đặt bàn</a>
          <a href="#contact" className="nav__link" onClick={closeMenu}>Liên hệ</a>
          
          {user ? (
            <div className="nav__user-menu">
              <button 
                className="nav__user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.fullname || user.username} ▼
              </button>
              {userMenuOpen && (
                <div className="user__dropdown">
                  <Link to="/profile" className="dropdown__item" onClick={closeMenu}>
                    Profile
                  </Link>
                  <button 
                    className="dropdown__item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav__btn-login" onClick={closeMenu}>
              Nhân viên
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
