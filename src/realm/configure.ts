import Realm from "realm"
import RecipeConfig from "./recipe"
import { GlobalConfigConstructor } from "./types"

function configureRealm(Config: GlobalConfigConstructor) {
  const config = new Config()
  let next = Realm.schemaVersion(Realm.defaultPath)

  if (next > 0) {
    while (next < config.configs.length) {
      const migratedConfig = config.configs[next++]
      const migratedRealm = new Realm(migratedConfig)
      migratedRealm.close()
    }
  }

  const realm = new Realm(config.current)
  realm.close()
}

export default {
  recipe: () => configureRealm(RecipeConfig),
}
