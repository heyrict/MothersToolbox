import * as React from "react"
import * as Realm from "realm"
import Modal from "react-native-modal"
import { observer } from "mobx-react"
import { FlatList, View } from "react-native"
import { withRealm } from "../shared/withRealm"
import { TextField } from "../shared/text-field"
import { Header } from "../shared/header"
import { Button } from "../shared/button"
import { Screen } from "../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../shared/withRealm/withRealm.props"
import { RecipeSchema, ComponentSchema } from "../../realm/recipe"
import {
  ROOT,
  LIST,
  HEADER,
  HEADER_TITLE,
  RECIPE_BTN,
  RECIPE_BTN_TXT,
  MODALVIEW,
  MODALBTN,
  MODALINPUT,
} from "./styles"

export interface RecipeScreenProps extends NavigationScreenProps<{}> {
  data: ReadonlyArray<{}>
}

export interface RecipeScreenStates {
  modalVisible: boolean
  newRecipeName: string
}

// @inject("mobxstuff")
@observer
export class Recipe extends React.Component<
  RecipeScreenProps & WithRealmWrappedProps,
  RecipeScreenStates
> {
  state = {
    modalVisible: false,
    newRecipeName: "",
  }

  toggleModalVisible(visible: boolean | undefined) {
    this.setState(({ modalVisible }) => ({
      modalVisible: visible === undefined ? !modalVisible : visible,
    }))
  }

  goBack = () => this.props.navigation.goBack(null)
  goView = recipeId => this.props.navigation.navigate("recipeView", { recipeId })

  _keyExtractor = item => `${item.id}`

  renderListItem({ item }) {
    return (
      <Button
        style={RECIPE_BTN}
        textStyle={RECIPE_BTN_TXT}
        text={item.name}
        onPress={this.goView.bind(this, item.id)}
      />
    )
  }

  createRecipe() {
    Realm.open({ schema: [RecipeSchema, ComponentSchema] }).then(realm => {
      realm.write(() => {
        let nextId: number = 1
        const maxId = realm.objects("Recipe").max("id")
        if (typeof maxId === "number") {
          nextId = maxId + 1
        }
        realm.create("Recipe", {
          id: nextId,
          name: this.state.newRecipeName,
          components: [],
          created: new Date(),
        })
      })
      this.props.refetch()
      this.setState({
        newRecipeName: "",
      })
    })
  }

  handleCreateRecipeButtonPress() {
    this.createRecipe()
    this.toggleModalVisible(false)
  }

  render() {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Header
          leftIcon="back"
          onLeftPress={this.goBack.bind(this)}
          rightIcon="plus"
          onRightPress={this.toggleModalVisible.bind(this, true)}
          style={HEADER}
          titleStyle={HEADER_TITLE}
          headerTx="recipe.title"
        />
        <FlatList
          style={LIST}
          data={this.props.data}
          renderItem={this.renderListItem.bind(this)}
          keyExtractor={this._keyExtractor.bind(this)}
        />
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={this.toggleModalVisible.bind(this, false)}
          onBackButtonPress={this.toggleModalVisible.bind(this, false)}
        >
          <View style={MODALVIEW}>
            <TextField
              inputStyle={MODALINPUT}
              labelTx="recipe.nameLabel"
              value={this.state.newRecipeName}
              onChangeText={newRecipeName => this.setState({ newRecipeName })}
            />
            <Button
              tx="common.ok"
              style={MODALBTN}
              onPress={this.handleCreateRecipeButtonPress.bind(this)}
            />
          </View>
        </Modal>
      </Screen>
    )
  }
}

export default withRealm({
  query: realm => {
    let recipes = realm.objects("Recipe")
    return recipes
  },
  schema: [RecipeSchema, ComponentSchema],
})(Recipe)
