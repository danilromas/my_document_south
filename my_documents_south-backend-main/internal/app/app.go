package app

import (
	"my_documents_south_backend/internal/repository/postgres"
	"my_documents_south_backend/internal/transport/rest"

	"github.com/bytedance/sonic"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
)

func Run() {
	app := initFiber()
	app.Use(initSwagger())

	db := postgres.Connect()

	rest.Setup(db, app)

	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}

func initFiber() *fiber.App {
	unmarshal := func(buf []byte, val interface{}) error {
		return sonic.Config{DisallowUnknownFields: true}.Froze().Unmarshal(buf, val)
	}

	return fiber.New(fiber.Config{
		Immutable:   true,
		JSONEncoder: sonic.Marshal,
		JSONDecoder: unmarshal,
	})
}

func initSwagger() fiber.Handler {
	return swagger.New(swagger.Config{
		BasePath: "/",
		FilePath: "./api/swagger.yaml",
		Path:     "docs/swagger",
		Title:    "Swagger My Documents South API",
	})
}
