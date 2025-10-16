package models

import (
	"context"
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type Role struct {
	Id        int        `json:"id,omitempty" db:"id"`
	Name      string     `json:"name,omitempty" db:"name"`
	CreatedAt *time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type RoleRepository interface {
	interfaces.EntityRepository[Role]
	SetSuperRole(c context.Context, id int) error
	GetSuperRole(c context.Context, role *Role) error
}

type RoleService interface {
	interfaces.EntityService[Role]
}
