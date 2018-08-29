import { ComponentModel, Component } from "./component"

test("can be created", () => {
  const instance: Component = ComponentModel.create({})

  expect(instance).toBeTruthy()
})