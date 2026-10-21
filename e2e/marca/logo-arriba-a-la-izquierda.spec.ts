import { test, expect } from '../fixtures';

test.describe('Marca', () => {
  test('logo arriba a la izquierda', async ({ page }) => {
    const logo = page.getByRole('img', { name: 'Entaina' });
    const brand = page.getByRole('link', { name: 'Ir a la lista de tareas' });
    const tareas = page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Tareas' });

    // 1. Escritorio: el logo carga y está arriba a la izquierda, encima de «todo.»
    await expect(logo).toBeVisible();
    // La imagen carga y es el fichero de Entaina sin recortar: 640 × 264.
    await expect
      .poll(() =>
        logo.evaluate((img: HTMLImageElement) => (img.complete ? [img.naturalWidth, img.naturalHeight] : [0, 0])),
      )
      .toEqual([640, 264]);
    let box = (await logo.boundingBox())!;
    let brandBox = (await brand.boundingBox())!;
    expect(box.x).toBeLessThan(48);
    expect(box.y).toBeLessThan(48);
    expect(box.y + box.height).toBeLessThanOrEqual(brandBox.y);
    await expect(brand).toBeVisible();
    await expect(tareas).toBeVisible();

    // 2. Pantalla estrecha: sigue arriba a la izquierda, a la izquierda de «todo.», sin desbordar
    await page.setViewportSize({ width: 320, height: 640 });
    await expect(logo).toBeVisible();
    box = (await logo.boundingBox())!;
    brandBox = (await brand.boundingBox())!;
    expect(box.x).toBeLessThan(48);
    expect(box.y).toBeLessThan(48);
    expect(box.x + box.width).toBeLessThanOrEqual(brandBox.x);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
    await expect(brand).toBeVisible();
    await expect(tareas).toBeVisible();
  });
});
