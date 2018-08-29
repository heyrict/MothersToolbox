import Realm from "realm"

export interface WithRealmProps {
  query?: (realm: Realm, ownProps: any) => object
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
  data: object | ReadonlyArray<{}>
  error?: object
  realm: Realm
  update: () => void
}
