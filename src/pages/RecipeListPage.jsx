import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import FeaturedRecipe from "../components/FeaturedRecipe";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "./style/RecipeListPage.css";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(10);
  const [paginationMode, setPaginationMode] = useState(true); // Toggle for pagination/infinite scrolling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recipes");
        setRecipes(response.data);

        const uniqueTags = new Set();
        response.data.forEach((recipe) => {
          recipe.tags?.forEach((tag) => uniqueTags.add(tag));
        });
        setAllTags(
          Array.from(uniqueTags).map((tag) => ({
            value: tag,
            label: tag,
          }))
        );
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = (id) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
  };

  const handleCheckboxChange = (recipe) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipe)
        ? prevSelected.filter((r) => r.id !== recipe.id)
        : [...prevSelected, recipe]
    );
  };

  const shareRecipes = () => {
    if (selectedRecipes.length === 0) {
      alert("Please select recipes to share.");
      return;
    }

    if (!userEmail) {
      alert("Please enter your email address.");
      return;
    }

    const emailParams = {
      to_email: userEmail,
      recipes: JSON.stringify(selectedRecipes, null, 2),
    };

    emailjs
      .send(
        "service_v52xam9",
        "template_u43zt9n",
        emailParams,
        "AIAe-bsHafs6zrey3"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          alert("Recipes shared successfully!");
        },
        (error) => {
          console.error("Error sending email:", error.text);
          alert("Failed to share recipes. Please try again.");
        }
      );
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
      if (filterTag.length > 0) {
        return filterTag.every((tag) => recipe.tags?.includes(tag.value));
      }
      return true;
    })
    .filter((recipe) => {
      return difficulty ? recipe.difficulty.toLowerCase() === difficulty.toLowerCase() : true;
    })
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "date") return new Date(b.date) - new Date(a.date);
      if (sortOption === "difficulty") return a.difficulty.localeCompare(b.difficulty);
      return 0;
    });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  const displayedRecipes = paginationMode
    ? filteredRecipes.slice(
        (currentPage - 1) * recipesPerPage,
        currentPage * recipesPerPage
      )
    : filteredRecipes.slice(0, currentPage * recipesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="recipe-list-page">
      <div className="toggle-mode">
        <label>
          <input
            type="radio"
            name="mode"
            value="pagination"
            checked={paginationMode}
            onChange={() => setPaginationMode(true)}
          />
          Pagination
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="infinite-scrolling"
            checked={!paginationMode}
            onChange={() => setPaginationMode(false)}
          />
          Infinite Scrolling
        </label>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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

        <button onClick={() => navigate("/create")}>Create Recipe</button>
      </div>

      <div className="share-section">
        <input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="email-input"
        />
        <button onClick={shareRecipes}>Share Selected Recipes</button>
      </div>

      <div className="recipes-container">
        {displayedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(recipe)}
            />
            <FeaturedRecipe recipe={recipe} onDelete={handleDelete} />
          </div>
        ))}
      </div>

      {paginationMode && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo; First
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={currentPage === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last &raquo;
          </button>
        </div>
      )}
      {!paginationMode && <p>Loading more recipes...</p>}
    </div>
  );
};

export default RecipeListPage;
