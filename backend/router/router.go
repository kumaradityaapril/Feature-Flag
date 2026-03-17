package router

import (
	"feature-flag/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	// health route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Feature Flag Service is running",
		})
	})

	// existing routes
	r.POST("/flags", handlers.CreateFlag)
	r.GET("/flags", handlers.GetFlags)
	r.GET("/flags/:id", handlers.GetFlagByID)
	r.PUT("/flags/:id", handlers.UpdateFlag)
	r.DELETE("/flags/:id", handlers.DeleteFlag)

	return r
}
