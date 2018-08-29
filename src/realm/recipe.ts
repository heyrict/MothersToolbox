export const ComponentSchema = {
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

export const RecipeSchema = {
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
