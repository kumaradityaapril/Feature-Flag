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
		"https://feature-flag-e8xezao5u-kumaradityaaprils-projects.vercel.app",
	}

	if extra := os.Getenv("ALLOWED_ORIGINS"); extra != "" {
		for _, o := range strings.Split(extra, ",") {
			allowedOrigins = append(allowedOrigins, strings.TrimSpace(o))
		}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

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
