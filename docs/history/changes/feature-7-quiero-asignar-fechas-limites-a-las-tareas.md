# Fecha límite en las tareas

**Issue:** #7 · **Tipo:** feature

## Resumen
Cada tarea puede tener una fecha límite de un solo día, sin hora. Se ve en la lista debajo del título y se asigna, cambia o quita desde la pantalla «Editar tarea».

## Qué se construyó
- Columna opcional `due_date` en `tasks`.
- La lista muestra «Fecha límite: DD/MM/AAAA» bajo el título de las tareas que la tienen, también las completadas o ya vencidas.
- La edición tiene un campo de tipo día «Fecha límite»; vacío quita la fecha.
- El servidor rechaza con 422 un valor que no es un día válido («La fecha límite no es válida.») sin tocar la tarea.

## Implementación técnica
| Fichero | Papel |
|---|---|
| `migrations/20261021000000_add_due_date_to_tasks.{up,down}.fizz` | Añade y quita `due_date` (`date`, nula). |
| `models/task.go` | Campo `DueDate *time.Time`; `SetDueDate` (parseo AAAA-MM-DD), `DueDateValue` (para el campo) y `DueDateText` (DD/MM/AAAA para la lista); la validación rechaza el valor inválido. |
| `actions/tasks.go` | `TasksUpdate` lee `due_date` además de `title`. |
| `templates/tasks/index.plush.html`, `edit.plush.html` | Fecha en la lista con `<time datetime>`; campo `type="date"` con ayuda y error propios. |
| `public/assets/app.css`, `templates/application.plush.html` | Estilos de `.task-due` y del campo; `app.css?v=4`. |
| `e2e/tareas/fecha-limite.spec.ts` | Recorrido de navegador: asignar, recargar y quitar. |

Cambios que importan:
- Un valor inválido deja `DueDate` en nil y marca un indicador no persistido (`dueDateInvalid`); `Validate` lo convierte en error del campo `due_date`.
- Solo se guarda el día (`date`), así no hay desfase por zona horaria.
- En `edit.plush.html` los atributos `aria-invalid`/`aria-describedby` del título ahora dependen de `errors.Get("title")` y no de `errors.HasAny()`, para que un error de la fecha no marque el título.
- El orden de la lista no cambia: sigue siendo el de creación.

## Cómo se usa
1. En la lista, «Editar tarea» en la fila.
2. Elegir un día en «Fecha límite» y «Guardar cambios».
3. La lista muestra «Fecha límite: 15/11/2026». Para quitarla, vaciar el campo y guardar.

## Configuración
Requiere aplicar la migración `20261021000000_add_due_date_to_tasks` (`buffalo pop migrate`; en test, `GO_ENV=test buffalo pop migrate`).

## Cómo se probó
Acta de verificación (validado, intento 1): [acta](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/7#issuecomment-6320152023). Plan: [cómo se hace](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/7#issuecomment-6319962033).

| Afirmación | Resultado |
|---|---|
| La lista muestra el día de cada tarea con fecha (también completada o pasada) y ninguno sin ella | Validado; test en rojo sobre la base y en verde sobre el cambio |
| Desde la edición se asigna, cambia y quita la fecha; la base lo refleja | Validado (Go y navegador) |
| Un valor no válido (`2026-02-30`, `mañana`) da 422 y no cambia la tarea | Validado |
| Solo un día, sin hora | Validado |
| Sin regresiones: Go y 6 tests de navegador; la lista sigue en orden de creación | Validado |
| Formato, vet, compilación e imagen Docker | Validado |
| Textos, fidelidad al diff y capas | Validado por juicio de agente |

Para repetir:
```
GO_ENV=test go test -p 1 ./...
npx playwright test
```

## Notas
- La fecha solo se asigna al editar; al crear una tarea se ignora (hay un test que lo fija). Queda fuera de la petición.
- Sin hora, avisos de vencimiento, orden ni filtros por fecha.
- Pendientes menores del acta: el campo se repinta vacío tras un 422 por fecha inválida; la ayuda «Los demás datos de la tarea no cambian.» del título puede leerse contradictoria ahora que el formulario cambia también la fecha; el nombre de `Test_TasksCreate_WithoutDueDate` no dice que crear ignora la fecha.
- Fuera de alcance, sin investigar: en `public/assets/app.js` completar o reabrir con JavaScript parece hacer un GET a una ruta que solo existe como PUT.
