# Quitar la barra de notificación de arriba

**Issue:** #9 · **Tipo:** feature

## Resumen
La aplicación ya no muestra la barra de avisos que salía arriba tras añadir, editar o eliminar una tarea («Tarea creada.», «Tarea actualizada.», «Tarea eliminada.»). El resultado de cada acción se ve en la propia lista.

## Qué se construyó
- Ninguna pantalla muestra avisos de confirmación, en ninguna acción.
- Se retiran la plantilla de avisos y los estilos que solo usaba ella.
- Los tests de navegador pasan a comprobar que no sale ningún aviso.
- La documentación viva (`docs/knowledge/`) refleja el nuevo comportamiento.

## Implementación técnica

| Fichero | Cambio |
| --- | --- |
| `templates/_flash.plush.html` | Eliminado |
| `templates/application.plush.html` | Quita `partial("flash.plush.html")` |
| `public/assets/app.css` | Quita `.flash` y `.flash-success` |
| `e2e/tareas/anadir-una-tarea.spec.ts`, `editar-una-tarea.spec.ts`, `eliminar-pide-confirmacion.spec.ts` | Sustituyen la espera del texto del aviso por `getByRole('status')` con `toHaveCount(0)` |
| `docs/knowledge/features/tareas.md`, `docs/knowledge/overview.md` | Quitan los avisos de las descripciones y de la tabla de `templates/` |

No cambia código Go ni modelos.

## Cómo se usa
Nada que hacer: añadir, editar, completar, reabrir o eliminar una tarea deja la lista actualizada, sin barra encima.

## Configuración
No requiere configuración.

## Cómo se probó
Acta de verificación (validado, intento 1 de 3): https://github.com/eLafo/desarrollo-agentico-todo-07/issues/9#issuecomment-6321308185

- Criterio 1: tras añadir, editar, completar y eliminar, 0 elementos de aviso y ninguno de los tres textos en las siete pantallas del recorrido.
- Los tres tests de navegador de añadir, editar y eliminar, con la comprobación nueva, fallan sobre la base (3 de 3) y pasan sobre el cambio.
- Suite completa en verde: migraciones, tests de Go y 5 tests de navegador.

Para repetirlo (con el servicio `db` en marcha): `GO_ENV=test go test -p 1 ./...` y `npx playwright test`.

## Notas
- **Las acciones siguen generando avisos que nadie muestra.** `actions/tasks.go` sigue llamando a `c.Flash().Add("success", ...)` al crear, actualizar y eliminar, aunque ninguna plantilla lo pinta. Se dejó así a propósito; quitarlo sería otro caso.
- **Las convenciones están desfasadas.** `docs/procedures/conventions.md` aún dice que las acciones «añaden un flash» (tabla de capas y sección de acciones) y menciona los flashes en el material de revisión de textos.
- Al recorrer la aplicación se vio un fallo previo y ajeno a este cambio: «Completar» cambia la tarea en pantalla pero no se guarda, porque el navegador llama a la ruta con un método que no admite y el servidor responde 404.
