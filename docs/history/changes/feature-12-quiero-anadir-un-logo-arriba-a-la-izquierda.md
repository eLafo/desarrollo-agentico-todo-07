# Logo de Entaina arriba a la izquierda

**Issue:** #12 · **Tipo:** feature

## Resumen
Todas las pantallas muestran el logo de Entaina en la esquina de arriba a la izquierda, encima de la marca «todo.» en pantalla ancha y a su izquierda en pantalla estrecha. El logo es una copia sin modificar del gris que publica la página de marca de Entaina, servida por la propia aplicación.

## Qué se construyó
- Un logo (`<img alt="Entaina">`) en la plantilla base, visible en la lista y en la edición de tareas.
- Pantalla ancha: encima de «todo.», en la barra lateral, con el dibujo a 2 rem de alto.
- Pantalla estrecha: a la izquierda de «todo.», en la barra superior, con el dibujo a 1,125 rem.

## Implementación técnica
| Fichero | Papel |
| --- | --- |
| `templates/application.plush.html` | Añade el `<img>` antes de la marca en la barra lateral; sube la versión de la hoja de estilos a `?v=4`. |
| `public/assets/app.css` | Clase `.brand-logo` y su variante en la media query de pantalla estrecha; `.app-brand` recibe `margin-right: auto`. |
| `public/assets/entaina-logo.png` | Logo gris de Entaina, 640 × 264, sin modificar. |
| `actions/tasks_test.go` | Tests de Go: la lista y la edición contienen la imagen y su texto alternativo. |
| `e2e/marca/logo-arriba-a-la-izquierda.spec.ts` | Test de navegador: el logo se ve, carga, está arriba a la izquierda y sobre «todo.», también a 390 px. |
| `docs/knowledge/features/tareas.md`, `docs/knowledge/overview.md` | Documentación viva actualizada por el propio cambio. |

Cambios que importan:
- El PNG tiene márgenes transparentes alrededor del dibujo (12 px izquierda, 44 arriba, 16 derecha, 79 abajo, sobre 612 × 141). El CSS los compensa con márgenes negativos calculados desde `--logo-drawing`, así el dibujo queda pegado a la esquina y alineado con «todo.».
- En pantalla ancha no se compensa el margen inferior, para que la imagen no se monte sobre «todo.».
- Alto y ancho explícitos (`width="640" height="264"`) en el `<img>` y `width: auto` en el CSS mantienen la proporción del fichero sin saltos de maquetación.
- Sin Go de producción ni JavaScript: solo plantilla, CSS y un estático.

## Cómo se usa
No requiere acción: el logo aparece en cada página que usa la plantilla base. El logo no es un enlace; la marca «todo.» sigue llevando a la lista.

## Configuración
No requiere configuración.

## Cómo se probó
Acta de verificación (validado, intento 2 de 3): [issue #12](https://github.com/eLafo/desarrollo-agentico-todo-07/issues/12#issuecomment-6323319205).

| Afirmación | Resultado |
| --- | --- |
| El logo se ve arriba a la izquierda en lista y edición, a 1280 px y a 390 px, sin desbordar | Cumple |
| El fichero es idéntico (huella) al logo gris de la página de marca de Entaina y se pinta sin filtro, mezcla ni opacidad | Cumple |
| Contraste de las letras con el fondo: 4,76:1 (mínimo 3:1) | Cumple |
| El test de navegador nuevo falla sobre la base y pasa con el cambio | Cumple |
| «todo.» y «Tareas» siguen en la barra lateral; la marca lleva a la lista | Cumple |
| Suite completa y gates (formato, análisis, migraciones, compilación, Docker) | Cumple |
| Juicios: texto alternativo, test fiel al criterio, alcance del diff, documentación, capas del repositorio | Cumple, confianza alta |

Para repetirlo, desde la raíz del repositorio: la skill `check` ejecuta todos los gates. Por separado, `GO_ENV=test go test -p 1 ./...` para los tests de Go y `npx playwright test` para los de navegador.

## Notas
- Queda a criterio del humano si la versión del logo, su tamaño y su convivencia con «todo.» son los deseados (no bloquea).
- El test de navegador solo recorre la lista; la edición queda cubierta por los tests de Go.
- «Encima de la navegación» se comprueba de forma indirecta, a través de «todo.».
- Si se sustituye el PNG por otro con distintos márgenes, hay que recalcular las constantes del CSS (`264`, `141`, `12`, `44`, `16`, `79`).
