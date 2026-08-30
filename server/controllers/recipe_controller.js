require('../models/database');
const { error } = require('console');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/** GET/ Homepage */
exports.homepage = async(req, res) => {

    try {
        const limit_number = 5;
        const categories = await Category.find({}).limit(limit_number);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limit_number);
        const BreakfastBrunchRecipes = await Recipe.find({'category': 'Breakfast & Brunch Recipes'});
        const LunchRecipes = await Recipe.find({'category': 'Lunch Recipes'});
        const DinnerRecipes = await Recipe.find({'category': 'Dinner Recipes'});
        const food = {latest, BreakfastBrunchRecipes, LunchRecipes, DinnerRecipes};
        res.render('index', { title: 'Foodielicious - Home', categories, food});
    } catch (error) {
        res.status(500).send({message: error.message || "There was an error" });
    }
    
}

/** GET / About */
exports.about = async (req, res) => {
  const locals = {
    title: "Welcome to Foodielicious!!",
  }
  res.render('about', { title: 'Foodielicious - Home' });
}

/** GET/ categories */
exports.exploreCategories = async(req, res) => {

  try {
      const limit_number = 50;
      const categories = await Category.find({}).limit(limit_number);
      res.render('categories', { title: 'Foodielicious - Categories', categories});
  } catch (error) {
      res.status(500).send({message: error.message || "There was an error" });
  }
  
}

/** GET/ categories/ :id */
exports.exploreCategoriesById = async(req, res) => {

  try {
      let categoryId = req.params.id;
      const limit_number = 50;
      const categoryById = await Recipe.find({'category': categoryId}).limit(limit_number);
      res.render('categories', { title: 'Foodielicious - Categories', categoryById});
  } catch (error) {
      res.status(500).send({message: error.message || "There was an error" });
  }
  
}

/** GET/ recipe/ :id */
exports.exploreRecipes = async(req,res) => {

  try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Foodielicious - Recipe', recipe});
  } catch (error) {
      res.status(500).send({message: error.message || "There was an error" });
  }
  
}

/** POST/ search-recipes */
exports.searchRecipes = async(req, res) => {

  try {
      let search_term = req.body.search_term;
      let recipe = await Recipe.find({$text: {$search: search_term, $diacriticSensitive: true}});
      res.render('recipe', { title: 'Foodielicious - Recipe', recipe});
  } catch (error) {
      res.status(500).send({message: error.message || "There was an error" });
  }
  
}

/** GET/ All-recipes */
exports.allRecipes = async(req, res) => {

  try {
      const limit_number = 50;
      const recipe = await Recipe.find({}).sort({_id: -1}).limit(limit_number);
      res.render('AllRecipes', { title: 'Foodielicious - All Recipes', recipe});
  } catch (error) {
      res.status(500).send({message: error.message || "There was an error" });
  }
  
}

/** GET/ addRecipe */
exports.addRecipes = async (req, res) => {
  const infoErrorsObject = req.flash('infoErrors');
  const infoAddObject = req.flash('infoAdd');
  res.render('addRecipes', {title: 'Foodielicious - Add Recipe', infoErrorsObject, infoAddObject});
}

/** POST/ addRecipe */
exports.addRecipesOnPost = async(req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('There are no files where uploaded.');
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      });

    }

    const newRecipe = new Recipe ({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
      preparation: req.body.preparation,
      cooking: req.body.cooking,
      calories: req.body.calories
    });

    await newRecipe.save();
    req.flash('infoAdd', 'Recipe added.' );
    res.redirect('/addRecipes');
  } catch {
    req.flash('infoErrors', error);
    res.redirect('/addRecipes');
  }
}

/** POST/ Delete Recipes*/ 
exports.deleteRecipes = async(req, res) => {
  const recipeId = req.body.recipeId;
  Recipe.findById(recipeId).then((recipe) => {
    return recipe.destroy();
  })
  .then(() => {
    res.redirect('/recipes');
  })
  .catch((error) => {
    console.log(error);
  });
};

/** GET/ Edit Recipes*/
exports.getEditRecipes = async(req, res) => {
  const recipeId = req.params.recipeId;

  let viewData = {
    edit: true,
    pageTitle: 'Edit Recipe'
  };

  Recipe.findById(recipeId).then((recipe) => {
    viewData = { ...{ recipe }, ...viewData };
      return Category.findAll({ attributes: ['id', 'name'] });
    })
    .then((categories) => {
      viewData = { ...{ categories }, ...viewData };
      res.render('AddRecipe', viewData);
    })
    .catch((error) => {
      console.log(error);
    });
};

/** POST/ Edit Recipes*/



