import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RecipeListPage from './pages/RecipeListPage'; // For full list of recipes
import EditRecipe from './pages/EditRecipe';
import ContactPage from './pages/ContactPage'; // Import the ContactPage component

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

        {/* Contact Page */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Fallback Route (404 Page) */}
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Optional */}
      </Routes>
    </Router>
  );
}

export default App;



