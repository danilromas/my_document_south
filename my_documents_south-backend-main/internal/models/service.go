package models

import (
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type Service struct {
	Id        int        `json:"id,omitempty" db:"id"`
	Name      string     `json:"name,omitempty" db:"name"`
	CreatedAt *time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type ServiceRepository interface {
	interfaces.EntityRepository[Service]
}

type ServiceService interface {
	interfaces.EntityService[Service]
}
