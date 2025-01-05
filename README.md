
# Recipe Management App

## Introduction

This is a Recipe Management web application built using **React** for the front end and **JSON-Server** for the back end. It allows users to create, edit, delete, view, and manage recipes. Additional functionalities include drag-and-drop reordering, search and filtering, pagination or infinite scrolling, and a contact form.

---

## Features

1. **CRUD Operations**:
   - Create, read, update, and delete recipes.
   - Recipes include fields such as title, description, image URL, ingredients, preparation steps, tags, difficulty, and last updated date.

2. **Search and Filter**:
   - Search recipes by title, description, or ingredients.
   - Filter recipes by tags and difficulty.

3. **Pagination or Infinite Scrolling**:
   - Users can toggle between pagination and infinite scrolling for navigating recipes.

4. **Drag-and-Drop Reordering**:
   - Recipes can be reordered via drag-and-drop. The new order is persisted to the JSON-Server.

5. **Share Recipes**:
   - Users can select recipes and share them via email using EmailJS.

6. **Contact Form**:
   - A contact form to collect messages, stored in JSON-Server.

---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/niluferbabayeva/Web_project_recipes.git
   cd Web_project_recipes
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run JSON-Server**:
4. 
   - Start the server:
     ```bash
     json-server --watch db.json --port 3000
     ```

5. **Run the React App**:
   ```bash
   npm start
   ```

---

## Key Functionalities

### Create / Edit Recipes
- Users can create a new recipe or edit an existing one through a form.
- Form fields include:
  - Title, description, image URL, ingredients, preparation steps, tags, difficulty.
- Data is saved to JSON-Server via **POST** or **PUT** requests.

### Search and Filter
- Search by:
  - Recipe title, description, or ingredients.
- Filter by:
  - Tags and difficulty levels.

### Pagination and Infinite Scrolling
- Toggle between the two modes:
  - **Pagination**: Recipes are displayed in pages.
  - **Infinite Scrolling**: Recipes load dynamically as the user scrolls.

### Drag-and-Drop Reordering
- Recipes can be reordered via drag-and-drop using `react-beautiful-dnd`.
- Changes are persisted to the server.

### Share Recipes
- Select recipes via checkboxes and share their details via email using EmailJS.

### Contact Form
- Users can submit their name, email, and message. Messages are saved in JSON-Server.

---

## JSON-Server Endpoints

1. **Recipes**:
   - `GET /recipes` - Retrieve all recipes.
   - `POST /recipes` - Create a new recipe.
   - `PUT /recipes/:id` - Update an existing recipe.
   - `DELETE /recipes/:id` - Delete a recipe.

2. **Messages**:
   - `POST /messages` - Save contact form messages.

---

## Technologies Used

- **React**: Front-end library.
- **JSON-Server**: Simple REST API for back end.
- **Axios**: For HTTP requests.
- **React Beautiful DnD**: For drag-and-drop functionality.
- **EmailJS**: For email sharing.

---

## Contact

For any issues or questions, please reach out via the contact form or open an issue in the repository.
