package rest

import (
	"errors"
	"my_documents_south_backend/internal/models"
	"my_documents_south_backend/internal/services"
	"time"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHander(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) loginUser(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	token, err := h.authService.LoginUser(c.Context(), &user)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.JSON(token)
}

func (h *AuthHandler) refreshToken(c *fiber.Ctx) error {
	// Получаем ТОЛЬКО refresh_token
	var token models.JwtToken
	if err := c.BodyParser(&token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request body",
			"data":    nil,
		})
	}

	userID, ok := c.Locals("userID").(int64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(models.NewErrorResponse(errors.New("invalid user ID in token"), c.Path()).Log())
	}

	roleInt, ok := c.Locals("roleID").(int)
	var roleID *int = nil
	if ok {
		roleID = &roleInt
	}

	if err := h.authService.RefreshToken(userID, roleID, &token); err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusUnauthorized).JSON(res)
	}

	return c.JSON(&token)
}

func (h *AuthHandler) loginEmployee(c *fiber.Ctx) error {
	var employee models.Employee

	if err := c.BodyParser(&employee); err != nil {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	token, err := h.authService.LoginEmployee(c.Context(), &employee)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.JSON(token)
}

func AuthRouter(
	public fiber.Router,
	protected fiber.Router,
	userService models.UserRepository,
	employeeService models.EmployeeRepository,
) {
	service := services.NewAuthService(employeeService, userService, 10*time.Second)
	handler := NewAuthHander(service)

	public.Post("/users/signin", handler.loginUser)
	public.Post("/employee/signin", handler.loginEmployee)
	protected.Post("/auth/refresh", handler.refreshToken)
}
