package services

import (
	"context"
	"errors"
	"fmt"
	"github.com/dongri/phonenumber"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"my_documents_south_backend/internal/middleware"
	"my_documents_south_backend/internal/models"
	"my_documents_south_backend/internal/utils/password"
	"time"
)

type AuthService struct {
	employeeRepository models.EmployeeRepository
	userRepository     models.UserRepository
	contextTimeout     time.Duration
}

func NewAuthService(
	employeeRepository models.EmployeeRepository,
	userRepository models.UserRepository,
	contextTimeout time.Duration,
) *AuthService {
	return &AuthService{
		employeeRepository: employeeRepository,
		userRepository:     userRepository,
		contextTimeout:     contextTimeout,
	}
}

func (s *AuthService) LoginEmployee(c context.Context, input *models.Employee) (*models.JwtToken, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	// Поиск сотрудника по почте
	var employee models.Employee
	err := s.employeeRepository.GetByEmail(ctx, input.Email, &employee)
	if err != nil {
		return nil, err
	}

	// Сравнение паролей
	if err := password.Compare(employee.Password, input.Password); err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	// Получение ключа доступа на 24 часа
	accessToken, err := middleware.JWTGenerate(employee.Id, &employee.RoleId, time.Hour)
	if err != nil {
		return nil, err
	}

	// Получение ключа для продления на 7 дней
	refreshToken, err := middleware.JWTGenerate(employee.Id, &employee.RoleId, time.Hour*24*7)
	if err != nil {
		return nil, err
	}

	return &models.JwtToken{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *AuthService) LoginUser(c context.Context, input *models.User) (*models.JwtToken, error) {
	ctx, cancel := context.WithTimeout(c, s.contextTimeout)
	defer cancel()

	// Поиск пользователя по номеру
	var user models.User
	err := s.userRepository.GetByPhone(ctx, phonenumber.Parse(input.Phone, "RU"), &user)
	if err != nil {
		return nil, err
	}

	// Сравнение паролей
	if err := password.Compare(user.Password, input.Password); err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	// Получение ключа доступа на час
	accessToken, err := middleware.JWTGenerate(user.Id, nil, time.Hour)
	if err != nil {
		return nil, err
	}

	// Получение ключа для продления на 7 дней
	refreshToken, err := middleware.JWTGenerate(user.Id, nil, time.Hour*24*7)
	if err != nil {
		return nil, err
	}

	return &models.JwtToken{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *AuthService) RefreshToken(userID int64, roleID *int, token *models.JwtToken) error {
	// Парсим и проверяем refresh token
	var new_token, err = jwt.Parse(token.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte("my_documents_south_jwt_super_secret_key_for_security"), nil
	})

	if err != nil || !new_token.Valid {
		return errors.New("invalid or expired refresh token")
	}

	token.AccessToken, err = middleware.JWTGenerate(userID, roleID, time.Hour)
	if err != nil {
		return errors.New("failed to generate access token")
	}

	token.RefreshToken, err = middleware.JWTGenerate(userID, roleID, 7*24*time.Hour)
	if err != nil {
		return errors.New("failed to generate refresh token")
	}

	return nil
}
