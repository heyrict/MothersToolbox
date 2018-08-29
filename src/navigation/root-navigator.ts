import { createStackNavigator } from "react-navigation"
import { Home } from "../views/home/home-screen"
import { RecipeNavigator } from "./recipe-navigator"

export const RootNavigator = createStackNavigator(
  {
    home: { screen: Home },
    recipe: { screen: RecipeNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
    initialRouteName: "home",
    initialRouteKey: "home",
  },
)
