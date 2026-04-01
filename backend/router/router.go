package router

import (
	"feature-flag/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	r.Use(cors.Default())

	
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Feature Flag Service is running",
		})
	})

	
	r.POST("/flags", handlers.CreateFlag)
	r.GET("/flags", handlers.GetFlags)
	r.GET("/flags/:id", handlers.GetFlagByID)
	r.PUT("/flags/:id", handlers.UpdateFlag)
	r.DELETE("/flags/:id", handlers.DeleteFlag)
	r.POST("/evaluate", handlers.EvaluateFlag)

	return r
}
