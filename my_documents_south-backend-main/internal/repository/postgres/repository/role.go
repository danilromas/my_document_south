package repository

import (
	"context"
	"errors"
	"fmt"
	"my_documents_south_backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type roleRepository struct {
	conn *sqlx.DB
}

func NewRoleRepository(db *sqlx.DB) models.RoleRepository {
	return &roleRepository{conn: db}
}

func (r *roleRepository) Create(c context.Context, role *models.Role) error {
	tx, err := r.conn.Beginx()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	if err := tx.GetContext(c, role, "INSERT INTO role (name) VALUES ($1) RETURNING *", role.Name); err != nil {
		// Отменяем транзакцию, в случае возникнования ошибки
		if rollbackError := tx.Rollback(); rollbackError != nil {
			return fmt.Errorf("failed to rollback transaction: %w", rollbackError)
		}
		// Декрементируем ID до актуальной последней записи
		_, resetErr := r.conn.ExecContext(c, `SELECT setval('role_id_seq', (SELECT COALESCE(MAX(id), 0) FROM role))`)
		if resetErr != nil {
			return fmt.Errorf("failed to reset role: %w", resetErr)
		}

		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Применяем транзакцию
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *roleRepository) Get(c context.Context, roles *[]models.Role) error {
	if err := r.conn.SelectContext(c, roles, "SELECT * FROM role"); err != nil {
		return err
	}

	return nil
}

func (r *roleRepository) GetById(c context.Context, id int, role *models.Role) error {
	err := r.conn.GetContext(c, role, "SELECT * FROM role WHERE id = $1", id)
	if err != nil {
		return err
	}

	return nil
}

func (r *roleRepository) SetSuperRole(c context.Context, id int) error {
	var count int
	err := r.conn.GetContext(c, &count, `SELECT COUNT(*) FROM setting`)
	if err != nil {
		return err
	}

	if count != 0 {
		_, err = r.conn.ExecContext(c, `UPDATE setting SET superuser_role_id = $1`, id)
		if err != nil {
			return err
		}
	}

	_, err = r.conn.ExecContext(c, `INSERT INTO setting (superuser_role_id) VALUES ($1)`, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *roleRepository) GetSuperRole(c context.Context, role *models.Role) error {
	err := r.conn.GetContext(c, role, `SELECT * FROM "role" r WHERE r.id = (SELECT "superuser_role_id" FROM "setting" LIMIT 1)`)
	if err != nil {
		return err
	}
	return nil
}

func (r *roleRepository) Update(c context.Context, role *models.Role) error {
	return r.conn.GetContext(c, role, "UPDATE role SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *;", role.Name, role.Id)
}

func (r *roleRepository) Delete(c context.Context, id int) error {
	result, err := r.conn.ExecContext(c, "DELETE FROM role WHERE id=$1", id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("role not found")
	}
	return nil
}
