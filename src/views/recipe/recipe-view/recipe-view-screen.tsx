import * as React from "react"
import Modal from "react-native-modal"
import { observer } from "mobx-react"
import { SwipeListView } from "react-native-swipe-list-view"
import { View } from "react-native"
import { Icon } from "../../shared/icon"
import { withRealm } from "../../shared/withRealm"
import { TextField } from "../../shared/text-field"
import { Header } from "../../shared/header"
import { Button } from "../../shared/button"
import { Screen } from "../../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../../shared/withRealm/withRealm.props"
import { ComponentType } from "../../../realm/recipe"
import RecipeConfig from "../../../realm/recipe"
import { RecipeViewItem } from "./recipe-view-item"
import {
  ROOT,
  LIST,
  HEADER,
  VISIBLE,
  TOOLBAR,
  TOOLBARBTN,
  HEADER_TITLE,
  MODALVIEW,
  MODALBTN,
  MODALINPUT,
  BACK,
  BKBTNL,
  BKBTNR,
} from "../styles"

export interface RecipeViewScreenProps extends NavigationScreenProps<{}> {
  data: object
}

export interface RecipeViewScreenStates {
  modalVisible: boolean
  modalEditId?: number
  componentName: string
  componentAmount: string
  componentUnit: string
  ratio: number
}

// @inject("mobxstuff")
@observer
export class RecipeView extends React.Component<
  RecipeViewScreenProps & WithRealmWrappedProps,
  RecipeViewScreenStates
> {
  state = {
    modalVisible: false,
    modalEditId: null,
    componentName: "",
    componentAmount: "0",
    componentUnit: "",
    ratio: 1,
  }

  openModal = (item: ComponentType) =>
    this.setState({
      modalVisible: true,
      modalEditId: item ? item.id : null,
      componentName: item ? item.name : "",
      componentAmount: item ? item.amount.toString() : "0",
      componentUnit: item ? item.unit : "",
    })
  closeModal = () => this.setState({ modalVisible: false, modalEditId: null })

  setRatio = (ratio: number) => {
    this.setState({
      ratio,
    })
  }

  applyRatio = (mul: number) => {
    this.setState(({ ratio }) => ({
      ratio: ratio * mul,
    }))
  }

  _keyExtractor = item => `${item.id}`

  _renderItem({ item }) {
    return (
      <RecipeViewItem item={item} ratio={this.state.ratio} setRatio={this.setRatio.bind(this)} />
    )
  }

  _renderHiddenItem({ item }) {
    return (
      <View style={BACK}>
        <Button style={BKBTNL} onPress={this.openModal.bind(this, item)}>
          <Icon style={{ height: 30 }} icon="edit" />
        </Button>
        <Button style={BKBTNR} onPress={this.deleteComponent.bind(this, item.id)}>
          <Icon style={{ height: 30 }} icon="delete" />
        </Button>
      </View>
    )
  }

  createComponent() {
    let recipe: any = this.props.data
    this.props.realm.write(() => {
      let nextId: number = 1
      const maxId = this.props.realm.objects("Component").max("id")
      if (typeof maxId === "number") {
        nextId = maxId + 1
      }

      let component = this.props.realm.create("Component", {
        id: nextId,
        name: this.state.componentName,
        amount: Number.parseFloat(this.state.componentAmount),
        unit: this.state.componentUnit,
        created: new Date(),
      })
      recipe.components.push(component)
    })
    this.props.update()
  }

  updateComponent(componentId: number) {
    this.props.realm.write(() => {
      this.props.realm.create(
        "Component",
        {
          id: componentId,
          name: this.state.componentName,
          amount: Number.parseFloat(this.state.componentAmount),
          unit: this.state.componentUnit,
        },
        true,
      )
    })
    this.props.update()
  }

  deleteComponent(componentId: number) {
    this.props.realm.write(() => {
      let component = this.props.realm.objectForPrimaryKey("Component", componentId)
      this.props.realm.delete(component)
    })
    this.props.update()
  }

  handleModalButtonPress() {
    if (this.state.modalEditId) {
      this.updateComponent(this.state.modalEditId)
      this.closeModal()
    } else {
      this.createComponent()
      this.closeModal()
    }
  }

  render() {
    const item: any = this.props.data
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Header
          style={HEADER}
          titleStyle={HEADER_TITLE}
          headerText={item.name}
          rightIcon="plus"
          onRightPress={this.openModal.bind(this, null)}
          leftIcon="back"
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <View style={TOOLBAR}>
          <Button
            text="÷2"
            style={TOOLBARBTN}
            textStyle={VISIBLE}
            onPress={this.applyRatio.bind(this, 0.5)}
          />
          <Button
            tx="common.reset"
            style={TOOLBARBTN}
            textStyle={VISIBLE}
            onPress={this.setRatio.bind(this, 1)}
          />
          <Button
            text="×2"
            style={TOOLBARBTN}
            textStyle={VISIBLE}
            onPress={this.applyRatio.bind(this, 2)}
          />
        </View>
        <SwipeListView
          useFlatList
          style={LIST}
          data={item.components}
          renderItem={this._renderItem.bind(this)}
          renderHiddenItem={this._renderHiddenItem.bind(this)}
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
              labelTx="recipe.componentName"
              value={this.state.componentName}
              onChangeText={componentName => this.setState({ componentName })}
            />
            <TextField
              selectTextOnFocus
              inputStyle={MODALINPUT}
              keyboardType="numeric"
              labelTx="recipe.componentAmount"
              value={this.state.componentAmount}
              onEndEditing={event => {
                const componentAmount: string = event.nativeEvent.text
                this.setState({
                  componentAmount: (Number.parseFloat(componentAmount) || 0).toString(),
                })
              }}
              onChangeText={componentAmount => this.setState({ componentAmount })}
            />
            <TextField
              inputStyle={MODALINPUT}
              labelTx="recipe.componentUnit"
              value={this.state.componentUnit}
              onChangeText={componentUnit => this.setState({ componentUnit })}
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
  config: new RecipeConfig().current,
  query: (realm, ownProps) => {
    const recipeId = ownProps.navigation.getParam("recipeId", 0)
    let recipe = realm.objectForPrimaryKey("Recipe", recipeId)
    return {
      data: recipe,
    }
  },
})(RecipeView)
