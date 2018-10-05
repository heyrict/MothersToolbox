import * as React from "react"
import { View, TextInput } from "react-native"
import { Text } from "../../shared/text"
import { ComponentType } from "../../../realm/recipe"
import { PANEL, PANELTXT } from "../styles"

export interface RecipeViewItemProps {
  item: ComponentType
  ratio: number
  setRatio: (number) => void
}

export interface RecipeViewItemStates {
  amountValue: string
  editing: boolean
}

export class RecipeViewItem extends React.Component<RecipeViewItemProps, RecipeViewItemStates> {
  state = {
    amountValue: (this.props.item.amount * this.props.ratio).toFixed(2).toString(),
    editing: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.editing) {
      this.setState({
        amountValue: (nextProps.item.amount * nextProps.ratio).toFixed(2).toString(),
      })
    }
  }

  _handleFocus() {
    this.setState(prevState => {
      const amountValue = parseInt(prevState.amountValue, 10).toString()
      return {
        amountValue: amountValue,
        editing: true,
      }
    })
  }

  _handleEndEditing(event) {
    const amount: string = event.nativeEvent.text
    const amountValue = Number.parseFloat(amount)
    this.setState({
      amountValue: amountValue.toFixed(2).toString(),
      editing: false,
    })
  }

  _handleChangeText(text) {
    this.setState({
      amountValue: text,
      editing: true,
    })
    const amountValue = Number.parseFloat(text)
    if (amountValue !== this.props.item.amount * this.props.ratio) {
      const ratio = amountValue / this.props.item.amount
      this.props.setRatio(Number.isNaN(ratio) ? 0 : ratio)
    }
  }

  render() {
    const item = this.props.item
    return (
      <View style={PANEL}>
        <Text style={PANELTXT} text={item.name} />
        <TextInput
          selectTextOnFocus
          keyboardType="numeric"
          style={PANELTXT}
          value={this.state.amountValue}
          onFocus={this._handleFocus.bind(this)}
          onEndEditing={this._handleEndEditing.bind(this)}
          onChangeText={this._handleChangeText.bind(this)}
        />
        <Text style={PANELTXT} text={item.unit} />
      </View>
    )
  }
}
