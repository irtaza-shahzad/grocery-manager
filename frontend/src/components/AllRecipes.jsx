import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, CircularProgress,
  Grid, Card, CardContent, TextField, Button
} from '@mui/material';
import axios from 'axios';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    axios.get('http://localhost:5000/api/recipes')
      .then((response) => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.description) {
      alert('Please fill in all fields');
      return;
    }

    axios.post('http://localhost:5000/api/recipes/add', {
      name: newRecipe.name,
      description: newRecipe.description
    })
      .then(() => {
        setNewRecipe({ name: '', description: '' });
        fetchRecipes();
        alert('Recipe added!');
      })
      .catch((err) => {
        console.error('Add recipe error:', err);
        alert('Failed to add recipe');
      });
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Box sx={{ mt: 5,marginTop:"100px",px:"10px" }}>
      {/* Add Recipe Form */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Add Recipe</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Recipe Name"
            name="name"
            value={newRecipe.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            value={newRecipe.description}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
          <Button
            variant="contained"
            onClick={handleAddRecipe}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Recipe
          </Button>
        </Box>
      </Paper>

      {/* Display Recipes */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        All Recipes
      </Typography>
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.RecipeID}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recipe.Description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllRecipes;
