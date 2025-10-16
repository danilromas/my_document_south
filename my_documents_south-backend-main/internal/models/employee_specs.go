package models

import (
	"time"
)

type EmployeeSpecs struct {
	Id int64 `json:"id,omitempty" db:"id"`

	EmployeeId int64     `json:"employee_id,omitempty" db:"employee_id"`
	Employee   *Employee `json:"employee,omitempty" db:"employee"`

	ServiceId int      `json:"service_id,omitempty" db:"service_id"`
	Service   *Service `json:"service,omitempty" db:"service"`

	CreatedAt time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at,omitempty" db:"updated_at"`
}
