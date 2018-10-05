import * as React from "react"
import Modal from "react-native-modal"
import { SwipeListView } from "react-native-swipe-list-view"
import { observer } from "mobx-react"
import { View } from "react-native"
import { withRealm } from "../../shared/withRealm"
import { Header } from "../../shared/header"
import { Button } from "../../shared/button"
import { Icon } from "../../shared/icon"
import { Screen } from "../../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../../shared/withRealm/withRealm.props"
import { RecipeType, TagType } from "../../../realm/recipe"
import RecipeConfig from "../../../realm/recipe"
import TaglistFilteringList from "./recipe-taglist-filtering-list"
import {
  BACK,
  BKBTNR,
  ROOT,
  LIST,
  HEADER,
  HEADER_TITLE,
  RECIPE_BTN,
  RECIPE_BTN_TXT,
} from "../styles"

export interface RecipeTaglistViewScreenProps extends NavigationScreenProps<{}> {
  data: ReadonlyArray<{}>
  tag: TagType
}

export interface RecipeTaglistViewScreenStates {
  modalVisible: boolean
  recipeName: string
  modalEditId?: number
}

// @inject("mobxstuff")
@observer
export class Recipe extends React.Component<
  RecipeTaglistViewScreenProps & WithRealmWrappedProps,
  RecipeTaglistViewScreenStates
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

  goBack = () => this.props.navigation.popToTop(null)
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
        <Button style={BKBTNR} onPress={this.removeRecipe.bind(this, item.id)}>
          <Icon style={{ height: 30 }} icon="delete" />
        </Button>
      </View>
    )
  }

  addRecipe(recipeId) {
    this.props.realm.write(() => {
      let recipe: RecipeType = this.props.realm.objectForPrimaryKey("Recipe", recipeId)
      const tag: TagType = this.props.realm.objectForPrimaryKey("Tag", this.props.tag.id)
      console.log(recipe.tags.map(tag => ({ id: tag.id, name: tag.name })), tag)

      if (recipe.tags.findIndex(tag => tag.id === this.props.tag.id) === -1) {
        recipe.tags.push(tag)
      }
    })
    this.props.update()
  }

  removeRecipe(recipeId: number) {
    this.props.realm.write(() => {
      let recipe = this.props.realm.objectForPrimaryKey("Recipe", recipeId) as RecipeType
      recipe.tags = recipe.tags.filter(tag => tag.id !== this.props.tag.id)
    })
    this.props.update()
  }

  handleModalButtonPress(item) {
    const recipeId = item.id
    /* Create new model */
    this.addRecipe(recipeId)
    this.closeModal()
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
          headerText={this.props.tag.name}
        />
        <SwipeListView
          useFlatList
          style={LIST}
          data={this.props.data}
          renderItem={this.renderListItem.bind(this)}
          renderHiddenItem={this.renderHiddenItem.bind(this)}
          rightOpenValue={-75}
          keyExtractor={this._keyExtractor.bind(this)}
        />
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={this.closeModal.bind(this)}
          onBackButtonPress={this.closeModal.bind(this)}
        >
          <TaglistFilteringList onItemPress={this.handleModalButtonPress.bind(this)} />
        </Modal>
      </Screen>
    )
  }
}

export default withRealm({
  query: (realm, ownProps) => {
    const tagId: number = ownProps.navigation.getParam("tagId")
    const tag = realm.objectForPrimaryKey("Tag", tagId) as any

    const recipes = tag.recipes.sorted("viewedTimes", true)

    return {
      data: recipes,
      tag,
    }
  },
  config: new RecipeConfig().current,
})(Recipe)
