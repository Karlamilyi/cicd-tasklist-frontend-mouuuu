import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';

const mockTask = {
  id: 1,
  title: 'Tâche test',
  description: 'Desc',
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

describe('TaskItem', () => {
    it('renders task and toggles', async () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();
        const onEdit = vi.fn();
        const user = userEvent.setup();

        render(<TaskItem task={mockTask as any} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);

        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        await user.click(checkbox);
        expect(onToggle).toHaveBeenCalledWith(1);

        const editBtn = screen.getByRole('button', { name: /Modifier/ });
        await user.click(editBtn);

        const titleInput = screen.getByLabelText('Modifier le titre') as HTMLInputElement;
        await userEvent.type(titleInput, ' mod');

        const save = screen.getByRole('button', { name: /Enregistrer/ });
        await user.click(save);
        expect(onEdit).toHaveBeenCalled();

        const deleteBtn = screen.getByRole('button', { name: /Supprimer/ });
        await user.click(deleteBtn);
        await user.click(deleteBtn);
        expect(onDelete).toHaveBeenCalledWith(1);
    });
});
