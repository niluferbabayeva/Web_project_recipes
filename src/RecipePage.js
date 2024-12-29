import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipePage.css';

const RecipePage = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recipe by ID
    axios
      .get(`http://localhost:3000/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
      })
      .catch((error) => {
        console.log('Error fetching the recipe:', error);
      });
  }, [id]);

  if (!recipe) {
    return <div className="loading">Loading recipe...</div>;
  }

  return (
    <div className="recipe-page">
      <div className="recipe-header">
        <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
        <h1 className="recipe-title">{recipe.title}</h1>
        <p className="recipe-description">{recipe.description}</p>
      </div>

      <section className="recipe-section">
        <h2>Ingredients</h2>
        <ul className="recipe-ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className="recipe-section">
        <h2>Preparation Steps</h2>
        <ol className="recipe-steps">
          {recipe.steps && recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="recipe-section">
        <h2>Details</h2>
        <p>
          <strong>Tags:</strong> {recipe.tags ? recipe.tags.join(', ') : 'No tags available'}
        </p>
        <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
        <p><strong>Last Updated:</strong> {recipe.date}</p>
      </section>

      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default RecipePage;
