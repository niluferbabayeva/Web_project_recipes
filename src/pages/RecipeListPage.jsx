import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import FeaturedRecipe from "../components/FeaturedRecipe";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

// Import from react-beautiful-dnd
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

// Import your CSS
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

  // For pagination vs. infinite scrolling
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(9);
  const [paginationMode, setPaginationMode] = useState(false); // default to infinite scrolling = false?

  const navigate = useNavigate();
  const sentinelRef = useRef(null);

  // ============ FETCH DATA ============
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/recipes");
      // Sort them by 'order' (if present) for last arrangement
      const sortedByOrder = [...response.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setRecipes(sortedByOrder);

      // Gather all unique tags
      const uniqueTags = new Set();
      response.data.forEach((recipe) => {
        if (recipe.tags) {
          recipe.tags.forEach((tag) => uniqueTags.add(tag));
        }
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
  }, []);

  // ============ DELETE ============
  const handleDelete = (id) => {
    setRecipes((prevRecipes) => prevRecipes.filter((r) => r.id !== id));
    // If you want to persist the deletion:
    // axios.delete(`http://localhost:3000/recipes/${id}`)
    //   .catch((err) => console.error("Error deleting recipe:", err));
  };

  // ============ SELECT FOR SHARE ============
  const handleCheckboxChange = (recipe) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipe)
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  // ============ SHARE (EMAIL) ============
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
      .send("service_v52xam9", "template_u43zt9n", emailParams, "AIAe-bsHafs6zrey3")
      .then(
        () => alert("Recipes shared successfully!"),
        (error) => {
          console.error("Error sending email:", error.text);
          alert("Failed to share recipes. Please try again.");
        }
      );
  };

  // ============ FILTER & SORT ============
  const filteredAndSortedRecipes = React.useMemo(() => {
    let temp = [...recipes];

    // 1) Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter((r) => {
        const matchTitle = r.title?.toLowerCase().includes(q);
        const matchDesc = r.description?.toLowerCase().includes(q);

        let matchIng = false;
        if (Array.isArray(r.ingredients)) {
          matchIng = r.ingredients.some((ing) => ing.toLowerCase().includes(q));
        } else if (typeof r.ingredients === "string") {
          matchIng = r.ingredients.toLowerCase().includes(q);
        }
        return matchTitle || matchDesc || matchIng;
      });
    }

    // 2) Filter by tags
    if (filterTag.length > 0) {
      temp = temp.filter((recipe) =>
        filterTag.every((tag) => recipe.tags?.includes(tag.value))
      );
    }

    // 3) Filter by difficulty
    if (difficulty) {
      temp = temp.filter(
        (r) => r.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // 4) Sort
    switch (sortOption) {
      case "title":
        temp.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        // newest first
        temp.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "difficulty":
        temp.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
        break;
      case "tags":
        // Sort by first tag if you want
        temp.sort((a, b) => {
          const aTag = (a.tags?.[0] || "").toLowerCase();
          const bTag = (b.tags?.[0] || "").toLowerCase();
          return aTag.localeCompare(bTag);
        });
        break;
      default:
        break;
    }

    return temp;
  }, [recipes, searchQuery, filterTag, difficulty, sortOption]);

  // ============ PAGINATION / INFINITE SCROLL ============
  const displayedRecipes = paginationMode
    ? filteredAndSortedRecipes.slice(
        (currentPage - 1) * recipesPerPage,
        currentPage * recipesPerPage
      )
    : filteredAndSortedRecipes.slice(0, currentPage * recipesPerPage);

  const totalPages = Math.ceil(filteredAndSortedRecipes.length / recipesPerPage);

  // If user changes search/filter/difficulty, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTag, difficulty]);

  // Automatic Infinite Scroll using IntersectionObserver
  useEffect(() => {
    if (paginationMode) return; // Only do infinite scroll in !paginationMode

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [paginationMode]);

  // ============ DRAG & DROP HANDLERS ============
  const onDragEnd = async (result) => {
    // If user drops outside the list
    if (!result.destination) return;

    // reorder local array
    const newOrderArray = Array.from(recipes);
    const [movedItem] = newOrderArray.splice(result.source.index, 1);
    newOrderArray.splice(result.destination.index, 0, movedItem);

    // update 'order' field
    const updated = newOrderArray.map((r, idx) => ({ ...r, order: idx }));
    setRecipes(updated);

    // persist changes
    try {
      for (const r of updated) {
        await axios.put(`http://localhost:3000/recipes/${r.id}`, r);
      }
      console.log("Order updated on server");
    } catch (error) {
      console.error("Error updating order on server:", error);
    }
  };

  return (
    <div className="recipe-list-page">
      {/* Toggle: Pagination vs. Infinite Scrolling */}
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

      {/* Controls (Search, Filter, Sort) */}
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

        <select
          onChange={(e) => setDifficulty(e.target.value)}
          value={difficulty}
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort By (Drag/Drop by default)</option>
          <option value="title">Title</option>
          <option value="date">Last Updated</option>
          <option value="difficulty">Difficulty</option>
          <option value="tags">Tags</option>
        </select>

        <button onClick={() => navigate("/create")}>Create Recipe</button>
      </div>

      {/* Share / Email Section */}
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

      {/* DRAG & DROP CONTEXT: Single-Column Vertical List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="recipes-droppable" direction="vertical">
          {(provided) => (
            <div
              className="recipes-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {displayedRecipes.map((recipe, index) => (
                <Draggable
                  key={recipe.id}
                  draggableId={String(recipe.id)}
                  index={index}
                >
                  {(draggableProvided) => (
                    <div
                      className="recipe-card"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(recipe)}
                        checked={selectedRecipes.some((r) => r.id === recipe.id)}
                      />
                      <FeaturedRecipe recipe={recipe} onDelete={handleDelete} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Only show sentinel if infinite scrolling is active */}
              {!paginationMode && (
                <div
                  ref={sentinelRef}
                  style={{ height: "30px", backgroundColor: "transparent" }}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Pagination (if toggled) */}
      {paginationMode && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)} // Go to first page
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={currentPage === pageNum ? "active" : ""}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(totalPages)} // Go to last page
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeListPage;
