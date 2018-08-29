import * as React from "react"
import Modal from "react-native-modal"
import { SwipeListView } from "react-native-swipe-list-view"
import { observer } from "mobx-react"
import { View } from "react-native"
import { withRealm } from "../shared/withRealm"
import { TextField } from "../shared/text-field"
import { Header } from "../shared/header"
import { Button } from "../shared/button"
import { Icon } from "../shared/icon"
import { Screen } from "../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../shared/withRealm/withRealm.props"
import { RecipeType } from "../../realm/recipe"
import RecipeConfig from "../../realm/recipe"
import {
  BACK,
  BKBTNL,
  BKBTNR,
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
  recipeName: string
  modalEditId?: number
}

// @inject("mobxstuff")
@observer
export class Recipe extends React.Component<
  RecipeScreenProps & WithRealmWrappedProps,
  RecipeScreenStates
> {
  state = {
    modalVisible: false,
    recipeName: "",
    modalEditId: null,
  }

  closeModal = () => this.setState({ modalVisible: false, modalEditId: null })
  openModal = (item: RecipeType) =>
    this.setState({
      modalVisible: true,
      modalEditId: item ? item.id : null,
      recipeName: item ? item.name : "",
    })

  goBack = () => this.props.navigation.goBack(null)
  goView = recipeId => {
    this.props.realm.write(() => {
      const recipe: RecipeType = this.props.realm.objectForPrimaryKey("Recipe", recipeId)
      recipe.viewedTimes += 1
    })
    this.props.update()
    this.props.navigation.navigate("recipeView", { recipeId })
  }

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

  renderHiddenItem({ item }) {
    return (
      <View style={BACK}>
        <Button style={BKBTNL} onPress={this.duplicateRecipe.bind(this, item)}>
          <Icon style={{ height: 30 }} icon="duplicate" />
        </Button>
        <Button style={BKBTNL} onPress={this.openModal.bind(this, item)}>
          <Icon style={{ height: 30 }} icon="edit" />
        </Button>
        <Button style={BKBTNR} onPress={this.deleteRecipe.bind(this, item.id)}>
          <Icon style={{ height: 30 }} icon="delete" />
        </Button>
      </View>
    )
  }

  duplicateRecipe(item: RecipeType) {
    const { id, created, viewedTimes, ...rest } = item
    this.props.realm.write(() => {
      let nextId: number = 1
      const maxId = this.props.realm.objects("Recipe").max("id")
      if (typeof maxId === "number") {
        nextId = maxId + 1
      }
      this.props.realm.create("Recipe", {
        id: nextId,
        created: new Date(),
        viewedTimes: 0,
        ...rest,
      })
    })
    this.props.update()
  }

  createRecipe() {
    this.props.realm.write(() => {
      let nextId: number = 1
      const maxId = this.props.realm.objects("Recipe").max("id")
      if (typeof maxId === "number") {
        nextId = maxId + 1
      }
      this.props.realm.create("Recipe", {
        id: nextId,
        name: this.state.recipeName,
        components: [],
        created: new Date(),
        viewedTimes: 0,
        tags: [],
      })
    })
    this.props.update()
  }

  updateRecipe(recipeId: number) {
    this.props.realm.write(() => {
      this.props.realm.create("Recipe", { id: recipeId, name: this.state.recipeName }, true)
    })
    this.props.update()
  }

  deleteRecipe(recipeId: number) {
    this.props.realm.write(() => {
      let recipe = this.props.realm.objectForPrimaryKey("Recipe", recipeId)
      this.props.realm.delete(recipe)
    })
    this.props.update()
  }

  handleModalButtonPress() {
    if (this.state.modalEditId !== null) {
      /* Update model with id `modalEditId` */
      this.updateRecipe(this.state.modalEditId)
      this.closeModal()
    } else {
      /* Create new model */
      this.createRecipe()
      this.closeModal()
    }
  }

  render() {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Header
          leftIcon="back"
          onLeftPress={this.goBack.bind(this)}
          rightIcon="plus"
          onRightPress={this.openModal.bind(this, null)}
          style={HEADER}
          titleStyle={HEADER_TITLE}
          headerTx="recipe.title"
        />
        <SwipeListView
          useFlatList
          style={LIST}
          data={this.props.data}
          renderItem={this.renderListItem.bind(this)}
          renderHiddenItem={this.renderHiddenItem.bind(this)}
          leftOpenValue={150}
          rightOpenValue={-75}
          keyExtractor={this._keyExtractor.bind(this)}
        />
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={this.closeModal.bind(this)}
          onBackButtonPress={this.closeModal.bind(this)}
        >
          <View style={MODALVIEW}>
            <TextField
              inputStyle={MODALINPUT}
              labelTx="recipe.nameLabel"
              value={this.state.recipeName}
              onChangeText={recipeName => this.setState({ recipeName })}
            />
            <Button
              tx="common.ok"
              style={MODALBTN}
              onPress={this.handleModalButtonPress.bind(this)}
            />
          </View>
        </Modal>
      </Screen>
    )
  }
}

export default withRealm({
  query: realm => {
    let recipes = realm.objects("Recipe").sorted("viewedTimes", true)
    return recipes
  },
  config: new RecipeConfig().current,
})(Recipe)
