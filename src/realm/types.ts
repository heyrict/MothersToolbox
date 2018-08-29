import * as Realm from "realm"

export interface GlobalConfigType {
  configs: Realm.Configuration[]
  current: Realm.Configuration
}

export interface GlobalConfigConstructor {
  new (): GlobalConfigType
}
