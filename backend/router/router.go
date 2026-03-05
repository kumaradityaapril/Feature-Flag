package router

import (
	"feature-flag/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	r.POST("/flags", handlers.CreateFlag)
	r.GET("/flags", handlers.GetFlags)

	return r
}