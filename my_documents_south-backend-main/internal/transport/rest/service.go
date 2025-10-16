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

type ServiceHandler struct {
	service models.ServiceService
}

func NewServiceHandler(service models.ServiceService) *ServiceHandler {
	return &ServiceHandler{service: service}
}

func (h *ServiceHandler) createService(c *fiber.Ctx) error {
	var service models.Service

	if err := c.BodyParser(&service); err != nil {
		res := models.NewErrorResponse(errors.New("Некорректное тело запроса"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err := h.service.Create(c.Context(), &service)

	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.JSON(&service)
}

func (h *ServiceHandler) getServices(c *fiber.Ctx) error {
	return c.JSON(h.service.Get(c.Context()))
}

func (h *ServiceHandler) getServiceById(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id", 0)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	service, err := h.service.GetById(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.JSON(service)
}

func (h *ServiceHandler) updateService(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	var service models.Service

	if err := c.BodyParser(&service); err != nil || service.Name == "" {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	err = h.service.Update(c.Context(), id, &service)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.JSON(&service)
}

func (h *ServiceHandler) deleteService(c *fiber.Ctx) error {
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

func ServiceRoute(db *sqlx.DB, group fiber.Router) {
	repo := repository.NewServiceRepository(db)
	service := services.NewServiceService(repo, 10*time.Second)
	handler := NewServiceHandler(service)

	tag := group.Group("/services")
	tag.Post("", handler.createService)
	tag.Get("", handler.getServices)
	tag.Get("/:id", handler.getServiceById)
	tag.Put("/:id", handler.updateService)
	tag.Delete("/:id", handler.deleteService)
}
