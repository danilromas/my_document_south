package middleware

import (
	"time"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTGenerate(userID int64, roleID *int, expiresIn time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = userID
	if roleID != nil {
		claims["role"] = roleID
	}
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Add(expiresIn).Unix()

	return token.SignedString([]byte("my_documents_south_jwt_super_secret_key_for_security"))
}

// Protected protect routes
func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte("my_documents_south_jwt_super_secret_key_for_security")},
		SuccessHandler: func(c *fiber.Ctx) error {
			// Получаем токен из контекста
			token := c.Locals("user").(*jwt.Token)
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"status":  "error",
					"message": "Invalid token claims",
					"data":    nil,
				})
			}

			// Извлекаем userID из claims
			userID, ok := claims["sub"].(float64) // JWT хранит числа как float64
			if !ok {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"status":  "error",
					"message": "Invalid user ID in token",
					"data":    nil,
				})
			}

			// Сохраняем userID в контексте для последующих обработчиков
			c.Locals("userID", int64(userID))

			// Извлекаем userID из claims
			roleID, ok := claims["role"].(float64) // JWT хранит числа как float64
			if ok {
				// Сохраняем userID в контексте для последующих обработчиков
				c.Locals("roleID", int(roleID))
			}

			return c.Next()
		},
		ErrorHandler: jwtError,
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).
			JSON(fiber.Map{"status": "error", "message": "Missing or malformed JWT", "data": nil})
	}
	return c.Status(fiber.StatusUnauthorized).
		JSON(fiber.Map{"status": "error", "message": "Invalid or expired JWT", "data": nil})
}
