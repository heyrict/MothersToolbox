import * as Realm from "realm"

export const ComponentSchema: Realm.ObjectSchema = {
  name: "Component",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
    amount: "double?",
    unit: "string?",
    created: "date",
  },
}

export const RecipeSchema: Realm.ObjectSchema = {
  name: "Recipe",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
    components: "Component[]",
    created: "date",
  },
}

export interface RecipeType {
  id: number
  name: string
  created: Date
}

export interface ComponentType {
  id: number
  name: string
  amount: number
  unit?: string
  created: Date
}

const Config: Realm.Configuration = {
  schema: [RecipeSchema, ComponentSchema],
  schemaVersion: 0,
  migration: () => {},
}

export default Config
