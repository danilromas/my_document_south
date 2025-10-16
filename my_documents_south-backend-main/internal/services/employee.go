package services

import (
	"context"
	"errors"
	"fmt"
	"my_documents_south_backend/internal/models"
	"my_documents_south_backend/internal/utils/password"
	"regexp"
	"time"
	"unicode"
)

type employeeService struct {
	employeeRepository models.EmployeeRepository
	roleRepository     models.RoleRepository
	contextTimeout     time.Duration
}

func NewEmployeeService(
	employeeRepository models.EmployeeRepository,
	roleRepository models.RoleRepository,
	contextTimeout time.Duration,
) models.EmployeeService {
	return &employeeService{
		employeeRepository: employeeRepository,
		roleRepository:     roleRepository,
		contextTimeout:     contextTimeout,
	}
}

func (s *employeeService) Create(c context.Context, employee *models.Employee) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	hasLetter := false
	hasDigit := false

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(employee.Email) {
		return errors.New("invalid email format")
	}

	if len(employee.Password) < 6 {
		return errors.New("invalid password: must contain at least 6 characters")
	}

	for _, ch := range employee.Password {
		if unicode.IsLetter(ch) {
			hasLetter = true
		}
		if unicode.IsDigit(ch) {
			hasDigit = true
		}
	}
	if !hasLetter || !hasDigit {
		return errors.New("invalid password: must contain at least one letter and one digit")
	}

	var role models.Role
	err := s.roleRepository.GetById(ctx, employee.RoleId, &role)
	if err != nil {
		return fmt.Errorf("failed to check default role: %w", err)
	}

	employee.Password, err = password.Encrypt(employee.Password)
	if err != nil {
		return fmt.Errorf("failed to encrypt password: %w", err)
	}

	err = s.employeeRepository.Create(ctx, employee)
	if err != nil {
		return err
	}
	return nil
}

func (s *employeeService) Get(c context.Context) *[]models.Employee { return nil }

func (s *employeeService) GetById(c context.Context, id int) (*models.Employee, error) {
	return nil, nil
}

func (s *employeeService) Update(c context.Context, id int, employee *models.Employee) error {
	// TODO update employee service
	// DONT TOUCH
	return nil
}

func (s *employeeService) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	return s.employeeRepository.Delete(ctx, id)
}

func (s *employeeService) AddService(ctx context.Context, employeeID int64, serviceID int) error {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.employeeRepository.AddService(ctx, employeeID, serviceID)
}

func (s *employeeService) RemoveService(ctx context.Context, employeeID int64, serviceID int) error {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.employeeRepository.RemoveService(ctx, employeeID, serviceID)
}

func (s *employeeService) GetByIdWithServices(ctx context.Context, id int64) (*models.Employee, error) {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.employeeRepository.GetByIdWithServices(ctx, id)
}

func (s *employeeService) GetAllWithServices(ctx context.Context) ([]models.Employee, error) {
	ctx, cancel := context.WithTimeout(ctx, s.contextTimeout)
	defer cancel()

	return s.employeeRepository.GetAllWithServices(ctx)
}
