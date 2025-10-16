package models

import (
	"context"
	"my_documents_south_backend/internal/interfaces"
	"time"
)

type User struct {
	Id         int64  `json:"id,omitempty" db:"id"`
	Name       string `json:"name,omitempty" db:"name"`
	LastName   string `json:"last_name,omitempty" db:"last_name"`
	MiddleName string `json:"middle_name,omitempty" db:"middle_name"`
	Email      string `json:"email,omitempty" db:"email"`
	Phone      string `json:"phone,omitempty" db:"phone"`
	Password   string `json:"password,omitempty" db:"password"`

	TariffId int     `json:"tariff_id,omitempty" db:"tariff_id"`
	Tariff   *Tariff `json:"tariff,omitempty" db:"tariff"`

	Inn       string     `json:"inn,omitempty" db:"inn"`
	Snils     string     `json:"snils,omitempty" db:"snils"`
	CreatedAt time.Time  `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type UserRepository interface {
	interfaces.EntityRepository[User]
	GetByPhone(context.Context, string, *User) error
}

type UserService interface {
	interfaces.EntityService[User]
}
