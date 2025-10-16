package rest

import (
	"errors"
	"my_documents_south_backend/internal/models"
	"my_documents_south_backend/internal/repository/postgres/repository"
	"my_documents_south_backend/internal/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

type UserHandler struct {
	userService models.UserService
}

func NewUserHandler(userService models.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) createUser(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err := h.userService.Create(c.Context(), &user)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (h *UserHandler) getUsers(c *fiber.Ctx) error {
	// TODO get users handler
	return c.JSON(h.userService.Get(c.Context()))
}

func (h *UserHandler) getUserById(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id", 0)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	user, err := h.userService.GetById(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.JSON(user)
}

func (h *UserHandler) deleteUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(errors.New("invalid id"), c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	err = h.userService.Delete(c.Context(), id)
	if err != nil {
		status := fiber.StatusInternalServerError
		if err.Error() == "user not found" {
			status = fiber.StatusNotFound
		}
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(status).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"id": id,
	})
}

func UserRoute(db *sqlx.DB, public fiber.Router, protected fiber.Router, tariffRepo models.TariffRepository) models.UserRepository {
	userRepo := repository.NewUserRepository(db)
	service := services.NewUserService(userRepo, tariffRepo, 10*time.Second)
	handler := NewUserHandler(service)

	public.Post("/users/signup", handler.createUser)
	protected.Get("/users/", handler.getUsers)
	protected.Get("/users/:id", handler.getUserById)
	protected.Delete("/users/:id", handler.deleteUser)

	return userRepo
}
