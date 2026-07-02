import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  it('shows validation error when title is empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    const submit = screen.getByRole('button', { name: /Ajouter|Modifier/ });
    await user.click(submit);

    expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values and clears fields in create mode', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    const title = screen.getByLabelText('Titre') as HTMLInputElement;
    const desc = screen.getByLabelText('Description') as HTMLTextAreaElement;
    const submit = screen.getByRole('button', { name: /Ajouter/ });

    await user.type(title, '  Nouvelle tâche  ');
    await user.type(desc, '  Une description  ');
    await user.click(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Nouvelle tâche', description: 'Une description' }));
    expect(title.value).toBe('');
    expect(desc.value).toBe('');
  });
});