/*async function insertDymmyRecipeData(){
   try {
        await Recipe.insertMany([
       { 
           "name": "Avocado Toast",
           "description": "\n   1. Place a frying pan over high heat and add 2-3 tablespoons of olive oil. \n   2. Put the sandwich bread slices into the pan and sauté them for 1-2 minutes on both sides, until golden. Remove and set them aside.  \n   3. Peel the avocados and add them into a bowl. Press them well with a fork until they are mashed.  \n   4. Add the lime juice, salt, pepper, 3 tablespoons of olive oil, and mix.   \n   5. Spread the avocado over the bread slices and set them aside.  \n   6. Place a pot with water and 1-2 tablespoons of the vinegar over medium heat and let it simmer.   \n   7. Divide the vinegar among 2 bowls and put an egg in each one.  \n   8. Swirl the water of the pot to make a whirlpool and put one of the eggs in. Once it gets its shape, add the second egg. Cook them for 2-3 minutes, then remove them and transfer to paper towels.  \n   9. Place the eggs over the avocado and add salt, pepper, the cherry tomatoes cut in half, coriander, and 1 tablespoon of olive oil.  \n   10. Serve with lime slices and finely chopped chili pepper. ",
           "email": "test@gmail.com",
           "ingredients": [
            "2 slices sandwich bread",
            "7 tablespoons olive oil",
            "3 avocados",
            "lime juice of 1 lime",
            "salt",
            "pepper",
            "60 g vinegar from white wine",
            "2 eggs",
            "50 g cherry tomatoes",
            "1 tablespoon coriander",
         ],
          "category": "Breakfast & Brunch Recipes", 
          "image": "avocadoToast.jpg"
        },
        { 
           "name": "Pork Roast Stuffed with Feta",
            "description": " 1. Preheat the oven to 180°C (350°F) set to fan. \n 2. Spread a sheet of aluminum foil on your worktop, and then spread a piece of parchment paper over it. \n 3. Sprinkle with salt and pepper, and transfer the pork to the parchment paper, placing its large side in front of you. \n 4. Use a knife to open it up lengthwise in half, so you can easily wrap it into a roll. \n 5. Flatten the pork by cutting off the excess parts and placing them where the meat is thinner. \n 6. Use a knife to make several incisions on the inside of the meat, and then season it with plenty of salt and pepper. \n 7. Spread the mustard with a spoon over the whole surface of the meat, and sprinkle with 2-3 tablespoons of oregano. \n 8. Cut the peppers into strips and spread them over the pork. \n 9. Use a knife to cut the feta cheese into big pieces, and then spread them over the peppers. \n 10. Wrap the pork into a roll, using the parchment paper, sprinkle with the remaining oregano, and then drizzle it with olive oil. \n 11. Wrap the pork roll tightly with the parchment paper and aluminum foil, and transfer it to a baking pan with a rack, seam-side down. \n 12. Put the pan in the oven and roast the pork for 3 hours. \n 13. Uncover it and roast it for another 30 minutes until nicely golden. \n 14. Remove the pan from the oven and let the pork cool for 20-30 minutes. \n 15. Cut it into pieces, serve with mashed potatoes, and then sprinkle with oregano leaves.",
            "email": "test@gmail.com",
            "ingredients": [
              "2 kilos pork neck, boneless and skinless",
              "50 g mustard",
              "3-4 tablespoons oregano",
              "200 g florina peppers",
              "1 tablespoon olive oil",
              "salt",
              "pepper",
         ],
          "category": "Lunch Recipes", 
          "image": "xoirinoRolo.jpg"
        },
        { 
          "name": "Stuffed Pork Neck with Ham and Cheese",
           "description": "For the flavored butter:  1. Put the butter into a bowl and set it aside. \n  2. Finely chop the garlic, thyme, and rosemary, and add them to the bowl. \n  3. Add the salt, pepper, mustard, and honey, mix them with a spoon, and set the flavored butter aside. \n\n  For the pork neck: 1. Preheat the oven to 180°C (350°F) set to fan. \n 2. Spread a sheet of aluminum foil on your worktop, place a piece of parchment paper over it, and then place the pork neck on the parchment. \n 3. Use a knife to cut the pork lengthwise in half, to open it up and make room for the filling. \n 4. Make several incisions on the inner surface of the meat with the knife. \n 5. Spread half of the flavored butter over the whole surface of the meat with a spoon. \n 6. Add one layer of the Metsovone cheese slices on top, and then a layer of the ham slices. \n 7. Use the parchment paper to wrap the pork into a roll, in order to seal the filling well, and then sprinkle it with salt. \n 8. Place the large side of the pork roll parallel to the large side of the parchment paper. \n 9. Spread the rest of the butter over the whole surface of the pork, and wrap the meat first with the parchment paper and then with the aluminum foil. \n 10. Transfer the pork to a baking pan with a rack, seam-side up, and roast it for 3 hours. (During this time, make sure to have the sweet potatoes already prepared in order to bake them in the oven alongside the meat.) \n 11. Increase the oven’s temperature to 190°C (370°F), uncover the pork, and roast it for 30 more minutes. \n 12. Remove the pan from the oven and set it aside. \n  For the sweet potatoes:  1. Leave the skin on the sweet potatoes, cut them into wedges, and transfer them to a baking pan with the skin side facing down. \n 2. Season the sweet potatoes with salt, pepper, and thyme, and then drizzle them with olive oil. \n 3. Put the pan in the oven and bake the sweet potatoes along with the meat for 30 minutes. \n 4. Remove the pan from the oven and set it aside. ",
           "email": "test@gmail.com",
           "ingredients": [
            "100 g butter at room temperature",
            "1 clove of garlic",
            "2 tablespoon fresh thyme",
            "1 tablespoon rosemary",
            "2 tablespoon mustard",
            "1 tablespoon honey",
            "salt",
            "pepper",
            "2 kilos pork neck, boneless",
            "200 g smoked cheese",
            "150 g ham",
            "1 kilo sweet potatoes",
            "2 tablespoon olive oil",
        ],
         "category": "Dinner Recipes", 
         "image": "xoirinoGemisto.jpg"
       },
       { 
        "name": "Chocolate and Berries Cake Roll",
         "description": "For the cake layer: 1. Preheat the oven to 160°C (320°F) set to fan. \n 2. Line a 28x36 cm baking sheet with parchment paper. \n 3. Put the sugar, flour, cocoa powder, salt, and baking powder into a mixer’s bowl, and mix them well with a spoon. \n 4. Add the eggs and vanilla powder, transfer the bowl to the mixer, and beat the ingredients with the whisk attachment at high speed, for 5 minutes, until completely combined. \n 5. Transfer the cake batter to the pan and spread it with a spatula over the whole surface. \n 6. Spread a piece of parchment paper over the cake batter. \n 7. Put the pan in the oven and bake the cake for 10 minutes. \n 8. Remove the pan from the oven and let the cake cool for 10-15 minutes. \n 9. Carefully unmold the cake from the pan and remove the parchment paper. \n 10. Set the cake aside to cool and then drizzle it with the brandy. \n  For the chocolate mousse: 1. Finely chop the chocolate and put it in a small pot. \n 2. Add the milk, brandy, and instant coffee. \n 3. Place the pot over low heat and stir the ingredients with a silicone spatula for 2-3 minutes, until the chocolate is completely melted and you have a smooth mixture. \n 4. Transfer the mixture to a bowl and set it aside for 10-15 minutes until cooled. \n 5. Add ⅓ of the whipped cream and fold it with the silicone spatula until incorporated into the mixture. \n 6. Add the rest of the whipped cream and fold gently until incorporated into the mousse. \n 7. Cover the bowl with plastic wrap and refrigerate the mousse for 2 hours until it thickens well. ",
         "email": "test@gmail.com",
         "ingredients": [
          "110 g icing sugar",
        "90 g all-purpose flour",
        "30 g cocoa powder",
        "1 pinch salt",
        "1 teaspoon baking powder",
        "3 eggs",
        "1 vanilla powder",
        "40 g + 20 g brandy",
        "300 g chocolate couverture",
        "130 g whole milk",
        "1 teaspoon instant coffee",
        "250 g heavy cream 35% whipped",
      ],
       "category": "Dessert Recipes", 
       "image": "kormosSokolatas.jpg"
     },
     { 
      "name": "Stuffed Pork Neck with Ham and Cheese",
       "description": "For the flavored butter:  1. Put the butter into a bowl and set it aside. \n  2. Finely chop the garlic, thyme, and rosemary, and add them to the bowl. \n  3. Add the salt, pepper, mustard, and honey, mix them with a spoon, and set the flavored butter aside. \n\n  For the pork neck: 1. Preheat the oven to 180°C (350°F) set to fan. \n 2. Spread a sheet of aluminum foil on your worktop, place a piece of parchment paper over it, and then place the pork neck on the parchment. \n 3. Use a knife to cut the pork lengthwise in half, to open it up and make room for the filling. \n 4. Make several incisions on the inner surface of the meat with the knife. \n 5. Spread half of the flavored butter over the whole surface of the meat with a spoon. \n 6. Add one layer of the Metsovone cheese slices on top, and then a layer of the ham slices. \n 7. Use the parchment paper to wrap the pork into a roll, in order to seal the filling well, and then sprinkle it with salt. \n 8. Place the large side of the pork roll parallel to the large side of the parchment paper. \n 9. Spread the rest of the butter over the whole surface of the pork, and wrap the meat first with the parchment paper and then with the aluminum foil. \n 10. Transfer the pork to a baking pan with a rack, seam-side up, and roast it for 3 hours. (During this time, make sure to have the sweet potatoes already prepared in order to bake them in the oven alongside the meat.) \n 11. Increase the oven’s temperature to 190°C (370°F), uncover the pork, and roast it for 30 more minutes. \n 12. Remove the pan from the oven and set it aside. \n  For the sweet potatoes:  1. Leave the skin on the sweet potatoes, cut them into wedges, and transfer them to a baking pan with the skin side facing down. \n 2. Season the sweet potatoes with salt, pepper, and thyme, and then drizzle them with olive oil. \n 3. Put the pan in the oven and bake the sweet potatoes along with the meat for 30 minutes. \n 4. Remove the pan from the oven and set it aside. ",
       "email": "test@gmail.com",
       "ingredients": [
        "100 g butter at room temperature",
        "1 clove of garlic",
        "2 tablespoon fresh thyme",
        "1 tablespoon rosemary",
        "2 tablespoon mustard",
        "1 tablespoon honey",
        "salt",
        "pepper",
        "2 kilos pork neck, boneless",
        "200 g smoked cheese",
        "150 g ham",
        "1 kilo sweet potatoes",
        "2 tablespoon olive oil",
    ],
     "category": "Dinner Recipes", 
     "image": "xoirinoGemisto.jpg"
   },
   { 
    "name": "Chocolate and Berries Cake Roll",
     "description": "For the cake layer: 1. Preheat the oven to 160°C (320°F) set to fan. \n 2. Line a 28x36 cm baking sheet with parchment paper. \n 3. Put the sugar, flour, cocoa powder, salt, and baking powder into a mixer’s bowl, and mix them well with a spoon. \n 4. Add the eggs and vanilla powder, transfer the bowl to the mixer, and beat the ingredients with the whisk attachment at high speed, for 5 minutes, until completely combined. \n 5. Transfer the cake batter to the pan and spread it with a spatula over the whole surface. \n 6. Spread a piece of parchment paper over the cake batter. \n 7. Put the pan in the oven and bake the cake for 10 minutes. \n 8. Remove the pan from the oven and let the cake cool for 10-15 minutes. \n 9. Carefully unmold the cake from the pan and remove the parchment paper. \n 10. Set the cake aside to cool and then drizzle it with the brandy. \n  For the chocolate mousse: 1. Finely chop the chocolate and put it in a small pot. \n 2. Add the milk, brandy, and instant coffee. \n 3. Place the pot over low heat and stir the ingredients with a silicone spatula for 2-3 minutes, until the chocolate is completely melted and you have a smooth mixture. \n 4. Transfer the mixture to a bowl and set it aside for 10-15 minutes until cooled. \n 5. Add ⅓ of the whipped cream and fold it with the silicone spatula until incorporated into the mixture. \n 6. Add the rest of the whipped cream and fold gently until incorporated into the mousse. \n 7. Cover the bowl with plastic wrap and refrigerate the mousse for 2 hours until it thickens well. ",
     "email": "test@gmail.com",
     "ingredients": [
      "110 g icing sugar",
    "90 g all-purpose flour",
    "30 g cocoa powder",
    "1 pinch salt",
    "1 teaspoon baking powder",
    "3 eggs",
    "1 vanilla powder",
    "40 g + 20 g brandy",
    "300 g chocolate couverture",
    "130 g whole milk",
    "1 teaspoon instant coffee",
    "250 g heavy cream 35% whipped",
  ],
   "category": "Dessert Recipes", 
   "image": "kormosSokolatas.jpg"
 },
      ]);
    } catch (error) {
      console.log('err', + error)
    }
  }
  
  insertDymmyRecipeData();*/

  /*async function insertDymmyCategoryData(){
       try {
         await Category.insertMany([
           {
             "name": "Vegetarian & Vegan Recipes",
             "image": "vegetarian.jpg"
           },
           {
             "name": "Healthy Recipes",
             "image": "healthy.jpg"
           }, 
           {
             "name": "Mediterranean Recipes",
             "image": "mediterranean.jpg"
           },
           {
             "name": "Pasta Recipes",
             "image": "pasta.jpg"
           }
         ]);
       } catch (error) {
         console.log('err', + error)
       }
     }
    
     insertDymmyCategoryData();*/