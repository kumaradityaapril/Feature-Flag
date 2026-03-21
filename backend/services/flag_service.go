package services

import (
	"feature-flag/models"
	"feature-flag/repository"
	"hash/fnv"
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

func EvaluateFlag(flagName string, req models.EvaluationRequest) (bool, error) {

	flag, err := repository.GetFlagByName(flagName)
	if err != nil {
		return false, err
	}

	// 1️⃣ Kill Switch
	if flag.KillSwitch {
		return false, nil
	}

	// 2️⃣ Environment Check
	if flag.Environment != req.Environment {
		return false, nil
	}

	// 3️⃣ Global Boolean
	if !flag.Enabled {
		return false, nil
	}

	// 4️⃣ Parse Rules
	rules := flag.Rules

	// 5️⃣ User Targeting
	if users, ok := rules["users"].([]interface{}); ok {
		found := false
		for _, u := range users {
			if u == req.UserID {
				found = true
				break
			}
		}
		if !found {
			return false, nil
		}
	}

	// 6️⃣ Country Targeting
	if countries, ok := rules["countries"].([]interface{}); ok {
		found := false
		for _, c := range countries {
			if c == req.Country {
				found = true
				break
			}
		}
		if !found {
			return false, nil
		}
	}

	// 7️⃣ Version Targeting (Basic)
	if minVersion, ok := rules["min_version"].(string); ok {
		if req.AppVersion < minVersion {
			return false, nil
		}
	}

	// 8️⃣ Percentage Rollout
	if flag.RolloutPercentage > 0 {
		userPercent := getUserPercentage(req.UserID)
		if userPercent >= flag.RolloutPercentage {
			return false, nil
		}
	}

	return true, nil
}

func getUserPercentage(userID string) int {
	h := fnv.New32a()
	h.Write([]byte(userID))
	return int(h.Sum32() % 100)
}
