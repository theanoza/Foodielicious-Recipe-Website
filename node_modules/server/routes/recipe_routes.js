const express = require('express');
const router = express.Router();
const recipe_controller = require('../controllers/recipe_controller');

/** App routes */
router.get('/', recipe_controller.homepage);
router.get('/about', recipe_controller.about);
router.get('/categories', recipe_controller.exploreCategories);
router.get('/categories/:id', recipe_controller.exploreCategoriesById);
router.get('/recipe/:id', recipe_controller.exploreRecipes);

router.post('/searchRecipes', recipe_controller.searchRecipes);
router.get('/allRecipes', recipe_controller.allRecipes);
router.get('/addRecipes', recipe_controller.addRecipes);
router.post('/addRecipes', recipe_controller.addRecipesOnPost);

router.post('/deleteRecipes', recipe_controller.deleteRecipes);

module.exports = router;