import * as React from "react"
import * as Realm from "realm"
import Modal from "react-native-modal"
import { observer } from "mobx-react"
import { FlatList, View } from "react-native"
import { withRealm } from "../../shared/withRealm"
import { TextField } from "../../shared/text-field"
import { Header } from "../../shared/header"
import { Button } from "../../shared/button"
import { Screen } from "../../shared/screen"
import { NavigationScreenProps } from "react-navigation"
import { WithRealmWrappedProps } from "../../shared/withRealm/withRealm.props"
import { RecipeSchema, ComponentSchema } from "../../../realm/recipe"
import { RecipeViewItem } from "./recipe-view-item"
import { ROOT, LIST, HEADER, HEADER_TITLE, MODALVIEW, MODALBTN, MODALINPUT } from "../styles"

export interface RecipeViewScreenProps extends NavigationScreenProps<{}> {}

export interface RecipeViewScreenStates {
  modalVisible: boolean
  newComponentName: string
  newComponentAmount: string
  newComponentUnit: string
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
    newComponentName: "",
    newComponentAmount: "0",
    newComponentUnit: "",
    ratio: 1,
  }

  toggleModalVisible(visible: boolean | undefined) {
    this.setState(({ modalVisible }) => ({
      modalVisible: visible === undefined ? !modalVisible : visible,
    }))
  }

  setRatio = (ratio: number) => {
    this.setState({
      ratio,
    })
  }

  _keyExtractor = item => `${item.id}`

  _renderItem({ item }) {
    return (
      <RecipeViewItem item={item} ratio={this.state.ratio} setRatio={this.setRatio.bind(this)} />
    )
  }

  createComponent() {
    let recipe: any = this.props.data
    Realm.open({ schema: [RecipeSchema, ComponentSchema] }).then(realm => {
      realm.write(() => {
        let nextId: number = 1
        const maxId = realm.objects("Component").max("id")
        if (typeof maxId === "number") {
          nextId = maxId + 1
        }

        let component = realm.create("Component", {
          id: nextId,
          name: this.state.newComponentName,
          amount: Number.parseFloat(this.state.newComponentAmount),
          unit: this.state.newComponentUnit,
          created: new Date(),
        })
        recipe.components.push(component)
      })
      this.props.refetch()
      this.setState({
        newComponentName: "",
        newComponentAmount: "0",
        newComponentUnit: "",
      })
    })
  }

  handleCreateComponentButtonPress() {
    this.createComponent()
    this.toggleModalVisible(false)
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
          onRightPress={this.toggleModalVisible.bind(this, true)}
          leftIcon="back"
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <FlatList
          style={LIST}
          data={item.components}
          renderItem={this._renderItem.bind(this)}
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
              labelTx="recipe.componentName"
              value={this.state.newComponentName}
              onChangeText={newComponentName => this.setState({ newComponentName })}
            />
            <TextField
              inputStyle={MODALINPUT}
              keyboardType="numeric"
              labelTx="recipe.componentAmount"
              value={this.state.newComponentAmount}
              onEndEditing={event => {
                const newComponentAmount: string = event.nativeEvent.text
                this.setState({
                  newComponentAmount: (Number.parseFloat(newComponentAmount) || 0).toString(),
                })
              }}
              onChangeText={newComponentAmount => this.setState({ newComponentAmount })}
            />
            <TextField
              inputStyle={MODALINPUT}
              labelTx="recipe.componentUnit"
              value={this.state.newComponentUnit}
              onChangeText={newComponentUnit => this.setState({ newComponentUnit })}
            />
            <Button
              tx="common.ok"
              style={MODALBTN}
              onPress={this.handleCreateComponentButtonPress.bind(this)}
            />
          </View>
        </Modal>
      </Screen>
    )
  }
}

export default withRealm({
  query: (realm, ownProps) => {
    const recipeId = ownProps.navigation.getParam("recipeId", 0)
    let recipe = realm.objectForPrimaryKey("Recipe", recipeId)
    return recipe
  },
})(RecipeView)
