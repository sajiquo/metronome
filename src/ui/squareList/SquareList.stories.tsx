import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SquareList } from "./SquareList";

export default {
  component: SquareList,
  title: "SquareList",
} as ComponentMeta<typeof SquareList>;

const Template: ComponentStory<typeof SquareList> = (args) => (
  <SquareList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: [2, 4, 8, 16],
};
