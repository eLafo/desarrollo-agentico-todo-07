# El cambio de estado de una tarea no persiste

**Issue:** #5 · **Tipo:** bug

## Resumen
Completar o reabrir una tarea con JavaScript activo cambiaba la página pero no se guardaba: al recargar, la tarea volvía a su estado anterior. El script enviaba una petición `GET` a la ruta de alternar, que solo acepta `PUT`; ahora envía el mismo formulario que sin JavaScript.

## Qué se construyó
- Completar y reabrir una tarea se conservan al recargar, en los dos sentidos.
- La tarea sigue cambiando en la página sin recargarla y no aparece ningún aviso nuevo.
- Un test de navegador cubre el recorrido completo.

## Implementación técnica

| Fichero | Papel |
|---|---|
| `public/assets/app.js` | Sustituye `fetch(form.action)` por un `POST` con el cuerpo del formulario |
| `templates/application.plush.html` | Sube `app.js?v=2` a `?v=3` para que los navegadores carguen el script nuevo |
| `e2e/tareas/completar-y-reabrir-se-conservan.spec.ts` | Test de regresión (nuevo) |
| `docs/knowledge/features/tareas.md` | Viñeta de «Con JavaScript» actualizada al envío vigente |

Cambios que importan:
- `fetch(form.action, { method: "POST", body: new URLSearchParams(new FormData(form)) })`: el cuerpo lleva los campos ocultos `_method=PUT` y `authenticity_token`, así que la petición pasa la protección CSRF y llega a la acción de alternar igual que sin JavaScript.
- No se toca Go: la regla sigue en el servidor y el script solo presenta el cambio y envía el formulario.
- La subida de `?v=3` es necesaria: sin ella, los navegadores con el script en caché seguirían con el fallo.

## Cómo se usa
Sin cambios para el usuario: pulsar «Completar tarea» o «Reabrir tarea» cambia la tarea al instante, y al recargar el estado se conserva.

## Configuración
No requiere configuración.

## Cómo se probó
Acta de verificación (validado, intento 1 de 3): [acta](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/5#issuecomment-6318831650).

- El bug se reproduce sobre el código anterior (vídeo en el acta): tras recargar, las dos tareas vuelven a su estado y la base no cambia.
- El test de navegador nuevo falla sobre la base y pasa con el arreglo.
- Con el arreglo y CSRF activo, el recorrido guarda el estado en base (`f`/`t` pasa a `t`/`f`) y la consola no da errores.
- Sin regresiones: suite completa en verde (6 tests de navegador y Go); `gofmt`, `go vet`, `go build` e imagen de Docker en verde.
- Juicios de estructura, contención del diff, cobertura y documentación, sin hallazgos.

Para repetir:
```
npx playwright test e2e/tareas/completar-y-reabrir-se-conservan.spec.ts
npx playwright test
GO_ENV=test go test -p 1 ./...
```

## Notas
- Fuera de alcance (observaciones del acta, no bloquean): la página no comprueba la respuesta, así que si el guardado falla (red caída, sesión caducada) muestra un estado no guardado hasta recargar; y dos pulsaciones muy seguidas podrían desincronizar la base y la página, porque el servidor alterna el valor guardado (ya era así).
