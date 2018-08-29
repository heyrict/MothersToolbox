import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle, ImageStyle, TextStyle, StatusBar, FlatList } from "react-native"
import { Text } from "../shared/text"
import { Button } from "../shared/button"
import { Icon } from "../shared/icon"
import { Header } from "../shared/header"
import { Screen } from "../shared/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"

export interface HomeScreenProps extends NavigationScreenProps<{}> {}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

const HEADER: TextStyle = {
  backgroundColor: color.palette.gray,
  marginBottom: spacing[2],
  paddingBottom: spacing[2],
  paddingHorizontal: 0,
  paddingTop: spacing[2],
}

const HEADER_TITLE: TextStyle = {
  color: color.palette.white,
  fontWeight: "bold",
}

const APPBTN: ViewStyle = {
  backgroundColor: "burlywood",
  marginHorizontal: spacing[2],
  marginVertical: spacing[2],
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

const APPICON: ImageStyle = {
  maxWidth: 60,
  maxHeight: 60,
}

const appData = [{ key: "recipe", icon: <Icon style={APPICON} icon="recipe" /> }]

// @inject("mobxstuff")
@observer
export class Home extends React.Component<HomeScreenProps, {}> {
  render() {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <StatusBar barStyle="light-content" />
        <Header style={HEADER} titleStyle={HEADER_TITLE} headerTx="home.header" />
        <FlatList
          data={appData}
          numColumns={4}
          horizontal={false}
          renderItem={({ item }) => (
            <Button
              style={APPBTN}
              onPress={() => {
                this.props.navigation.navigate(item.key)
              }}
            >
              {item.icon}
              <Text tx={`${item.key}.title`} />
            </Button>
          )}
        />
      </Screen>
    )
  }
}
