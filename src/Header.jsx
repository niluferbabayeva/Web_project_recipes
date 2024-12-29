import React from 'react';
import './Header.css'; // For the header-specific styles

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
          <button className="get-started-button" onClick={scrollToFeaturedRecipes}>
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
