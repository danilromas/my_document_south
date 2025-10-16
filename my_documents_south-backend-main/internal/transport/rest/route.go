package rest

import (
	"my_documents_south_backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func Setup(db *sqlx.DB, app *fiber.App) {
	publicRouter := app.Group("/pub")

	protectedRouter := app.Group("/prot")
	protectedRouter.Use(middleware.Protected())

	roleRepository := RoleRoute(db, publicRouter, protectedRouter)
	tariffRepository := TariffRoute(db, publicRouter, protectedRouter)
	employeeRepository := EmployeeRoute(db, publicRouter, protectedRouter, roleRepository)
	userRepository := UserRoute(db, publicRouter, protectedRouter, tariffRepository)
	RequestRoute(db, protectedRouter, userRepository, employeeRepository)
	ServiceRoute(db, protectedRouter)
	AuthRouter(publicRouter, protectedRouter, userRepository, employeeRepository)
}
