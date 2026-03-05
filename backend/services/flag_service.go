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