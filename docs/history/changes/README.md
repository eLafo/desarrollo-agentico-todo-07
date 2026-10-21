# Cambios documentados

Cada caso que cierra el workflow `adw` deja aquí su documento de cierre: qué se construyó, cómo se usa, cómo se probó y qué conviene saber para trabajar sobre ello. Lo escribe la skill `document` en la rama del caso, y viaja en el PR con el código.

Este índice es condicional: cada entrada dice cuándo conviene cargar su documento. Se llega a él desde [`docs/README.md`](../../README.md): quien planifica, como las skills `feature`, `bug` y `chore`, lee solo los documentos cuyas condiciones encajan con el encargo.

Un documento de cierre cuenta qué pasó en su caso, y no se reescribe cuando otro caso cambia el mismo código. Lo vigente está en `docs/knowledge/` y `docs/procedures/`.

## Formato de las entradas

```markdown
- [<tipo>-<N>-<slug>.md](<tipo>-<N>-<slug>.md): <qué cambió, en una línea>
  - Cuando se trabaje con <rutas, acciones o plantillas concretas>
  - Cuando se modifique <modelo, campo o regla relacionados>
  - Cuando se investigue <un problema concreto de esa área>
```

Entre tres y cinco condiciones por documento, y las entradas en orden por número de issue. Si un documento ya tiene entrada, se actualizan sus condiciones en lugar de añadir otra.

## Índice

- [bug-5-el-cambio-de-estado-de-una-tarea-no-persiste.md](bug-5-el-cambio-de-estado-de-una-tarea-no-persiste.md): completar y reabrir una tarea con JavaScript ahora se guarda: `app.js` envía el formulario por `POST` con `_method=PUT` y el token CSRF
  - Cuando se trabaje con `public/assets/app.js` o con la versión del script en `templates/application.plush.html`
  - Cuando se modifique la ruta `PUT /tasks/{task_id}/toggle` o el botón de completar y reabrir en la lista de tareas
  - Cuando se añada una petición `fetch` desde el navegador que cambie datos (método, CSRF, `_method`)
  - Cuando se investigue un cambio de estado de tarea que se pierde al recargar la página
