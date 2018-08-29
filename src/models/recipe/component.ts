import { types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ComponentModel = types
  .model("Component")
  .props({})
  .views(self => ({}))
  .actions(self => ({}))

type ComponentType = typeof ComponentModel.Type
export interface Component extends ComponentType {}
type ComponentSnapshotType = typeof ComponentModel.SnapshotType
export interface ComponentSnapshot extends ComponentSnapshotType {}