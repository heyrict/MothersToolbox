import * as React from "react"
import Realm from "realm"
import {
  RealmQueryProps,
  RealmQueryStates,
} from "./RealmQuery.props"

export class RealmQuery extends React.Component<RealmQueryProps, RealmQueryStates> {
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
    this.setState({ loading: true })
    this.realm = new Realm(this.props.config)
    try {
      const result = this.props.query(this.realm)
      this.setState({ data: result, loading: false })
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  addListeners = () => {
    this.props.subscribe.forEach(schema => {
      const name = getResultsName(schema);
      this.results[name] = context.reactRealmInstance.objects(schema);
      this.results[name].addListener(this.updateView);
    });
  };

  removeListeners = () => {
    this.schemaList.forEach(schema => {
      this.results[getResultsName(schema)].removeListener(this.updateView);
    });
    this.results = {};
  };

  render() {
    const { loading, error, data } = this.state
    return (
      <
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

export default RealmQuery
