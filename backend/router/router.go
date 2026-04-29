package router

import (
	"feature-flag/handlers"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	allowedOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3000",
		"https://feature-flag-git-main-kumaradityaaprils-projects.vercel.app",
		"https://feature-flag-kumaradityaaprils-projects.vercel.app",
		"https://feature-flag-theta.vercel.app",
	}

	if extra := os.Getenv("ALLOWED_ORIGINS"); extra != "" {
		for _, o := range strings.Split(extra, ",") {
			allowedOrigins = append(allowedOrigins, strings.TrimSpace(o))
		}
	}

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Header("Access-Control-Allow-Headers", "*")
		c.Header("X-Backend-CORS", "Permissive")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.Header("X-Health-Check", "Success")
		c.JSON(200, gin.H{
			"message": "Feature Flag Service is running",
			"status":  "healthy",
		})
	})

	r.POST("/flags", handlers.CreateFlag)
	r.GET("/flags", handlers.GetFlags)
	r.GET("/flags/:id", handlers.GetFlagByID)
	r.PUT("/flags/:id", handlers.UpdateFlag)
	r.DELETE("/flags/:id", handlers.DeleteFlag)
	r.POST("/evaluate", handlers.EvaluateFlag)
	r.GET("/trends", handlers.GetEvaluationTrends)
	r.GET("/settings/kill-switch", handlers.GetGlobalKillSwitchStatus)
	r.POST("/settings/kill-switch", handlers.ToggleGlobalKillSwitch)

	return r
}
