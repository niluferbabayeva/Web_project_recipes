import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeaturedRecipe from '../components/FeaturedRecipe';
import ProjectCard from '../components/ProjectCard';
import { projectsData } from '../projectData';
import './style/HomePage.css';
import Header from '../components/Header';

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

  // Handle the deletion of a recipe
  const handleDelete = (id) => {
    // Filter out the deleted recipe from the state
    setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== id));
  };

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

      {/* Past Projects Section */}
      <section className="projects">
        <h2>Past Projects</h2>
        <div className="projects-list">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
