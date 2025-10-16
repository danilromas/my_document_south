package models

import (
	"context"
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type Employee struct {
	Id         int64  `json:"id,omitempty" db:"id"`
	Name       string `json:"name,omitempty" db:"name"`
	LastName   string `json:"last_name,omitempty" db:"last_name"`
	MiddleName string `json:"middle_name,omitempty" db:"middle_name"`
	Email      string `json:"email,omitempty" db:"email"`
	Password   string `json:"password,omitempty" db:"password"`

	RoleId int   `json:"role_id,omitempty" db:"role_id"`
	Role   *Role `json:"role,omitempty" db:"role"`

	Services []Service `json:"services,omitempty" db:"services"`

	Active    bool       `json:"active,omitempty" db:"active"`
	CreatedAt time.Time  `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type EmployeeRepository interface {
	interfaces.EntityRepository[Employee]
	GetByEmail(c context.Context, email string, employee *Employee) error
	AddService(ctx context.Context, id int64, id2 int) error
	RemoveService(ctx context.Context, id int64, id2 int) error
	GetByIdWithServices(ctx context.Context, id int64) (*Employee, error)
	GetAllWithServices(ctx context.Context) ([]Employee, error)
}

type EmployeeService interface {
	interfaces.EntityService[Employee]
	AddService(ctx context.Context, id int64, id2 int) error
	RemoveService(ctx context.Context, id int64, id2 int) error
	GetByIdWithServices(ctx context.Context, id int64) (*Employee, error)
	GetAllWithServices(ctx context.Context) ([]Employee, error)
}
