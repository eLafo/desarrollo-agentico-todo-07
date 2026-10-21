import { test, expect } from '../fixtures';

test.describe('Tareas', () => {
  test('el recuento cuenta las completadas', async ({ page, tasks }) => {
    const count = page.locator('.list-count');

    // 1. Hay dos tareas, una completada
    await tasks([{ title: 'Comprar pan' }, { title: 'Llamar al gestor', completed: true }]);
    await page.reload();
    await expect(count).toHaveText('2 tareas en tu lista · 1 completada');

    // 2. Completa «Comprar pan» sin recargar
    await page.getByRole('button', { name: 'Completar tarea: Comprar pan' }).click();
    await expect(count).toHaveText('2 tareas en tu lista · 2 completadas');

    // 3. Al recargar, el cambio sigue guardado
    await page.reload();
    await expect(count).toHaveText('2 tareas en tu lista · 2 completadas');
    await expect(page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' })).toBeVisible();

    // 4. Reabre «Comprar pan»
    await page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' }).click();
    await expect(count).toHaveText('2 tareas en tu lista · 1 completada');

    // 5. Reabre «Llamar al gestor»: ya no queda ninguna completada
    await page.getByRole('button', { name: 'Reabrir tarea: Llamar al gestor' }).click();
    await expect(count).toHaveText('2 tareas en tu lista');
    await expect(count).not.toContainText('·');

    // 6. Al recargar, todo sigue pendiente
    await page.reload();
    await expect(count).toHaveText('2 tareas en tu lista');
    await expect(page.getByRole('button', { name: 'Completar tarea: Comprar pan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Completar tarea: Llamar al gestor' })).toBeVisible();
  });
});
