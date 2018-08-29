import { types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RecipeModel = types
  .model("Recipe")
  .props({})
  .views(self => ({}))
  .actions(self => ({}))

type RecipeType = typeof RecipeModel.Type
export interface Recipe extends RecipeType {}
type RecipeSnapshotType = typeof RecipeModel.SnapshotType
export interface RecipeSnapshot extends RecipeSnapshotType {}