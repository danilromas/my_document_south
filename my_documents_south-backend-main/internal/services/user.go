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

	"github.com/dongri/phonenumber"
)

type userService struct {
	userRepository   models.UserRepository
	tariffRepository models.TariffRepository
	contextTimeout   time.Duration
}

func NewUserService(userRepository models.UserRepository, tariffRepository models.TariffRepository, contextTimeout time.Duration) models.UserService {
	return &userService{userRepository: userRepository, tariffRepository: tariffRepository, contextTimeout: contextTimeout}
}

func (s *userService) Create(c context.Context, user *models.User) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	hasLetter := false
	hasDigit := false
	normalized := phonenumber.Parse(user.Phone, "RU")

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(user.Email) {
		return errors.New("invalid email format")
	}

	if normalized == "" {
		return errors.New("invalid phone number")
	}
	user.Phone = normalized

	if len(user.Password) < 6 {
		return errors.New("invalid password: must contain at least 6 characters")
	}

	for _, ch := range user.Password {
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

	var tariff models.Tariff
	err := s.tariffRepository.GetDefault(ctx, &tariff)
	if err != nil {
		return fmt.Errorf("failed to check default tariff: %w", err)
	}

	user.TariffId = tariff.Id

	user.Password, err = password.Encrypt(user.Password)
	if err != nil {
		return fmt.Errorf("failed to encrypt password: %w", err)
	}

	err = s.userRepository.Create(ctx, user)
	if err != nil {
		return err
	}

	return nil
}

func (s *userService) Get(c context.Context) *[]models.User {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	var user []models.User
	err := s.userRepository.Get(ctx, &user)
	if err != nil {
		return nil
	}
	return &user
}

func (s *userService) GetById(c context.Context, id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	if id < 1 {
		return nil, errors.New("invalid id")
	}

	user := &models.User{Id: int64(id)}
	err := s.userRepository.GetById(ctx, id, user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) Update(c context.Context, id int, user *models.User) error {
	// TODO update user service
	// DONT TOUCH
	return nil
}

func (s *userService) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	return s.userRepository.Delete(ctx, id)
}
