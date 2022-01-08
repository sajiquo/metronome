import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Slider } from "./Slider";

export default {
  component: Slider,
  title: "Slider",
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />;

export const Default = Template.bind({});
