import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Circle } from "./Circle";

export default {
  component: Circle,
  title: "Circle",
} as ComponentMeta<typeof Circle>;

const Template: ComponentStory<typeof Circle> = (args) => <Circle {...args} />;

export const Default = Template.bind({});
