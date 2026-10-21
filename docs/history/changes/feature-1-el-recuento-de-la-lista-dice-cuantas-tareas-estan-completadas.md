# El recuento de la lista dice cuántas tareas están completadas

**Issue:** #1 · **Tipo:** feature

## Resumen
El recuento bajo el título de la lista añade cuántas tareas están completadas: «3 tareas en tu lista · 2 completadas». Sin ninguna completada, queda como antes. Para que el recuento se actualice al completar o reabrir con JavaScript, esa acción ahora llega al servidor y se guarda.

## Qué se construyó
- Con alguna completada, el recuento dice «N tareas en tu lista · M completadas»; con una sola, «· 1 completada».
- Sin ninguna completada, dice solo «N tareas en tu lista».
- Al completar o reabrir una tarea, el recuento se actualiza: recargando la página sin JavaScript y, con JavaScript, sin recargarla.

## Implementación técnica
| Fichero | Papel |
| --- | --- |
| `models/task.go` | `Tasks.CompletedCount()` cuenta las tareas con `Completed`. |
| `actions/tasks.go` | `TasksIndex` y la respuesta 422 de `TasksCreate` pasan `completedCount` a la plantilla. |
| `templates/tasks/index.plush.html` | El `<p class="list-count">` añade « · 1 completada» o « · N completadas» según `completedCount`. |
| `public/assets/app.js` | Completar o reabrir envía un `POST` real al formulario y copia el `.list-count` de la respuesta. |
| `templates/application.plush.html` | `app.js?v=2` pasa a `?v=3` para saltar la caché. |
| `docs/knowledge/features/tareas.md` | Describe el recuento nuevo. |

Cambios que importan:
- El recuento sale del servidor, no se calcula en el navegador: el JavaScript solo copia el texto de `.list-count` de la respuesta HTML.
- Antes, `fetch(form.action)` con JavaScript hacía una petición GET que no llegaba a ninguna ruta, así que completar no se guardaba y al recargar volvía al estado anterior. Ahora es un `POST` con los datos del formulario y se guarda.
- Si la respuesta no es correcta o no trae `.list-count`, el recuento no cambia.
- Los errores de validación al crear una tarea también conservan el recuento de completadas.

## Cómo se usa
1. Abre la lista de tareas: bajo «Tareas» se ve el recuento.
2. Completa una tarea: el recuento añade «· 1 completada».
3. Completa más: «· 2 completadas», etc. Al reabrir, baja; sin completadas, la parte «· …» desaparece.

## Configuración
No requiere configuración.

## Cómo se probó
Acta de verificación, intento 1, validada: https://github.com/eLafo/desarrollo-agentico-todo-07/issues/1#issuecomment-6311202559

| Afirmación | Resultado |
| --- | --- |
| Criterio 1: con una, dos o todas completadas, el recuento dice «· 1 completada» o «· N completadas»; se conserva al fallar al crear una tarea | Verificado |
| Criterio 2: sin completadas dice solo «3 tareas en tu lista» | Verificado |
| Criterio 3: con JavaScript, completar y reabrir cambian el recuento sin recargar, también en los extremos (una tarea, todas, la última que se reabre); sin JavaScript, la lista vuelve con el recuento al día | Verificado |
| Tras completar con JavaScript y recargar, la tarea y el recuento siguen igual | Verificado |
| Tests nuevos fallan sin el cambio y pasan con él | Verificado |
| Suite completa: migraciones, Go (`actions`, `models`, `adws`) y navegador (6 pasan) | Verde |

Tests nuevos: `actions/tasks_test.go` (recuento sin, con una y con varias completadas), `models/task_test.go` (`CompletedCount`) y `e2e/tareas/recuento-de-completadas.spec.ts`.

Para repetir (con el entorno del worktree cargado):
```bash
GO_ENV=test go test -p 1 ./...
npx playwright test e2e/tareas/recuento-de-completadas.spec.ts
```

## Notas
- Sin decisiones registradas: el humano no respondió preguntas con opciones.
- El acta dejó tres sugerencias menores sin aplicar: una coma que falta en `docs/knowledge/features/tareas.md` (línea 46), el nombre de la variable `fresh` en `public/assets/app.js` y la legibilidad de la línea del recuento en la plantilla, con dos condiciones encadenadas.
- Queda fuera: mostrar el recuento en otros sitios o cambiar el estilo del recuento.
