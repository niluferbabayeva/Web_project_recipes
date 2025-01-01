import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeaturedRecipe from '../components/FeaturedRecipe'; // Adjusted path to FeaturedRecipe.jsx
import ProjectCard from '../components/ProjectCard'; // Adjusted path to ProjectCard.jsx
import './style/HomePage.css';
import Header from '../components/Header'; // Adjusted path to Header.jsx

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recipes from the JSON server
    axios.get('http://localhost:3000/recipes')
      .then(response => {
        // Sort recipes by date (latest first) and limit to the top 4
        const sortedRecipes = response.data
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
          .slice(0, 4); // Get the top 4 recipes
        setRecipes(sortedRecipes);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Filter out the deleted recipe from the state
    setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== id));
  };

  // Define profile data
  const profilesData = [
    {
      name: 'Nilufar Babayeva',
      description: 'GitHub profile of the Contributor.',
      link: 'https://github.com/niluferbabayeva',
    },
    {
      name: 'Rahima Karimova',
      description: 'Github profile of the Contributor.',
      link: 'https://github.com/RahimaKarimova',
    },
    {
      name: 'Emil Hajiyev',
      description: 'Github profile of the Contributor.',
      link: 'https://github.com/EmilHajiyevWeb',
    },
  ];

  return (
    <div className="home-page">
      <Header />

      {/* Featured Recipes Section */}
      <section className="featured-recipes">
        <h2 id="featured-recipes">Latest Recipes</h2>
        <div className="recipes-list">
          {recipes.map(recipe => (
            <FeaturedRecipe
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete} // Pass handleDelete to FeaturedRecipe
            />
          ))}
        </div>
        <button 
          className="explore-more-button"
          onClick={() => navigate('/recipes')}
        >
          Explore More
        </button>
      </section>

      {/* Profiles Section */}
      <section className="profiles">
        <h2>Profiles of the Contributors</h2>
        <div className="profiles-list">
          {profilesData.map((profile, index) => (
            <ProjectCard 
              key={index} 
              project={profile} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

