import { test, expect } from '../fixtures';

test.describe('Tareas', () => {
  test('el recuento dice cuántas tareas están completadas', async ({ page, tasks }) => {
    await tasks([
      { title: 'Comprar pan' },
      { title: 'Llamar al proveedor' },
      { title: 'Revisar el presupuesto', completed: true },
    ]);
    await page.reload();
    const recuento = page.locator('.list-count');

    // 1. Con una tarea completada, el recuento lo dice en singular
    await expect(recuento).toHaveText('3 tareas en tu lista · 1 completada');

    // 2. Completa «Comprar pan»: el recuento pasa a dos completadas sin recargar la página
    await page.evaluate(() => { document.body.dataset.sinRecargar = 'si'; });
    await page.getByRole('button', { name: 'Completar tarea: Comprar pan' }).click();
    await expect(recuento).toHaveText('3 tareas en tu lista · 2 completadas');
    await expect(page.locator('body')).toHaveAttribute('data-sin-recargar', 'si');

    // 3. Al recargar, el cambio sigue
    await page.reload();
    await expect(recuento).toHaveText('3 tareas en tu lista · 2 completadas');
    await expect(page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' })).toBeVisible();

    // 4. Reabre las dos completadas: el recuento vuelve a decir solo el número de tareas
    await page.getByRole('button', { name: 'Reabrir tarea: Comprar pan' }).click();
    await expect(recuento).toHaveText('3 tareas en tu lista · 1 completada');
    await page.getByRole('button', { name: 'Reabrir tarea: Revisar el presupuesto' }).click();
    await expect(recuento).toHaveText('3 tareas en tu lista');

    // 5. Al recargar, sigue sin completadas
    await page.reload();
    await expect(recuento).toHaveText('3 tareas en tu lista');
  });
});
