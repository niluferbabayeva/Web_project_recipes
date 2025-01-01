import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedRecipe from '../components/FeaturedRecipe';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable'; // Import CreatableSelect for dynamic tags
import './style/RecipeListPage.css';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [allTags, setAllTags] = useState([]); // Store all unique tags here
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all recipes
    axios
      .get('http://localhost:3000/recipes')
      .then((response) => {
        setRecipes(response.data);

        // Extract unique tags from recipes and set them
        const uniqueTags = new Set();
        response.data.forEach((recipe) => {
          recipe.tags?.forEach((tag) => uniqueTags.add(tag));
        });
        // Set the tags in the form of { value: tag, label: tag }
        setAllTags(
          Array.from(uniqueTags).map((tag) => ({
            value: tag,
            label: tag,
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleDelete = (id) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
  };

  const filteredRecipes = recipes
    .filter((recipe) => {
      const queryLower = searchQuery.toLowerCase();
      return (
        recipe.title.toLowerCase().includes(queryLower) ||
        recipe.description.toLowerCase().includes(queryLower) ||
        (Array.isArray(recipe.ingredients)
          ? recipe.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(queryLower)
            )
          : recipe.ingredients.toLowerCase().includes(queryLower))
      );
    })
    .filter((recipe) => {
      // If any filter tag is selected, check if the recipe has that tag
      if (filterTag.length > 0) {
        return filterTag.every((tag) => recipe.tags?.includes(tag.value));
      }
      return true;
    })
    .filter((recipe) => {
      // Filter by difficulty (case-insensitive)
      return difficulty ? recipe.difficulty.toLowerCase() === difficulty.toLowerCase() : true;
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'date') return new Date(b.date) - new Date(a.date);
      if (sortOption === 'difficulty') return a.difficulty.localeCompare(b.difficulty);
      return 0;
    });

  return (
    <div className="recipe-list-page">
      <div className="controls">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter by Tags using CreatableSelect */}
        <div>
          <strong>Filter by Tags:</strong>
          <CreatableSelect
            isMulti
            value={filterTag}
            onChange={setFilterTag}
            options={allTags}
            placeholder="Select or create tags..."
            className="tag-select"
          />
        </div>

        {/* Difficulty Filter */}
        <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
          <option value="">All Difficulty Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Sort Options */}
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="date">Last Updated</option>
          <option value="difficulty">Difficulty</option>
        </select>

        {/* Create Recipe Button */}
        <button onClick={() => navigate('/create')}>Create Recipe</button>
      </div>

      <div className="recipes-container">
        {filteredRecipes.map((recipe) => (
          <FeaturedRecipe
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
