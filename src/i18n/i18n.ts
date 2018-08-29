import I18n from "react-native-i18n"

const en = require("./en")
const zhHans = require("./zh-hans")

I18n.fallbacks = true
I18n.defaultLocale = "zh"
I18n.translations = { en, zh: zhHans, "zh-CN": zhHans, "zh-Hans": zhHans }
