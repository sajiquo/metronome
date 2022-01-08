import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Slider } from "./Slider";

export default {
  component: Slider,
  title: "Slider",
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />;

export const Default = Template.bind({});
Default.args = {
  min: 40,
  max: 240,
  step: 1,
};

export const ValidationNegative = Template.bind({});
ValidationNegative.args = {
  min: -40,
  max: -240,
  step: -1,
};

export const ValidationInvert = Template.bind({});
ValidationInvert.args = {
  min: 240,
  max: 40,
  step: 1,
};

export const ValidationFloat = Template.bind({});
ValidationFloat.args = {
  min: 240.22,
  max: 40.333,
  step: 1.444,
};
