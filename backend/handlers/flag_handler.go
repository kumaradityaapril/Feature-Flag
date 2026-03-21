package handlers

import (
	"fmt"
	"net/http"
	"strconv"

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
		fmt.Println("ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
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

func GetFlagByID(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	flag, err := services.GetFeatureFlagByID(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flag not found"})
		return
	}

	c.JSON(http.StatusOK, flag)
}

func DeleteFlag(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = services.DeleteFeatureFlag(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete flag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Flag deleted successfully"})
}

func UpdateFlag(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var flag models.FeatureFlag

	if err := c.ShouldBindJSON(&flag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err = services.UpdateFeatureFlag(id, flag)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update flag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Flag updated successfully"})
}

func EvaluateFlag(c *gin.Context) {

	var req models.EvaluationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	result, err := services.EvaluateFlag(req.FlagName, req)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flag not found"})
		return
	}

	c.JSON(http.StatusOK, models.EvaluationResponse{
		Enabled: result,
	})
}
