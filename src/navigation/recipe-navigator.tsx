import React from "react"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import RecipeView from "../views/recipe/recipe-view/recipe-view-screen"
import RecipeTaglist from "../views/recipe/recipe-taglist/recipe-taglist-screen"
import Recipe from "../views/recipe/recipe-screen"

import { Icon } from "../views/shared/icon/icon"

const RecipeTabsNavigator = createBottomTabNavigator(
  {
    recipe: { screen: Recipe },
    recipeTaglist: { screen: RecipeTaglist },
  },
  {
    initialRouteName: "recipe",
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        if (routeName === "recipe") {
          return <Icon icon="recipe" />
        } else {
          return <Icon icon="bullet" />
        }
      },
    }),
    tabBarOptions: {
      inactiveBackgroundColor: "#ddd",
      activeBackgroundColor: "#ccc",
    },
  },
)

export const RecipeNavigator = createStackNavigator(
  {
    recipeView: { screen: RecipeView },
    recipe: { screen: RecipeTabsNavigator },
  },
  {
    headerMode: "none",
    initialRouteName: "recipe",
    initialRouteKey: "recipe",
  },
)
