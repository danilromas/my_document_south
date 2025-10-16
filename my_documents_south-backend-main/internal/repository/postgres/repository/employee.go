package repository

import (
	"context"
	"errors"
	"fmt"
	"my_documents_south_backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type employeeRepository struct {
	conn *sqlx.DB
}

// NewEmployeeRepository return pointer by employeeRepository
func NewEmployeeRepository(conn *sqlx.DB) models.EmployeeRepository {
	return &employeeRepository{conn: conn}
}

func (r *employeeRepository) Create(c context.Context, employee *models.Employee) error {
	query := `INSERT INTO "employee" (name, last_name, middle_name, email, password, role_id, active)
			  VALUES ($1, $2, $3, $4, $5, $6, $7)
			  RETURNING *`

	// Начинаем транзакцию
	tx, err := r.conn.Beginx()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	// Выполняем запрос на добавление сотрудника
	if err := tx.GetContext(
		c,
		employee,
		query,
		employee.Name,
		employee.LastName,
		employee.MiddleName,
		employee.Email,
		employee.Password,
		employee.RoleId,
		true,
	); err != nil {
		// Отменяем транзакцию, в случае возникнования ошибки
		if rollbackError := tx.Rollback(); rollbackError != nil {
			return fmt.Errorf("failed to rollback transaction: %w", rollbackError)
		}
		// Декрементируем ID до актуальной последней записи
		_, resetErr := r.conn.ExecContext(c, `SELECT setval('employee_id_seq', (SELECT COALESCE(MAX(id), 0) FROM employee))`)
		if resetErr != nil {
			return fmt.Errorf("failed to reset employee: %w", resetErr)
		}

		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Применяем транзакцию
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *employeeRepository) Get(c context.Context, employee *[]models.Employee) error { return nil }

func (r *employeeRepository) GetById(c context.Context, id int, employee *models.Employee) error {
	return nil
}

func (r *employeeRepository) GetByEmail(c context.Context, email string, employee *models.Employee) error {
	err := r.conn.GetContext(c, employee, `SELECT * FROM "employee" WHERE "email" = $1`, email)
	if err != nil {
		return fmt.Errorf("not fount employee by %s", email)
	}

	return nil
}

// Update TODO
func (r *employeeRepository) Update(c context.Context, employee *models.Employee) error { return nil }

func (r *employeeRepository) Delete(c context.Context, id int) error {
	result, err := r.conn.ExecContext(c, `DELETE FROM "employee" WHERE id=$1`, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("employee not found")
	}
	return nil
}

func (r *employeeRepository) AddService(c context.Context, employee_id int64, service_id int) error {
	query := `INSERT INTO employee_specs (employee_id, service_id) VALUES ($1, $2) ON CONFLICT (employee_id, service_id) DO NOTHING;`
	_, err := r.conn.ExecContext(c, query, employee_id, service_id)
	return err
}

func (r *employeeRepository) RemoveService(c context.Context, employee_id int64, service_id int) error {
	query := `DELETE FROM employee_specs WHERE employee_id = $1 AND service_id = $2;`
	_, err := r.conn.ExecContext(c, query, employee_id, service_id)
	return err
}

func (r *employeeRepository) GetByIdWithServices(ctx context.Context, id int64) (*models.Employee, error) {
	employee := models.Employee{}
	queryEmp := `SELECT * FROM employee WHERE id = $1`
	if err := r.conn.GetContext(ctx, &employee, queryEmp, id); err != nil {
		return nil, err
	}

	querySrv := `
        SELECT s.id, s.name FROM service s
        INNER JOIN employee_specs es ON es.service_id = s.id
        WHERE es.employee_id = $1
    `
	services := []models.Service{}
	if err := r.conn.SelectContext(ctx, &services, querySrv, id); err != nil {
		return nil, err
	}
	employee.Services = services

	return &employee, nil
}

func (r *employeeRepository) GetAllWithServices(ctx context.Context) ([]models.Employee, error) {
	employees := []models.Employee{}
	query := `SELECT
				e.id,
				e.name,
				e.last_name,
				e.middle_name,
				e.email,
				e.password,
				e.active,
				e.created_at,
				e.updated_at,
				r.id AS "role.id",
				r.name AS "role.name"
			FROM "employee" e
			LEFT JOIN "role" r ON e.role_id = r.id`

	if err := r.conn.SelectContext(ctx, &employees, query); err != nil {
		return nil, err
	}

	for i := range employees {
		querySrv := `
            SELECT s.id, s.name FROM service s
            INNER JOIN employee_specs es ON es.service_id = s.id
            WHERE es.employee_id = $1
        `
		services := []models.Service{}
		if err := r.conn.SelectContext(ctx, &services, querySrv, employees[i].Id); err != nil {
			return nil, err
		}
		employees[i].Services = services
	}

	return employees, nil
}
