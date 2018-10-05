import Realm from "realm"

export interface RealmQueryProps {
  children: (any) => any
  query?: (realm: Realm) => object
  config: Realm.Configuration
}

export interface RealmQueryStates {
  loading: boolean
  data: object | ReadonlyArray<{}>
  error?: object
}
