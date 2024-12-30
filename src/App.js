import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RecipePage from './RecipePage';
import RecipeListPage from './RecipeListPage'; // For full list of recipes
import EditRecipe from './EditRecipe';
// import NotFoundPage from './NotFoundPage'; // Optional 404 page

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Full Recipe List Page */}
        <Route path="/recipes" element={<RecipeListPage />} />

        {/* Single Recipe Page */}
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/recipes/edit/:id" element={<EditRecipe />} />
        <Route path="/create" element={<EditRecipe />} />

        {/* Fallback Route (404 Page) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
