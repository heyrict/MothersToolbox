import * as Realm from "realm"
import recipe_v0 from "./recipe"
import recipe_v1 from "./recipe-v1"
import { GlobalConfigType } from "../types"

export class GlobalConfig implements GlobalConfigType {
  configs: Realm.Configuration[] = [recipe_v0, recipe_v1]

  get current() {
    return this.configs[this.configs.length - 1]
  }
}

export default GlobalConfig
export * from "./recipe-v1"
