import * as Realm from "realm"

export interface WithRealmProps {
  query?: (realm: Realm, ownProps: any) => object
  schema?: Realm.ObjectSchema[]
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
  refetch: () => void
}
