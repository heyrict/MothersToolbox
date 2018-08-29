import Realm from "realm"

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
    viewedTimes: "int",
    tags: "Tag[]",
  },
}

export const TagSchema: Realm.ObjectSchema = {
  name: "Tag",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
    created: "date",
    recipes: {
      type: "linkingObjects",
      objectType: "Recipe",
      property: "tags",
    },
  },
}

export interface RecipeType {
  id: number
  name: string
  created: Date
  viewedTimes: number
  tags: TagType[]
}

export interface ComponentType {
  id: number
  name: string
  amount: number
  unit?: string
  created: Date
}

export interface TagType {
  id: number
  name: string
  recipes: RecipeType[]
}

const Config: Realm.Configuration = {
  schema: [RecipeSchema, ComponentSchema, TagSchema],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const newRecipes = newRealm.objects("Recipe")
      for (let i = 0; i < newRecipes.length; i++) {
        newRecipes[i].viewedTimes = 0
      }
    }
  },
}

export default Config
