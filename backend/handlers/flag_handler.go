package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"feature-flag/models"
	"feature-flag/services"

	"github.com/gin-gonic/gin"
)

func CreateFlag(c *gin.Context) {

	log.Println("CreateFlag API called")

	var flag models.FeatureFlag

	if err := c.ShouldBindJSON(&flag); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	if flag.Name == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "name is required",
		})
		return
	}

	err := services.CreateFeatureFlag(flag)

	if err != nil {
		fmt.Println("ERROR:", err)
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    "Feature flag created",
	})
	log.Println("Feature flag created:", flag.Name)
}

func GetFlags(c *gin.Context) {

	env := c.Query("environment")

	var flags []models.FeatureFlag
	var err error

	if env != "" {
		flags, err = services.GetFlagsByEnvironment(env)
	} else {
		flags, err = services.GetFeatureFlags()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch flags"})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    flags,
	})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.FlagName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "flag_name is required"})
		return
	}

	log.Println("EvaluateFlag API called for:", req.FlagName)

	result, err := services.EvaluateFlag(req.FlagName, req)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flag not found"})
		return
	}

	log.Println("Evaluation result:", result)

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: gin.H{
			"enabled": result,
		},
	})
}
