import * as React from "react"
import Modal from "react-native-modal"
import { SwipeListView } from "react-native-swipe-list-view"
import { observer } from "mobx-react"
import { View } from "react-native"
import { withRealm } from "../../shared/withRealm"
import { TextField } from "../../shared/text-field"
import { Header } from "../../shared/header"
import { Button } from "../../shared/button"
import { Icon } from "../../shared/icon"
import { Screen } from "../../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../../shared/withRealm/withRealm.props"
import { TagType } from "../../../realm/recipe"
import RecipeConfig from "../../../realm/recipe"
import {
  BACK,
  BKBTNL,
  BKBTNR,
  ROOT,
  LIST,
  HEADER,
  HEADER_TITLE,
  RECIPE_TAG_BTN,
  RECIPE_BTN_TXT,
  MODALVIEW,
  MODALBTN,
  MODALINPUT,
} from "../styles"

export interface RecipeTaglistScreenProps extends NavigationScreenProps<{}> {
  data: ReadonlyArray<{}>
}

export interface RecipeTaglistScreenStates {
  modalVisible: boolean
  tagName: string
  modalEditId?: number
}

// @inject("mobxstuff")
@observer
export class RecipeTaglist extends React.Component<
  RecipeTaglistScreenProps & WithRealmWrappedProps,
  RecipeTaglistScreenStates
> {
  state = {
    modalVisible: false,
    tagName: "",
    modalEditId: null,
  }

  closeModal = () => this.setState({ modalVisible: false, modalEditId: null })
  openModal = (item: TagType) =>
    this.setState({
      modalVisible: true,
      modalEditId: item ? item.id : null,
      tagName: item ? item.name : "",
    })

  goBack = () => this.props.navigation.popToTop(null)
  goView = tagId => {
    this.props.update()
    this.props.navigation.navigate("recipeTagView", { tagId })
  }

  _keyExtractor = item => `${item.id}`

  renderListItem({ item }) {
    return (
      <Button
        style={RECIPE_TAG_BTN}
        textStyle={RECIPE_BTN_TXT}
        text={item.name}
        onPress={this.goView.bind(this, item.id)}
      />
    )
  }

  renderHiddenItem({ item }) {
    return (
      <View style={BACK}>
        <Button style={BKBTNL} onPress={this.openModal.bind(this, item)}>
          <Icon style={{ height: 30 }} icon="edit" />
        </Button>
        <Button style={BKBTNR} onPress={this.deleteTag.bind(this, item.id)}>
          <Icon style={{ height: 30 }} icon="delete" />
        </Button>
      </View>
    )
  }

  createTag() {
    this.props.realm.write(() => {
      let nextId: number = 1
      const maxId = this.props.realm.objects("Tag").max("id")
      if (typeof maxId === "number") {
        nextId = maxId + 1
      }
      this.props.realm.create("Tag", {
        id: nextId,
        name: this.state.tagName,
        created: new Date(),
      })
    })
    this.props.update()
  }

  updateTag(tagId: number) {
    this.props.realm.write(() => {
      this.props.realm.create("Tag", { id: tagId, name: this.state.tagName }, true)
    })
    this.props.update()
  }

  deleteTag(recipeId: number) {
    this.props.realm.write(() => {
      let tag = this.props.realm.objectForPrimaryKey("Tag", recipeId)
      this.props.realm.delete(tag)
    })
    this.props.update()
  }

  handleModalButtonPress() {
    if (this.state.modalEditId !== null) {
      /* Update model with id `modalEditId` */
      this.updateTag(this.state.modalEditId)
      this.closeModal()
    } else {
      /* Create new model */
      this.createTag()
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
          headerTx="recipe.taglist.title"
        />
        <SwipeListView
          useFlatList
          style={LIST}
          data={this.props.data}
          renderItem={this.renderListItem.bind(this)}
          renderHiddenItem={this.renderHiddenItem.bind(this)}
          leftOpenValue={75}
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
              value={this.state.tagName}
              onChangeText={tagName => this.setState({ tagName })}
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
    let tags = realm.objects("Tag").sorted("id", false)
    return {
      data: tags,
    }
  },
  config: new RecipeConfig().current,
})(RecipeTaglist)
