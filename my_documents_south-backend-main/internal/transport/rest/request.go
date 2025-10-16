package rest

import (
	"errors"
	"my_documents_south_backend/internal/models"
	"my_documents_south_backend/internal/repository/postgres/repository"
	"my_documents_south_backend/internal/services"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

type RequestHandler struct {
	requestService models.RequestService
}

func NewRequestHandler(reqService models.RequestService) *RequestHandler {
	return &RequestHandler{reqService}
}

func (h *RequestHandler) createRequest(c *fiber.Ctx) error {
	var req models.Request

	if err := c.BodyParser(&req); err != nil {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err := h.requestService.Create(c.Context(), &req)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.Status(fiber.StatusCreated).JSON(req)
}

func (h *RequestHandler) getRequestById(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id", 0)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	user, err := h.requestService.GetById(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusNotFound).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func (h *RequestHandler) getRequestsWithFilter(c *fiber.Ctx) error {
	filter := models.Request{}

	if ownerIdStr := c.Query("owner_id"); ownerIdStr != "" {
		if ownerId, err := strconv.ParseInt(ownerIdStr, 10, 64); err == nil {
			filter.OwnerId = ownerId
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid owner_id"})
		}
	}
	if serviceIdStr := c.Query("service_id"); serviceIdStr != "" {
		if serviceId, err := strconv.ParseInt(serviceIdStr, 10, 32); err == nil {
			filter.ServiceId = int(serviceId)
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid service_id"})
		}
	}

	if statusStr := c.Query("status"); statusStr != "" {
		if status, err := strconv.ParseInt(statusStr, 10, 16); err == nil {
			filter.Status = int16(status)
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid status"})
		}
	}

	if employeeIdStr := c.Query("employee_id"); employeeIdStr != "" {
		if employeeId, err := strconv.ParseInt(employeeIdStr, 10, 64); err == nil {
			filter.EmployeeId = employeeId
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid employee_id"})
		}
	}

	if desiredAt := c.Query("desired_at"); desiredAt != "" {
		if t, err := time.Parse(time.RFC3339, desiredAt); err == nil {
			filter.DesiredAt = t
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid desired_at"})
		}
	}

	requests, err := h.requestService.GetWithFilter(c.Context(), filter)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusInternalServerError).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(requests)
}

func (h *RequestHandler) updateRequestEmployee(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request id"})
	}

	type payload struct {
		EmployeeId int64 `json:"employee_id"`
	}

	var body payload
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	if body.EmployeeId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "employee_id is required"})
	}

	if err := h.requestService.UpdateEmployee(c.Context(), id, body.EmployeeId); err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusInternalServerError).JSON(res)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *RequestHandler) updateRequestStatus(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request id"})
	}

	type payload struct {
		Status int16 `json:"status"`
	}

	var body payload
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	if body.Status == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "status is required"})
	}

	if err := h.requestService.UpdateStatus(c.Context(), id, body.Status); err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusInternalServerError).JSON(res)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *RequestHandler) deleteRequest(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(errors.New("invalid id"), c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	err = h.requestService.Delete(c.Context(), id)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": id})
}

func RequestRoute(db *sqlx.DB, protected fiber.Router, user models.UserRepository, employee models.EmployeeRepository) {
	repo := repository.NewRequestRepository(db)
	service := services.NewRequestService(repo, user, employee, 10*time.Second)

	handler := NewRequestHandler(service)

	tag := protected.Group("/request")
	tag.Post("", handler.createRequest)
	tag.Get("", handler.getRequestsWithFilter)
	tag.Get("/:id", handler.getRequestById)
	tag.Patch("/:id/employee", handler.updateRequestEmployee)
	tag.Patch("/:id/status", handler.updateRequestStatus)
	tag.Delete("/:id", handler.deleteRequest)
}
