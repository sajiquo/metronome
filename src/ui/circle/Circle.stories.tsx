import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Circle } from "./Circle";

export default {
  component: Circle,
  title: "Circle",
  argTypes: {
    mode: {
      options: ["normal", "active", "inactive"],
      control: { type: "radio" },
    },
    onClick: { action: "clicked" },
  },
} as ComponentMeta<typeof Circle>;

const Template: ComponentStory<typeof Circle> = (args) => (
  <Circle {...args}>{args.children}</Circle>
);

export const Default = Template.bind({});
Default.args = {
  mode: "normal",
  children: <>121</>,
};
