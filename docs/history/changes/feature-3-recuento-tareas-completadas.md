# El recuento de la lista dice cuántas tareas están completadas

**Issue:** #3 · **Tipo:** feature

## Resumen
El recuento de la cabecera de `/` pasa de «N tareas en tu lista» a «N tareas en tu lista · M completadas» cuando hay completadas. Con JavaScript, el recuento se actualiza al completar o reabrir sin recargar, y para ello esa acción pasa a guardarse en el servidor.

## Qué se construyó
| Situación | Texto del recuento |
| --- | --- |
| Sin completadas | `N tareas en tu lista` (como antes; `1 tarea` en singular) |
| Una completada | `N tareas en tu lista · 1 completada` |
| Varias completadas | `N tareas en tu lista · M completadas` |

- El recuento se mantiene también en la pantalla que vuelve con el error de «Añadir» (422).
- Con JavaScript, completar y reabrir actualizan el recuento en la página; sin JavaScript, la respuesta del servidor ya lo trae al día.

## Implementación técnica
| Fichero | Papel |
| --- | --- |
| `models/task.go` | Nuevo `Tasks.CompletedCount()`: el cálculo vive en el modelo. |
| `actions/tasks.go` | `TasksIndex` y la rama 422 de `TasksCreate` pasan `completedCount` a la plantilla. |
| `templates/tasks/index.plush.html` | Añade el sufijo « · 1 completada» / « · M completadas» en `.list-count`. |
| `public/assets/app.js` | El envío de completar/reabrir pasa de `fetch(form.action)` a un `POST` con los datos del formulario (incluye el token de seguridad); lee `.list-count` de la respuesta y copia su texto. |
| `templates/application.plush.html` | Versión del script `?v=2` a `?v=3` para saltar la caché. |
| `docs/knowledge/features/tareas.md` | Actualizada por el propio cambio. |

Cambios que importan:
- **Con JavaScript, completar/reabrir ahora se guarda.** Antes la tarea cambiaba en pantalla pero el `fetch` no la persistía y al recargar volvía atrás. Es una decisión del plan, necesaria para el criterio 3: el recuento lo da el servidor.
- `app.js` no cuenta tareas: copia el texto de `.list-count` de la respuesta.
- Un contador `togglesSent` descarta las respuestas antiguas: con clics rápidos solo se aplica el recuento de la última petición.
- Si la petición falla (`!response.ok`), el recuento se queda como estaba, sin aviso.

## Cómo se usa
Se abre la lista y la cabecera dice cuántas tareas hay y cuántas están completadas. Al pulsar «Completar tarea» o «Reabrir tarea», el recuento cambia al momento y el cambio queda guardado; al recargar, todo sigue igual.

## Configuración
No requiere configuración.

## Cómo se probó
Acta de verificación (intento 1, validado): [acta vigente](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/3#issuecomment-6313179620). Planes: [verificación](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/3#issuecomment-6312864686) · [implementación](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/3#issuecomment-6312790273).

| Afirmación | Resultado |
| --- | --- |
| Criterio 1: «· 1 completada» y «· M completadas» (tests de acciones y de modelo, y capturas) | Rojo sobre la base, verde sobre el cambio |
| Criterio 1: el recuento sigue contando en la pantalla de error de «Añadir» | Verde |
| Criterio 2: sin completadas, solo «N tareas en tu lista» | Verde (también sobre la base: es el comportamiento de hoy) |
| Criterio 3: con JavaScript, 2, 1, 0, 1 y 2 completadas tras cada clic; tras recargar, igual y guardado en la base | Test de navegador rojo sobre la base, verde sobre el cambio; vídeo |
| Criterio 3 sin JavaScript: completar/reabrir devuelven el recuento al día | Verde |
| Sin regresiones: migraciones, 38 tests de Go y 6 de navegador | Verde |
| Textos de la interfaz, fidelidad al criterio y estructura (jueces) | Sin hallazgos bloqueantes |

Para repetirlo:
```sh
go test ./models ./actions
npx playwright test e2e/tareas/recuento-de-completadas.spec.ts
```
(o el skill `check` para todos los gates). Tests nuevos: `models/task_test.go` (`Test_Tasks_CompletedCount`), `actions/tasks_test.go` (cinco `Test_Tasks…Count…`) y `e2e/tareas/recuento-de-completadas.spec.ts`.

## Notas
- Sin decisiones registradas: el humano no respondió preguntas con opciones en este caso.
- El acta deja tres preguntas sin bloqueo: confirmar que guardar con JavaScript es lo deseado, decir en la documentación de la lista que con JavaScript el cambio se guarda (`docs/knowledge/features/tareas.md` no lo dice con esas palabras) y, no pedido, anunciar el cambio del recuento a lectores de pantalla y avisar si falla el envío.
- Limitaciones: sin manejo de error de red en `app.js`, y ningún test ejercita el descarte de respuestas antiguas con clics rápidos.
- Los tests de acciones buscan un trozo del texto, no la línea entera (lo compensan con comprobaciones negativas).
