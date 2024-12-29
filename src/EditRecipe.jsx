import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditRecipe.css';

const EditRecipe = () => {
  const { id } = useParams(); // Get the recipe ID from the URL params
  const navigate = useNavigate(); // Used to navigate back to the main page after saving
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    // Fetch the recipe details by ID
    axios
      .get(`http://localhost:3000/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipe data:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedRecipe = {
      ...recipe,
      lastEditedDate: new Date().toLocaleString(), // Update the last edited date
    };

    axios
      .put(`http://localhost:3000/recipes/${id}`, updatedRecipe)
      .then(() => {
        alert('Recipe updated successfully!');
        navigate('/'); // Redirect to the main page after saving
      })
      .catch((error) => {
        console.error('Error updating recipe:', error);
      });
  };

  if (!recipe) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-recipe-container">
      <h1>Edit Recipe</h1>
      <div className="form-container">
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          className="input-field"
        />
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          placeholder="Recipe Description"
          className="input-field"
        />
        <input
          type="text"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="input-field"
        />
        
        {/* Dropdown for Difficulty Level */}
        <select
          name="difficulty"
          value={recipe.difficulty}
          onChange={handleChange}
          className="input-field"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <textarea
          name="ingredients"
          value={recipe.ingredients.join(', ')}
          onChange={(e) =>
            handleChange({
              target: {
                name: 'ingredients',
                value: e.target.value
                  .split(',')
                  .map((ingredient) => ingredient.trim())
                  .filter((ingredient) => ingredient),
              },
            })
          }
          placeholder="Ingredients (comma-separated)"
          className="input-field"
        />
        
        <button onClick={handleSave} className="save-btn">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditRecipe;
