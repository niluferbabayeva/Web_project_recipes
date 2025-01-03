import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import './style/EditRecipe.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // If you want separate date fields, e.g. createdAt vs updatedAt:
  // But for simplicity, we'll keep using "date" as in your code
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ingredients: [],
    difficulty: 'Easy',
    tags: [],
    date: new Date().toLocaleString(),
    steps: [],
  });

  // Predefined tags
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

  const [tags, setTags] = useState(predefinedTags);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (isEditing) {
      axios.get(`http://localhost:3000/recipes/${id}`)
        .then((res) => {
          setRecipe(res.data);
          setSelectedTags(
            res.data.tags?.map((tag) => ({ value: tag, label: tag })) || []
          );
        })
        .catch((error) => console.error('Error fetching recipe:', error));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleCreateTag = (inputValue) => {
    const newTag = { value: inputValue, label: inputValue };
    setTags((prev) => [...prev, newTag]);
    setSelectedTags((prev) => [...prev, newTag]);
  };

  const handleSave = async () => {
    const updatedRecipe = {
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join(', ')
        : recipe.ingredients,
      tags: selectedTags.map((tag) => tag.value),
      date: new Date().toLocaleString(),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/recipes/${id}`, updatedRecipe);
        alert('Recipe updated successfully!');
      } else {
        await axios.post('http://localhost:3000/recipes', updatedRecipe);
        alert('Recipe created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <div className="edit-recipe-container">
      <div className="body-overlay"></div>
      <h1>{isEditing ? 'Edit Recipe' : 'Create Recipe'}</h1>
      <div className="form-container">
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          className="input-field"
          required
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
          value={
            Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join(', ')
              : recipe.ingredients
          }
          onChange={(e) => handleChange({
            target: { name: 'ingredients', value: e.target.value }
          })}
          placeholder="Ingredients (comma-separated)"
          className="input-field"
        />

        {/* Steps if needed */}
        <textarea
          name="steps"
          value={
            Array.isArray(recipe.steps)
              ? recipe.steps.join('\n')
              : recipe.steps
          }
          onChange={(e) => handleChange({
            target: { name: 'steps', value: e.target.value.split('\n') }
          })}
          placeholder="Preparation Steps (one per line)"
          className="input-field"
        />

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
    </div>
  );
};

export default EditRecipe;
