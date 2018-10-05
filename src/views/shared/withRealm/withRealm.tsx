import * as React from "react"
import Realm from "realm"
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
    realm: Realm
    state = {
      loading: true,
      error: null,
      data: {},
    }

    update() {
      this.forceUpdate()
    }

    componentWillMount() {
      this._reload()
    }

    componentDidUpdate(prevProps) {
      if (options.checkReload && options.checkReload(prevProps, this.props)) {
        this._reload()
      }
    }

    _reload() {
      this.setState({ loading: true })
      this.realm = new Realm(options.config)
      try {
        const result = options.query(this.realm, this.props)
        this.setState({ data: result, loading: false })
      } catch (error) {
        this.setState({ error, loading: false })
      }
    }

    render() {
      const { loading, error, data } = this.state
      return (
        <Wrapped
          {...this.props}
          {...data}
          loading={loading}
          error={error}
          update={this.update.bind(this)}
          realm={this.realm}
        />
      )
    }
  }
