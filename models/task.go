package models

import (
	"fmt"
	"strings"
	"time"

	"github.com/gobuffalo/pop/v6"
	"github.com/gobuffalo/validate/v3"
	"github.com/gofrs/uuid"
)

// TitleMaxLength es el número máximo de caracteres permitido en el título.
const TitleMaxLength = 200

// dueDateLayout es el formato de la fecha límite en los formularios: el valor de un campo de tipo fecha.
const dueDateLayout = "2006-01-02"

// dueDateTextLayout es el formato con el que se muestra la fecha límite: día/mes/año.
const dueDateTextLayout = "02/01/2006"

// Task representa una tarea de la lista.
type Task struct {
	ID        uuid.UUID  `json:"id" db:"id" form:"-"`
	Title     string     `json:"title" db:"title" form:"title"`
	Completed bool       `json:"completed" db:"completed" form:"-"`
	DueDate   *time.Time `json:"due_date" db:"due_date" form:"-"`
	CreatedAt time.Time  `json:"created_at" db:"created_at" form:"-"`
	UpdatedAt time.Time  `json:"updated_at" db:"updated_at" form:"-"`

	// dueDateInvalid indica que el último valor pasado a SetDueDate no era un día. No se guarda.
	dueDateInvalid bool `db:"-" form:"-"`
}

// Tasks es una colección de Task.
type Tasks []Task

// Validate se ejecuta en cada llamada a los métodos "pop.Validate*".
func (t *Task) Validate(tx *pop.Connection) (*validate.Errors, error) {
	verrs := validate.NewErrors()

	title := strings.TrimSpace(t.Title)
	if title == "" {
		verrs.Add("title", "El título es obligatorio.")
	} else if len([]rune(title)) > TitleMaxLength {
		verrs.Add("title", fmt.Sprintf("El título no puede superar los %d caracteres.", TitleMaxLength))
	}

	if t.dueDateInvalid {
		verrs.Add("due_date", "La fecha límite no es válida.")
	}

	return verrs, nil
}

// SetDueDate fija la fecha límite a partir del valor de un campo de tipo fecha (AAAA-MM-DD).
// Un valor vacío deja la tarea sin fecha límite. Un valor que no es un día válido también la
// deja sin ella, y Validate lo rechaza.
func (t *Task) SetDueDate(value string) {
	t.DueDate = nil
	t.dueDateInvalid = false
	if value == "" {
		return
	}
	day, err := time.Parse(dueDateLayout, value)
	if err != nil {
		t.dueDateInvalid = true
		return
	}
	t.DueDate = &day
}

// DueDateValue devuelve la fecha límite como AAAA-MM-DD, el valor de un campo de tipo fecha,
// o una cadena vacía si la tarea no la tiene.
func (t Task) DueDateValue() string {
	if t.DueDate == nil {
		return ""
	}
	return t.DueDate.Format(dueDateLayout)
}

// DueDateText devuelve la fecha límite como se muestra en la lista, DD/MM/AAAA, o una cadena
// vacía si la tarea no la tiene.
func (t Task) DueDateText() string {
	if t.DueDate == nil {
		return ""
	}
	return t.DueDate.Format(dueDateTextLayout)
}
