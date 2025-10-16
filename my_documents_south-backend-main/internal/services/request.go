package services

import (
	"context"
	"errors"
	"my_documents_south_backend/internal/models"
	"time"
)

type requestService struct {
	requestRepository  models.RequestRepository
	userRepository     models.UserRepository
	employeeRepository models.EmployeeRepository
	contextTimeout     time.Duration
}

func NewRequestService(
	requestRepository models.RequestRepository,
	userRepository models.UserRepository,
	employeeRepository models.EmployeeRepository,
	contextTimeout time.Duration,
) models.RequestService {
	return &requestService{
		requestRepository:  requestRepository,
		userRepository:     userRepository,
		employeeRepository: employeeRepository,
		contextTimeout:     contextTimeout,
	}
}

func (s *requestService) Create(c context.Context, req *models.Request) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	err := s.requestRepository.Create(ctx, req)
	if err != nil {
		return err
	}

	return nil
}

// Get TODO
func (s *requestService) Get(c context.Context) *[]models.Request { return nil }

func (s *requestService) GetById(c context.Context, id int) (*models.Request, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if id < 1 {
		return nil, errors.New("invalid id")
	}

	req := &models.Request{Id: int64(id)}
	err := s.requestRepository.GetById(ctx, id, req)
	if err != nil {
		return nil, err
	}

	if req.OwnerId != 0 {
		user := &models.User{}
		if err := s.userRepository.GetById(ctx, int(req.OwnerId), user); err == nil {
			req.User = user
		}
	}

	if req.EmployeeId != 0 {
		employee := &models.Employee{}
		if err := s.employeeRepository.GetById(ctx, int(req.EmployeeId), employee); err == nil {
			req.Employee = employee
		}
	}

	return req, nil
}

func (s *requestService) GetWithFilter(c context.Context, filter models.Request) ([]models.Request, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var requests []models.Request
	err := s.requestRepository.GetWithFilter(ctx, &requests, filter)
	if err != nil {
		return nil, err
	}

	for i := range requests {
		req := &requests[i]

		user := &models.User{}
		if err := s.userRepository.GetById(ctx, int(req.OwnerId), user); err == nil {
			req.User = user
		}

		employee := &models.Employee{}
		if err := s.employeeRepository.GetById(ctx, int(req.EmployeeId), employee); err == nil {
			req.Employee = employee
		}

	}

	return requests, nil
}

// Update TODO
func (s *requestService) Update(c context.Context, id int, req *models.Request) error { return nil }

func (s *requestService) UpdateEmployee(ctx context.Context, id int64, employee_id int64) error {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.requestRepository.UpdateEmployee(ctx, id, employee_id)
}

func (s *requestService) UpdateStatus(ctx context.Context, id int64, status int16) error {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.requestRepository.UpdateStatus(ctx, id, status)
}

func (s *requestService) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	return s.requestRepository.Delete(ctx, id)
}
