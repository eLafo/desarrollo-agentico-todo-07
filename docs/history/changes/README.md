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

- [feature-3-recuento-tareas-completadas.md](feature-3-recuento-tareas-completadas.md): el recuento de la lista añade « · M completadas» y, con JavaScript, completar/reabrir pasa a guardarse y actualiza el recuento
  - Cuando se trabaje con `templates/tasks/index.plush.html` o el recuento `.list-count` de la cabecera
  - Cuando se modifique `public/assets/app.js` o el envío de completar/reabrir (`/tasks/{id}/toggle`) con JavaScript
  - Cuando se modifique `Tasks` en `models/task.go` o las variables que `TasksIndex` y `TasksCreate` pasan a la plantilla
  - Cuando se investigue un recuento desfasado, o una tarea que vuelve a su estado anterior al recargar
