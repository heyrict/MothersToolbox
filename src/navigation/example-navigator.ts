import { createStackNavigator } from "react-navigation"
import { FirstExampleScreen } from "../views/example/first-example-screen"
import { SecondExampleScreen } from "../views/example/second-example-screen"
import { MainScreen } from "../views/MainScreen/MainScreen-screen"

export const ExampleNavigator = createStackNavigator(
  {
    mainScreen: { screen: MainScreen },
    firstExample: { screen: FirstExampleScreen },
    secondExample: { screen: SecondExampleScreen },
  },
  {
    headerMode: "none",
  },
)
