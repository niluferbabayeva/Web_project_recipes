import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './style/featuredRecipe.css'; // Add CSS for styling hover effects
import axios from 'axios';

const FeaturedRecipe = ({ recipe, onDelete }) => {
  const navigate = useNavigate(); // Use useNavigate for navigation in React Router v6

  // Handle Delete action
  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/recipes/${recipe.id}`)
      .then(() => {
        onDelete(recipe.id); // Notify parent to remove the recipe from the list
      })
      .catch((error) => {
        console.error('Error deleting recipe:', error);
      });
  };

  // Redirect to the edit page when user clicks "Edit"
  const handleEditClick = () => {
    navigate(`/recipes/edit/${recipe.id}`); // Use navigate() for redirection
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-inner">
        <div className="recipe-image">
          <img src={recipe.imageUrl} alt={recipe.title} />
        </div>
        <div className="recipe-info">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-date">{new Date(recipe.date).toLocaleDateString()}</p>
          <div className="difficulty-level">
            <strong>Difficulty:</strong>
            <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </div>
          <a href={`/recipes/${recipe.id}`} className="view-btn">
            View Recipe
          </a>
        </div>
      </div>

      {/* Hover effect actions inside the recipe card */}
      <div className="recipe-card-actions">
        <button className="edit-btn" onClick={handleEditClick}>
          Edit
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default FeaturedRecipe;
