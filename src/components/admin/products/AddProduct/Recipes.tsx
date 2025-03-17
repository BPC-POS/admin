import React from "react";
import { Grid, TextField } from "@mui/material";

interface RecipesProductProps {
  recipes: {
    ingredients?: string;
    instructions?: string;
  };
  onChange: (recipes: { ingredients: string; instructions: string }) => void;
}

const RecipesProduct: React.FC<RecipesProductProps> = ({ recipes, onChange }) => {
  const handleChange = (field: 'ingredients' | 'instructions') => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ingredients: recipes.ingredients || '',
      instructions: recipes.instructions || '',
      [field]: e.target.value
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth 
          label="Nguyên liệu" 
          multiline 
          rows={3} 
          value={recipes?.ingredients || ''}
          onChange={handleChange('ingredients')}
          name="ingredients" 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
          placeholder="Nhập danh sách nguyên liệu..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth 
          label="Hướng dẫn chế biến" 
          multiline 
          rows={4} 
          value={recipes?.instructions || ''}
          onChange={handleChange('instructions')}
          name="instructions" 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
          placeholder="Nhập các bước chế biến..."
        />
      </Grid>
    </Grid>
  );
};

export default RecipesProduct;