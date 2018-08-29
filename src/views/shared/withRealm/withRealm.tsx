import * as React from "react"
import * as Realm from "realm"
import {
  WithRealmProps,
  WithRealmWrapperProps,
  WithRealmWrapperStates,
  WithRealmWrappedProps,
} from "./withRealm.props"

export const withRealm = (options: WithRealmProps) => (
  Wrapped: React.ComponentType<WithRealmWrappedProps>,
) =>
  class withRealmWrapper extends React.Component<WithRealmWrapperProps, WithRealmWrapperStates> {
    state = {
      loading: true,
      error: null,
      data: {},
    }

    refetch() {
      this.setState({ loading: true })
      Realm.open({ schema: options.schema })
        .then(realm => {
          const result = options.query(realm, this.props)
          this.setState({ data: result, loading: false })
        })
        .catch(error => {
          this.setState({ error, loading: false })
        })
    }

    update() {
      this.forceUpdate()
    }

    componentWillMount() {
      this.refetch()
    }

    render() {
      return (
        <Wrapped
          {...this.props}
          {...this.state}
          update={this.update.bind(this)}
          refetch={this.refetch.bind(this)}
        />
      )
    }
  }
