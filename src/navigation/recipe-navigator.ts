import { createStackNavigator } from "react-navigation"
import RecipeView from "../views/recipe/recipe-view/recipe-view-screen"
import Recipe from "../views/recipe/recipe-screen"

export const RecipeNavigator = createStackNavigator(
  {
    recipeView: { screen: RecipeView },
    recipe: { screen: Recipe },
  },
  {
    headerMode: "none",
    initialRouteName: "recipe",
    initialRouteKey: "recipe",
  },
)
