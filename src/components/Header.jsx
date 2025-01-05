import React from 'react';
import { Link } from 'react-router-dom'; 
import './style/Header.css'; 

const Header = () => {
  const scrollToFeaturedRecipes = () => {
    const featuredRecipesSection = document.getElementById('featured-recipes');
    if (featuredRecipesSection) {
      featuredRecipesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-overlay">
        <div className="header-content">
          <h1 className="header-title">Welcome to the Recipe Manager App</h1>
          <p className="header-description">
            Manage, explore, and share your favorite recipes with ease. Our app allows you to create, view, edit, delete, and organize recipes in one place!
          </p>
          <div className="header-buttons">
            <button className="get-started-button" onClick={scrollToFeaturedRecipes}>
              Get Started
            </button>
            <Link to="/contact" className="contact-button">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

