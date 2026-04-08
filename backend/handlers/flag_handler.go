package handlers

import (
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
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	if flag.Name == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "name is required"})
		return
	}

	if flag.Environment == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "environment is required"})
		return
	}

	if err := services.CreateFeatureFlag(flag); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	log.Println("Feature flag created:", flag.Name)
	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: "Feature flag created"})
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
		c.JSON(http.StatusInternalServerError, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: flags})
}

func GetFlagByID(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "invalid ID"})
		return
	}

	flag, err := services.GetFeatureFlagByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	if flag.ID == 0 {
		c.JSON(http.StatusNotFound, models.APIResponse{Success: false, Error: "flag not found"})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: flag})
}

func DeleteFlag(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "invalid ID"})
		return
	}

	if err := services.DeleteFeatureFlag(id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: "Feature flag deleted"})
}

func UpdateFlag(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "invalid ID"})
		return
	}

	var flag models.FeatureFlag
	if err := c.ShouldBindJSON(&flag); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	if err := services.UpdateFeatureFlag(id, flag); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: "Feature flag updated"})
}

func EvaluateFlag(c *gin.Context) {

	var req models.EvaluationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	if req.FlagName == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "flag_name is required"})
		return
	}

	if req.UserID == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{Success: false, Error: "user_id is required"})
		return
	}

	log.Println("EvaluateFlag API called for:", req.FlagName)

	result, err := services.EvaluateFlag(req.FlagName, req)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{Success: false, Error: err.Error()})
		return
	}

	log.Println("Evaluation result:", result)
	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: gin.H{"enabled": result}})
}

func GetEvaluationTrends(c *gin.Context) {
	trends := services.GetTrends()
	c.JSON(http.StatusOK, models.APIResponse{Success: true, Data: trends})
}
