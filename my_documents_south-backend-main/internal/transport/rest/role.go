package rest

import (
	"errors"
	"my_documents_south_backend/internal/repository/postgres/repository"
	"my_documents_south_backend/internal/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"

	"my_documents_south_backend/internal/models"
)

type RoleHandler struct {
	service models.RoleService
}

func NewRoleHandler(roleService models.RoleService) *RoleHandler {
	return &RoleHandler{service: roleService}
}

func (h *RoleHandler) createRole(c *fiber.Ctx) error {
	_, ok := c.Locals("roleID").(int)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(nil)
	}

	var role models.Role

	if err := c.BodyParser(&role); err != nil {
		res := models.NewErrorResponse(errors.New("Некорретное тело запроса"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err := h.service.Create(c.Context(), &role)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.JSON(&role)
}

func (h *RoleHandler) getRoles(c *fiber.Ctx) error {
	return c.JSON(h.service.Get(c.Context()))
}

func (h *RoleHandler) getRoleById(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id", 0)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	role, err := h.service.GetById(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.JSON(role)
}

func (h *RoleHandler) updateRole(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	var role models.Role

	if err := c.BodyParser(&role); err != nil || role.Name == "" {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err = h.service.Update(c.Context(), id, &role)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.JSON(&role)
}

func (h *RoleHandler) deleteRole(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(errors.New("invalid id"), c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	err = h.service.Delete(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": id})
}

func RoleRoute(db *sqlx.DB, public fiber.Router, protected fiber.Router) models.RoleRepository {
	repo := repository.NewRoleRepository(db)
	service := services.NewRoleService(repo, 10*time.Second)
	handler := NewRoleHandler(service)

	// OPEN
	public.Post("/roles", handler.createRole)
	// ONLY WITH JWT
	protected.Get("/roles", handler.getRoles)
	protected.Get("/roles/:id", handler.getRoleById)
	protected.Put("/roles/:id", handler.updateRole)
	protected.Delete("/roles/:id", handler.deleteRole)

	return repo
}
