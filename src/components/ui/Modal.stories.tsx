import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Modal } from '../Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Open: Story = {
  args: {
    isOpen: true,
    title: 'Example Modal',
    onClose: fn(),
    children: (
      <div>
        <p>This is the modal content.</p>
        <p>You can put any React components here.</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Action Button
        </button>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    title: 'Closed Modal',
    onClose: fn(),
    children: <p>You won't see this.</p>,
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: 'Form Modal',
    onClose: fn(),
    children: (
      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-bold">Name</label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-bold">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter email"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    ),
  },
};


