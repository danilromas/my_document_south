package services

import (
	"context"
	"errors"
	"my_documents_south_backend/internal/models"
	"time"
)

type roleService struct {
	roleRepository models.RoleRepository
	contextTimeout time.Duration
	counterRole    int
}

func NewRoleService(roleRepository models.RoleRepository, contextTimeout time.Duration) models.RoleService {
	return &roleService{
		roleRepository: roleRepository,
		contextTimeout: contextTimeout,
		counterRole:    0,
	}
}

func (s *roleService) Create(c context.Context, role *models.Role) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if err := s.roleRepository.Create(ctx, role); err != nil {
		return err
	}

	if s.counterRole != 1 {
		return nil
	}

	// если роль создается первый раз, делаем её главной
	// проверяем, существует ли уже суперроль. например, если счетчик обнулился при рестарте сервера
	var superrole models.Role
	err := s.roleRepository.GetSuperRole(c, &superrole)
	if err == nil {
		return nil
	}

	err = s.roleRepository.SetSuperRole(c, role.Id)
	if err != nil {
		return err
	}

	return nil
}

func (s *roleService) Get(c context.Context) *[]models.Role {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var roles []models.Role

	if err := s.roleRepository.Get(ctx, &roles); err != nil {
		return nil
	}

	return &roles
}

func (s *roleService) GetById(c context.Context, id int) (*models.Role, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if id < 1 {
		return nil, errors.New("incorrect value id")
	}

	role := models.Role{}
	if err := s.roleRepository.GetById(ctx, id, &role); err != nil {
		return nil, err
	}

	return &role, nil
}

func (s *roleService) Update(c context.Context, id int, role *models.Role) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	role.Id = id
	if err := s.roleRepository.Update(ctx, role); err != nil {
		return err
	}

	return nil
}

func (s *roleService) Delete(c context.Context, id int) error {
	if id == 1 {
		return errors.New("impossible to remove the role of superuser")
	}
	return nil
}

func (s *roleService) count() int {
	s.counterRole++
	return s.counterRole
}
