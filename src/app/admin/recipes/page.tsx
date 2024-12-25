'use client';
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  Button,
  Typography,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RecipeList from '@/components/admin/recipes/RecipeList';
import RecipeModal from '@/components/admin/recipes/RecipeModal';
import { Recipe } from '@/types/recipe';

const defaultRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Cà Phê Sữa Tươi',
    type: 'drink',
    ingredients: [
      { name: 'Cà phê', amount: 30, unit: 'ml' },
      { name: 'Sữa tươi', amount: 100, unit: 'ml' },
      { name: 'Sữa đặc', amount: 20, unit: 'ml' },
      { name: 'Đá', amount: 100, unit: 'g' }
    ],
    instructions: '1. Pha cà phê\n2. Cho sữa đặc vào ly\n3. Thêm đá\n4. Đổ sữa tươi\n5. Cuối cùng đổ cà phê'
  }
];

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, { ...recipe, id: recipes.length + 1 }]);
    setIsModalOpen(false);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
    setEditingRecipe(null);
    setIsModalOpen(false);
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  return (
    <Box className="min-h-screen" sx={{ 
      background: 'linear-gradient(to right, #2C3E50, #3498DB)',
      p: 3
    }}>
      <Box className="font-poppins">
        <Card sx={{ 
          boxShadow: 3, 
          borderRadius: 4
        }}>
          <Box sx={{
            background: 'linear-gradient(to right, #2C3E50, #3498DB)',
            p: 3,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          }}>
            <Typography variant="h3" component="h1" sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              
            }}
            className='font-poppins'>
              Quản lý công thức
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                bgcolor: 'white',
                color: '#2C3E50',
                '&:hover': {
                  bgcolor: 'grey.100'
                },
                border: 'none'
              }}
            >
              Thêm công thức mới
            </Button>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <RecipeList 
              recipes={recipes}
              onEdit={(recipe) => {
                setEditingRecipe(recipe);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteRecipe}
            />

            <RecipeModal
              open={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingRecipe(null);
              }}
              onSubmit={editingRecipe ? handleEditRecipe : handleAddRecipe}
              editRecipe={editingRecipe}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RecipesPage;
