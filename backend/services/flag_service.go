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

func EvaluateFlag(flagName string, env string) (bool, error) {

	flag, err := repository.GetFlagByName(flagName)

	if err != nil {
		return false, err
	}

	// Kill Switch (Highest Priority)
	if flag.KillSwitch {
		return false, nil
	}

	// Environment Check
	if flag.Environment != env {
		return false, nil
	}

	// Global Boolean Flag
	if flag.Enabled {
		return true, nil
	}

	return false, nil
}