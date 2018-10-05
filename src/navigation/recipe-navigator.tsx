import React from "react"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import RecipeView from "../views/recipe/recipe-view/recipe-view-screen"
import RecipeTaglistView from "../views/recipe/recipe-taglist/recipe-taglist-view-screen"
import RecipeTaglist from "../views/recipe/recipe-taglist/recipe-taglist-screen"
import Recipe from "../views/recipe/recipe-screen"

import { ImageStyle } from "react-native"
import { Icon } from "../views/shared/icon/icon"

const NavIconStyle: ImageStyle = {
  maxWidth: 35,
  maxHeight: 35,
}

const RecipeTaglistNavigator = createStackNavigator(
  {
    recipeTaglist: { screen: RecipeTaglist },
    recipeTagView: { screen: RecipeTaglistView },
  },
  {
    headerMode: "none",
    initialRouteKey: "recipeTaglist",
    initialRouteName: "recipeTaglist",
  },
)

const RecipeTabsNavigator = createBottomTabNavigator(
  {
    recipeList: {
      screen: Recipe,
      navigationOptions: () => ({
        title: "我的配料单",
        tabBarIcon: <Icon icon="recipe" style={NavIconStyle} />,
      }),
    },
    recipeTaglist: {
      screen: RecipeTaglistNavigator,
      navigationOptions: () => ({
        title: "我的标签",
        tabBarIcon: <Icon icon="bookmark" style={NavIconStyle} />,
      }),
    },
  },
  {
    initialRouteName: "recipeList",
    tabBarOptions: {
      activeBackgroundColor: "#93a1a1",
      activeTintColor: "#eee8d5",
      inactiveBackgroundColor: "#eee8d5",
      inactiveTintColor: "#93a1a1",
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
