import * as React from "react"
import { withRealm } from "../../shared/withRealm"
import { TextField } from "../../shared/text-field"
import { Button } from "../../shared/button"
import { spacing } from "../../../theme"
import { View, FlatList, TextStyle, ViewStyle } from "react-native"
import RecipeConfig from "../../../realm/recipe"
import { RecipeType } from "../../../realm/recipe"
import { WithRealmWrappedProps } from "../../shared/withRealm/withRealm.props"
import { MODALVIEW } from "../styles"

const SEARCHINPUT: TextStyle = {
  fontSize: 18,
  maxHeight: 30,
}

const SEARCHSTYLE: ViewStyle = {
  paddingVertical: spacing[0],
  marginBottom: spacing[1],
  borderColor: "sienna",
  borderWidth: 1,
}

interface InnerListRendererProps {
  data: ReadonlyArray<RecipeType>
  onItemPress: (any) => any
}

class InnerListRenderer extends React.Component<InnerListRendererProps & WithRealmWrappedProps> {
  _keyExtractor = item => `${item.id}`

  _renderItem({ item }) {
    return (
      <Button
        text={String(item.name)}
        style={SEARCHSTYLE}
        textStyle={SEARCHINPUT}
        onPress={() => this.props.onItemPress(item)}
      />
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor.bind(this)}
        renderItem={this._renderItem.bind(this)}
      />
    )
  }
}

const ListRenderer = withRealm({
  query: (realm, ownProps) => {
    const { search } = ownProps

    let recipes = realm
      .objects("Recipe")
      .filtered(`name LIKE '*${search}*'`)
      .sorted("viewedTimes", true)
      .slice(0, 10)

    return {
      data: recipes,
    }
  },
  checkReload: (prevProps, nextProps) => prevProps.search !== nextProps.search,
  config: new RecipeConfig().current,
})(InnerListRenderer)

class RecipeTaglistFilteringList extends React.Component {
  state = {
    search: "",
  }

  _handleTextChange = search => {
    this.setState({ search })
  }

  render() {
    return (
      <View style={MODALVIEW}>
        <TextField
          inputStyle={SEARCHINPUT}
          style={SEARCHSTYLE}
          value={this.state.search}
          onChangeText={this._handleTextChange.bind(this)}
          placeholderTx="common.search"
        />
        <ListRenderer search={this.state.search} onItemPress={this.props.onItemPress} />
      </View>
    )
  }
}

export default RecipeTaglistFilteringList
