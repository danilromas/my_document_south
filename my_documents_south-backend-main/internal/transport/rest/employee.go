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

type EmployeeHandler struct {
	employeeService models.EmployeeService
}

func NewEmployeeHandler(employeeService models.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{employeeService: employeeService}
}

func (h *EmployeeHandler) createEmployee(c *fiber.Ctx) error {
	var employee models.Employee

	if err := c.BodyParser(&employee); err != nil {
		res := models.NewErrorResponse(errors.New("invalid body"), c.Path()).Log()
		return c.Status(fiber.StatusUnprocessableEntity).JSON(res)
	}

	err := h.employeeService.Create(c.Context(), &employee)
	if err != nil {
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(fiber.StatusConflict).JSON(res)
	}

	return c.SendStatus(fiber.StatusCreated)
}
func (h *EmployeeHandler) getEmployee(c *fiber.Ctx) error {
	employees, err := h.employeeService.GetAllWithServices(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(employees)
}
func (h *EmployeeHandler) getEmployeeById(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid employee id"})
	}

	employee, err := h.employeeService.GetByIdWithServices(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "employee not found"})
	}

	return c.Status(fiber.StatusOK).JSON(employee)
}

func (h *EmployeeHandler) deleteEmployee(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		res := models.NewErrorResponse(errors.New("invalid id"), c.Path()).Log()
		return c.Status(fiber.StatusBadRequest).JSON(res)
	}

	err = h.employeeService.Delete(c.Context(), id)
	if err != nil {
		status := fiber.StatusInternalServerError
		if err.Error() == "user not found" {
			status = fiber.StatusNotFound
		}
		res := models.NewErrorResponse(err, c.Path()).Log()
		return c.Status(status).JSON(res)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": id})
}

func (h *EmployeeHandler) addService(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid employee id"})
	}

	var body struct {
		ServiceId int `json:"service_id"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	if body.ServiceId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "service_id is required"})
	}

	if err := h.employeeService.AddService(c.Context(), id, body.ServiceId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusCreated)
}
func (h *EmployeeHandler) removeService(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid employee id"})
	}

	serviceId, err := strconv.Atoi(c.Params("service_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid service id"})
	}

	if err := h.employeeService.RemoveService(c.Context(), id, serviceId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

func EmployeeRoute(db *sqlx.DB, public fiber.Router, protected fiber.Router, roleRepo models.RoleRepository) models.EmployeeRepository {
	repo := repository.NewEmployeeRepository(db)
	service := services.NewEmployeeService(repo, roleRepo, 10*time.Second)
	handler := NewEmployeeHandler(service)

	// OPEN /pub
	public.Post("/employee/signup", handler.createEmployee)
	// ONLY WITH JWT /prot
	protected.Get("/employee", handler.getEmployee)
	protected.Get("/employee/:id", handler.getEmployeeById)
	protected.Delete("/employee/:id", handler.deleteEmployee)
	protected.Post("/employee/:id/service", handler.addService)
	protected.Delete("/employee/:id/service/:service_id", handler.removeService)
	return repo
}
