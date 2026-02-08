import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ExportButton } from '../ExportButton';
import type { Application } from '../../../api/applications';

const mockApplications: Application[] = [
  {
    id: 1,
    company: 'Google',
    role: 'Senior Frontend Developer',
    status: 'applied',
    link: 'https://careers.google.com',
    salaryMin: 20000,
    salaryMax: 30000,
    tags: '["Remote","Startup"]',
    rating: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Full Stack Engineer',
    status: 'hr_interview',
    link: null,
    salaryMin: 18000,
    salaryMax: 25000,
    tags: '["Hybrid"]',
    rating: 4,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
  },
  {
    id: 3,
    company: 'Meta',
    role: 'React Developer',
    status: 'offer',
    link: 'https://careers.meta.com',
    salaryMin: 25000,
    salaryMax: 35000,
    tags: '["Remote","Dream Job"]',
    rating: 5,
    createdAt: '2024-01-10',
    updatedAt: '2024-02-01',
  },
];

const meta: Meta<typeof ExportButton> = {
  title: 'Applications/ExportButton',
  component: ExportButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ExportButton>;

export const WithApplications: Story = {
  args: {
    applications: mockApplications,
  },
};

export const EmptyList: Story = {
  args: {
    applications: [],
  },
};

export const SingleApplication: Story = {
  args: {
    applications: [mockApplications[0]],
  },
};

