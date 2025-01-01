import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable'; // Import CreatableSelect component
import './style/EditRecipe.css';

const EditRecipe = () => {
  const { id } = useParams(); // Get the recipe ID from the URL params
  const navigate = useNavigate(); // Used to navigate back to the main page after saving
  const isEditing = !!id; // Determine if we are editing or creating
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ingredients: [], // ingredients is initially an array
    difficulty: 'Easy',
    tags: [],
    date: new Date().toLocaleString(),
  });

  // Predefined tags for the dropdown
  const predefinedTags = [
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Quick Meal', label: 'Quick Meal' },
    { value: 'Spicy', label: 'Spicy' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Gluten-Free', label: 'Gluten-Free' },
    { value: 'Healthy', label: 'Healthy' },
    { value: 'Comfort Food', label: 'Comfort Food' },
    { value: 'Low-Calorie', label: 'Low-Calorie' },
    { value: 'High-Protein', label: 'High-Protein' },
  ];

  const [tags, setTags] = useState(predefinedTags); // Existing tags list
  const [selectedTags, setSelectedTags] = useState([]); // User-selected tags

  useEffect(() => {
    if (isEditing) {
      // Fetch the recipe details by ID only if we are editing
      axios
        .get(`http://localhost:3000/recipes/${id}`)
        .then((response) => {
          setRecipe(response.data);
          // Prepopulate selected tags
          setSelectedTags(
            response.data.tags?.map((tag) => ({ value: tag, label: tag })) || []
          );
        })
        .catch((error) => {
          console.error('Error fetching recipe data:', error);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleCreateTag = (inputValue) => {
    const newTag = { value: inputValue, label: inputValue };
    setTags((prevTags) => [...prevTags, newTag]);
    setSelectedTags((prevSelected) => [...prevSelected, newTag]);
  };

  const handleSave = () => {
    const updatedRecipe = {
      ...recipe,
      // Ensure ingredients are always an array before saving
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join(', ') // Convert array to string for storage
        : recipe.ingredients, // If it's already a string, keep it
      tags: selectedTags.map((tag) => tag.value), // Save tags as plain values
      date: new Date().toLocaleString(), // Update last edited/created date
    };

    if (isEditing) {
      // Update existing recipe
      axios
        .put(`http://localhost:3000/recipes/${id}`, updatedRecipe)
        .then(() => {
          alert('Recipe updated successfully!');
          navigate('/'); // Redirect to the main page after saving
        })
        .catch((error) => {
          console.error('Error updating recipe:', error);
        });
    } else {
      // Create a new recipe
      axios
        .post(`http://localhost:3000/recipes`, updatedRecipe)
        .then(() => {
          alert('Recipe created successfully!');
          navigate('/'); // Redirect to the main page after saving
        })
        .catch((error) => {
          console.error('Error creating recipe:', error);
        });
    }
  };

  return (
    <div className="edit-recipe-container">
      <body>
      <div className="body-overlay"></div> {/* Overlay added here */}
      <h1>{isEditing ? 'Edit Recipe' : 'Create Recipe'}</h1>
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
        ></textarea>
        <input
          type="text"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="input-field"
        />
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
          value={Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}
          onChange={(e) =>
            handleChange({
              target: {
                name: 'ingredients',
                value: e.target.value,
              },
            })
          }
          placeholder="Ingredients (comma-separated)"
          className="input-field"
        ></textarea>
        <div>
          <label htmlFor="tags"><strong>Tags:</strong></label>
          <CreatableSelect
            id="tags"
            isMulti
            value={selectedTags}
            onChange={handleTagsChange}
            onCreateOption={handleCreateTag}
            options={tags}
            placeholder="Select or create tags..."
          />
        </div>
        <button onClick={handleSave} className="save-btn">
          {isEditing ? 'Save Changes' : 'Create Recipe'}
        </button>
        </div>
        </body>
    </div>
  );
};

export default EditRecipe;
