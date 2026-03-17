package services

import (
	"feature-flag/models"
	"feature-flag/repository"
)

func CreateFeatureFlag(flag models.FeatureFlag) error {
	return repository.CreateFlag(flag)
}

func GetFeatureFlags() ([]models.FeatureFlag, error) {
	return repository.GetAllFlags()
}

func GetFeatureFlagByID(id int) (models.FeatureFlag, error) {
	return repository.GetFlagByID(id)
}

func DeleteFeatureFlag(id int) error {
	return repository.DeleteFlag(id)
}

func UpdateFeatureFlag(id int, flag models.FeatureFlag) error {
	return repository.UpdateFlag(id, flag)
}