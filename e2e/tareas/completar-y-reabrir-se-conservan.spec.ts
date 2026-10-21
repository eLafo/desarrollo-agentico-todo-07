import { test, expect } from '../fixtures';

test.describe('Tareas', () => {
  test('completar y reabrir se conservan al recargar', async ({ page, tasks }) => {
    await tasks([{ title: 'Comprar pan' }, { title: 'Enviar la factura', completed: true }]);
    await page.reload();

    const isToggle = (response: { url(): string }) => new URL(response.url()).pathname.endsWith('/toggle');

    // 1. Completa «Comprar pan» y espera a que se envíe el cambio
    const completed = page.waitForResponse(isToggle);
    await page.getByRole('button', { name: 'Completar tarea: Comprar pan' }).click();
    await completed;
    await expect(page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' })).toBeVisible();

    // 2. Reabre «Enviar la factura» y espera a que se envíe el cambio
    const reopened = page.waitForResponse(isToggle);
    await page.getByRole('button', { name: 'Reabrir tarea: Enviar la factura' }).click();
    await reopened;
    await expect(page.getByRole('button', { name: 'Completar tarea: Enviar la factura' })).toBeVisible();

    // 3. Tras recargar, los dos estados se conservan
    await page.reload();
    await expect(page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Comprar pan' }).locator('.task-status')).toHaveText('Completada');
    await expect(page.getByRole('button', { name: 'Completar tarea: Enviar la factura' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Enviar la factura' }).locator('.task-status')).toHaveCount(0);
  });
});
