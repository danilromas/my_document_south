package models

import (
	"context"
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type Request struct {
	Id   int64  `json:"id,omitempty" db:"id"`
	Name string `json:"name,omitempty" db:"name"`

	ServiceId int      `json:"service_id,omitempty" db:"service_id"`
	Service   *Service `json:"service,omitempty" db:"service"`

	OwnerId int64 `json:"owner_id,omitempty" db:"owner_id"`
	User    *User `json:"user,omitempty" db:"user"`

	EmployeeId int64     `json:"employee_id,omitempty" db:"employee_id"`
	Employee   *Employee `json:"employee" db:"employee"`

	Priority  int16      `json:"priority,omitempty" db:"priority"`
	Desc      string     `json:"desc,omitempty" db:"desc"`
	Status    int16      `json:"status,omitempty" db:"status"`
	CreatedAt time.Time  `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	DesiredAt time.Time  `json:"desired_at,omitempty" db:"desired_at"`
	ClosedAt  *time.Time `json:"closed_at,omitempty" db:"closed_at"`
}
type RequestRepository interface {
	interfaces.EntityRepository[Request]
	GetWithFilter(ctx context.Context, i *[]Request, filter Request) error
	UpdateEmployee(ctx context.Context, id int64, employeeId int64) error
	UpdateStatus(ctx context.Context, id int64, status int16) error
}
type RequestService interface {
	interfaces.EntityService[Request]
	GetWithFilter(ctx context.Context, filter Request) ([]Request, error)
	UpdateEmployee(ctx context.Context, id int64, employeeId int64) error
	UpdateStatus(ctx context.Context, id int64, status int16) error
}
