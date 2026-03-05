package handlers

import (
	"net/http"

	"feature-flag/models"
	"feature-flag/services"

	"github.com/gin-gonic/gin"
)

func CreateFlag(c *gin.Context) {

	var flag models.FeatureFlag

	if err := c.ShouldBindJSON(&flag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.CreateFeatureFlag(flag)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Feature flag created"})
}

func GetFlags(c *gin.Context) {

	flags, err := services.GetFeatureFlags()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch flags"})
		return
	}

	c.JSON(http.StatusOK, flags)
}