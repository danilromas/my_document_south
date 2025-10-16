package services

import (
	"context"
	"errors"
	"my_documents_south_backend/internal/models"
	"time"
)

type serviceService struct {
	serviceRepository models.ServiceRepository
	contextTimeout    time.Duration
}

func NewServiceService(serviceRepository models.ServiceRepository, contextTimeout time.Duration) models.ServiceService {
	return &serviceService{serviceRepository: serviceRepository, contextTimeout: contextTimeout}
}

func (s *serviceService) Create(c context.Context, service *models.Service) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	err := s.serviceRepository.Create(ctx, service)
	if err != nil {
		return err
	}

	return nil
}

func (s *serviceService) Get(c context.Context) *[]models.Service {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var service []models.Service
	err := s.serviceRepository.Get(ctx, &service)
	if err != nil {
		return nil
	}

	return &service
}

func (s *serviceService) GetById(c context.Context, id int) (*models.Service, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if id < 1 {
		return nil, errors.New("Некорректное значение id")
	}

	service := models.Service{}
	if err := s.serviceRepository.GetById(ctx, id, &service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (s *serviceService) Update(c context.Context, id int, service *models.Service) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	service.Id = id
	if err := s.serviceRepository.Update(ctx, service); err != nil {
		return err
	}

	return nil
}

func (s *serviceService) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	return s.serviceRepository.Delete(ctx, id)
}
