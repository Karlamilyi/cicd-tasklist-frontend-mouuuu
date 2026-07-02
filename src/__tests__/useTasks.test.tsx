import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as taskApi from '../api/taskApi';
import { useTasks } from '../hooks/useTasks';

function Harness() {
  const { tasks, loading, error, addTask, editTask, removeTask, toggleComplete } = useTasks();
  return (
    <div>
      <div data-testid="tasks">{JSON.stringify(tasks)}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? ''}</div>
      <button onClick={() => addTask({ title: 'A' } as any)}>add</button>
      <button onClick={() => editTask(1, { title: 'Edited' } as any)}>edit</button>
      <button onClick={() => removeTask(1)}>remove</button>
      <button onClick={() => toggleComplete(1)}>toggle</button>
    </div>
  );
}

const mockTask = {
  id: 1,
  title: 'T1',
  description: null,
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useTasks', () => {
    it('loads tasks on mount and supports CRUD operations', async () => {
        vi.spyOn(taskApi, 'getTasks').mockResolvedValue([mockTask as any]);
        vi.spyOn(taskApi, 'createTask').mockResolvedValue({ ...mockTask, id: 2, title: 'T2' } as any);
        vi.spyOn(taskApi, 'updateTask').mockImplementation(async (id: number, data: any) => ({ ...mockTask, id, ...data } as any));
        vi.spyOn(taskApi, 'deleteTask').mockResolvedValue(undefined as any);

        const user = userEvent.setup();
        render(<Harness />);

        await waitFor(() => expect(screen.getByTestId('tasks')).toHaveTextContent('T1'));

        await user.click(screen.getByText('add'));
        await waitFor(() => expect(screen.getByTestId('tasks')).toHaveTextContent('T1'));

        await user.click(screen.getByText('edit'));
        await waitFor(() => expect(screen.getByTestId('tasks')).toHaveTextContent('Edited'));

        await user.click(screen.getByText('toggle'));
        await waitFor(() => expect(screen.getByTestId('tasks')).toHaveTextContent('true'));

        await user.click(screen.getByText('remove'));
        await waitFor(() => expect(screen.getByTestId('tasks')).toHaveTextContent('"id":2'));
    });
});
