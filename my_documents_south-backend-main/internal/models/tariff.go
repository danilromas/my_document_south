package models

import (
	"context"
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type Tariff struct {
	Id        int        `json:"id,omitempty" db:"id"`
	Name      string     `json:"name,omitempty" db:"name"`
	CreatedAt *time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type TariffRepository interface {
	interfaces.EntityRepository[Tariff]
	SetDefault(c context.Context, id int) error
	GetDefault(c context.Context, tariff *Tariff) error
}

type TariffService interface {
	interfaces.EntityService[Tariff]
}
