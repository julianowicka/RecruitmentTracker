import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['applied', 'hr_interview', 'tech_interview', 'offer', 'rejected'],
      description: 'Status aplikacji',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Applied: Story = {
  args: {
    status: 'applied',
  },
};

export const HRInterview: Story = {
  args: {
    status: 'hr_interview',
  },
};

export const TechInterview: Story = {
  args: {
    status: 'tech_interview',
  },
};

export const Offer: Story = {
  args: {
    status: 'offer',
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge status="applied" />
      <Badge status="hr_interview" />
      <Badge status="tech_interview" />
      <Badge status="offer" />
      <Badge status="rejected" />
    </div>
  ),
};


