import { test, expect } from '../fixtures';

test.describe('Tareas', () => {
  test('asignar y quitar una fecha límite', async ({ page, tasks }) => {
    await tasks([{ title: 'Enviar la factura' }, { title: 'Revisar el presupuesto' }]);
    await page.reload();
    await expect(page.locator('.task-due')).toHaveCount(0);

    // 1. Asigna una fecha límite al editar
    await page.getByRole('link', { name: 'Editar tarea: Enviar la factura' }).click();
    await page.getByLabel('Fecha límite', { exact: true }).fill('2026-11-15');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();

    // 2. La lista la muestra y se conserva al recargar
    await expect(page.getByRole('status')).toHaveText('Tarea actualizada.');
    const item = page.getByRole('listitem').filter({ hasText: 'Enviar la factura' });
    await expect(item.locator('.task-due')).toHaveText('Fecha límite: 15/11/2026');
    await expect(page.locator('.task-due')).toHaveCount(1);
    await page.reload();
    await expect(item.locator('.task-due')).toHaveText('Fecha límite: 15/11/2026');

    // 3. Vaciar el campo la quita
    await page.getByRole('link', { name: 'Editar tarea: Enviar la factura' }).click();
    const field = page.getByLabel('Fecha límite', { exact: true });
    await expect(field).toHaveValue('2026-11-15');
    await field.fill('');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByRole('status')).toHaveText('Tarea actualizada.');
    await expect(page.locator('.task-due')).toHaveCount(0);
  });
});
