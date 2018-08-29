import { ViewStyle, TextStyle } from "react-native"
import { color, spacing } from "../../theme"

export const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

export const HEADER: TextStyle = {
  backgroundColor: "burlywood",
  marginBottom: spacing[2],
  paddingBottom: spacing[3],
  paddingHorizontal: 0,
  paddingTop: spacing[3],
}

export const HEADER_TITLE: TextStyle = {
  color: color.palette.white,
  fontSize: 20,
  lineHeight: 30,
  textAlign: "center",
  letterSpacing: 1.5,
  fontWeight: "bold",
}

export const RECIPE_BTN: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: "#5D2555",
  marginVertical: spacing[1],
}

export const RECIPE_BTN_TXT: TextStyle = {
  fontSize: 20,
}

export const LIST: ViewStyle = {
  width: "100%",
  paddingHorizontal: spacing[1],
}

export const MODALVIEW: ViewStyle = {
  backgroundColor: color.palette.white,
  borderRadius: 10,
  alignItems: "stretch",
  justifyContent: "center",
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

export const FULLWIDTH: ViewStyle = {
  width: "100%",
}

export const MODALINPUT: ViewStyle = {
  ...FULLWIDTH,
  backgroundColor: color.palette.white1,
  borderWidth: 2,
  borderColor: color.palette.gray1,
}

export const MODALBTN: ViewStyle = {
  ...FULLWIDTH,
  backgroundColor: color.palette.blue,
}

export const BANNER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
}

export const PANEL: ViewStyle = {
  ...BANNER,
  paddingHorizontal: spacing[2],
  backgroundColor: color.palette.coffee,
}

export const PANELTXT: TextStyle = {
  color: color.palette.white1,
}
