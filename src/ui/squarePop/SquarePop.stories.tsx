import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SquarePop } from "./SquarePop";

export default {
  component: SquarePop,
  title: "SquarePop",
} as ComponentMeta<typeof SquarePop>;

const Template: ComponentStory<typeof SquarePop> = (args) => (
  <SquarePop {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "1",
  selected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  children: "1",
  selected: true,
};
