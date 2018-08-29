/*
import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { withRealm } from "./"

storiesOf("withRealm", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <withRealm text="Click It" preset="primary" onPress={() => window.alert("pressed")} />
      </UseCase>
      <UseCase text="Disabled" usage="The disabled behaviour of the primary button.">
        <withRealm
          text="Click It"
          preset="primary"
          onPress={() => window.alert("pressed")}
          disabled
        />
      </UseCase>
    </Story>
  ))
   */
