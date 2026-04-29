package router

import (
	"feature-flag/handlers"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
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
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

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
	r.GET("/trends", handlers.GetEvaluationTrends)
	r.GET("/settings/kill-switch", handlers.GetGlobalKillSwitchStatus)
	r.POST("/settings/kill-switch", handlers.ToggleGlobalKillSwitch)

	return r
}
