import Realm from "realm"

export interface WithRealmProps {
  query?: (realm: Realm, ownProps: {[key: string]: any}) => object
  config: Realm.Configuration
}

export interface WithRealmWrapperProps {}

export interface WithRealmWrapperStates {
  loading: boolean
  data: object | ReadonlyArray<{}>
  error?: object
}

export interface WithRealmWrappedProps {
  loading: boolean
  error?: object
  realm: Realm
  update: () => void
}
