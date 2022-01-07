import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "./Button";

export default {
  component: Button,
  title: "Button",
  argTypes: {
    mode: {
      options: ["normal", "active", "inactive"],
      control: { type: "radio" },
    },
    onClick: { action: "clicked" },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  mode: "normal",
};
