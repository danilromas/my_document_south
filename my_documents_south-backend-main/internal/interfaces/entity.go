package interfaces

import "context"

type EntityRepository[T any] interface {
	Create(c context.Context, object *T) error
	Get(c context.Context, object *[]T) error
	GetById(c context.Context, id int, object *T) error
	Update(c context.Context, object *T) error
	Delete(c context.Context, id int) error
}

type EntityService[T any] interface {
	Create(c context.Context, object *T) error
	Get(c context.Context) *[]T
	GetById(c context.Context, id int) (*T, error)
	Update(c context.Context, id int, object *T) error
	Delete(c context.Context, id int) error
}
