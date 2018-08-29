import { RecipeModel, Recipe } from "./recipe"

test("can be created", () => {
  const instance: Recipe = RecipeModel.create({})

  expect(instance).toBeTruthy()
})