package services

import (
	"context"
	"errors"
	"my_documents_south_backend/internal/models"
	"time"
)

type tariffService struct {
	tariffRepository models.TariffRepository
	contextTimeout   time.Duration
	counterTariff    int
}

func NewTariffService(tariffRepository models.TariffRepository, contextTimeout time.Duration) models.TariffService {
	return &tariffService{
		tariffRepository: tariffRepository,
		contextTimeout:   contextTimeout,
		counterTariff:    0,
	}
}

func (s *tariffService) Create(c context.Context, tariff *models.Tariff) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	err := s.tariffRepository.Create(ctx, tariff)
	if err != nil {
		return err
	}

	if s.count() != 1 {
		return nil
	}

	// если тариф создается первый раз, делаем её по умолчанию
	// проверяем, существует ли уже тариф по умолчанию. например, если счетчик обнулился при рестарте сервера
	var default_tariff models.Tariff
	err = s.tariffRepository.GetDefault(c, &default_tariff)
	if err == nil {
		return nil
	}

	err = s.tariffRepository.SetDefault(c, tariff.Id)
	if err != nil {
		return err
	}

	return nil
}

func (s *tariffService) Get(c context.Context) *[]models.Tariff {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var tariff []models.Tariff
	err := s.tariffRepository.Get(ctx, &tariff)
	if err != nil {
		return nil
	}
	return &tariff
}

func (s *tariffService) GetById(c context.Context, id int) (*models.Tariff, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if id < 1 {
		return nil, errors.New("invalid id")
	}

	tariff := &models.Tariff{Id: id}
	err := s.tariffRepository.GetById(ctx, id, tariff)
	if err != nil {
		return nil, err
	}
	return tariff, nil
}

func (s *tariffService) Update(c context.Context, id int, tariff *models.Tariff) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	tariff.Id = id
	if err := s.tariffRepository.Update(ctx, tariff); err != nil {
		return err
	}

	return nil
}

func (s *tariffService) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var tariff models.Tariff
	err := s.tariffRepository.GetDefault(ctx, &tariff)
	if err != nil {
		return err
	}

	if tariff.Id == id {
		return errors.New("impossible to delete the service by default")
	}

	return s.tariffRepository.Delete(ctx, id)
}

func (s *tariffService) count() int {
	s.counterTariff++
	return s.counterTariff
}
