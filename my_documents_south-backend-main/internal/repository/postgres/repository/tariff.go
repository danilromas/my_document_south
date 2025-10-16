package repository

import (
	"context"
	"errors"
	"fmt"
	"my_documents_south_backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type tariffRepository struct {
	conn *sqlx.DB
}

func NewTariffRepository(db *sqlx.DB) models.TariffRepository {
	return &tariffRepository{conn: db}
}

func (r *tariffRepository) Create(c context.Context, tariff *models.Tariff) error {
	tx, err := r.conn.Beginx()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	if err := tx.GetContext(c, tariff, "INSERT INTO tariff (name) VALUES ($1) returning *", tariff.Name); err != nil {
		// Отменяем транзакцию, в случае возникнования ошибки
		if rollbackError := tx.Rollback(); rollbackError != nil {
			return fmt.Errorf("failed to rollback transaction: %w", rollbackError)
		}
		// Декрементируем ID до актуальной последней записи
		_, resetErr := r.conn.ExecContext(c, `SELECT setval('tariff_id_seq', (SELECT COALESCE(MAX(id), 0) FROM tariff))`)
		if resetErr != nil {
			return fmt.Errorf("failed to reset tariff: %w", resetErr)
		}

		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Применяем транзакцию
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *tariffRepository) Get(c context.Context, tariff *[]models.Tariff) error {
	err := r.conn.SelectContext(c, tariff, "SELECT * FROM tariff")
	if err != nil {
		return err
	}
	return nil
}

func (r *tariffRepository) GetById(c context.Context, id int, tariff *models.Tariff) error {
	err := r.conn.GetContext(c, tariff, "SELECT * FROM tariff WHERE id = $1", id)
	if err != nil {
		return err
	}

	return nil
}

func (r *tariffRepository) SetDefault(c context.Context, id int) error {
	var count int
	err := r.conn.GetContext(c, &count, `SELECT COUNT(*) FROM setting`)
	if err != nil {
		return err
	}

	if count != 0 {
		_, err = r.conn.ExecContext(c, `UPDATE setting SET default_tariff_id = $1`, id)
		if err != nil {
			return err
		}
	}

	_, err = r.conn.ExecContext(c, `INSERT INTO setting (default_tariff_id) VALUES ($1)`, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *tariffRepository) GetDefault(c context.Context, tariff *models.Tariff) error {
	err := r.conn.GetContext(c, tariff, `SELECT * FROM "tariff" t WHERE t.id = (SELECT default_tariff_id FROM setting LIMIT 1)`)
	if err != nil {
		return err
	}
	return nil
}

func (r *tariffRepository) Update(c context.Context, tariff *models.Tariff) error {
	return r.conn.GetContext(c, tariff, "UPDATE tariff SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *;", tariff.Name, tariff.Id)
}

func (r *tariffRepository) Delete(c context.Context, id int) error {
	result, err := r.conn.ExecContext(c, "DELETE FROM tariff WHERE id=$1", id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("tariff not found")
	}
	return nil
}
