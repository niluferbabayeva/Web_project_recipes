import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedRecipe from './FeaturedRecipe'; // Import the FeaturedRecipe component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential redirects
import './RecipeListPage.css';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();  // Use useNavigate hook

  useEffect(() => {
    // Fetch all recipes
    axios
      .get('http://localhost:3000/recipes')
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleDelete = (id) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
  };

  const filteredRecipes = recipes
    .filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .filter((recipe) => (filterTag ? recipe.tags.includes(filterTag) : true))
    .filter((recipe) => (difficulty ? recipe.difficulty.toLowerCase() === difficulty.toLowerCase() : true)) // Fixed case-sensitive comparison
    .sort((a, b) => {
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'date') return new Date(b.date) - new Date(a.date);
      if (sortOption === 'difficulty') return a.difficulty.localeCompare(b.difficulty);
      return 0;
    });

  return (
    <div className="recipe-list-page">
      <div className="controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setFilterTag(e.target.value)} value={filterTag}>
          <option value="">All Tags</option>
          <option value="Dessert">Dessert</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Quick Meal">Quick Meal</option>
        </select>
        <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
          <option value="">All Difficulty Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="date">Last Updated</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      <div className="recipes-container">
        {filteredRecipes.map((recipe) => (
          <FeaturedRecipe
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDelete} // Pass onDelete function to delete the recipe
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
