package services

import (
	"feature-flag/models"
	"feature-flag/repository"
	"hash/fnv"
	"log"
	"strings"
)

var flagCache = make(map[string]models.FeatureFlag)

func CreateFeatureFlag(flag models.FeatureFlag) error {
	err := repository.CreateFlag(flag)
	if err != nil {
		return err
	}
	flagCache[flag.Name] = flag
	return nil
}

func GetFeatureFlags() ([]models.FeatureFlag, error) {
	return repository.GetAllFlags()
}

func GetFlagsByEnvironment(env string) ([]models.FeatureFlag, error) {
	return repository.GetFlagsByEnvironment(env)
}

func GetFeatureFlagByID(id int) (models.FeatureFlag, error) {
	return repository.GetFlagByID(id)
}

func DeleteFeatureFlag(id int) error {
	flag, err := repository.GetFlagByID(id)
	if err == nil {
		delete(flagCache, flag.Name)
	}
	return repository.DeleteFlag(id)
}

func UpdateFeatureFlag(id int, flag models.FeatureFlag) error {
	err := repository.UpdateFlag(id, flag)
	if err != nil {
		return err
	}
	flagCache[flag.Name] = flag
	return nil
}

func EvaluateFlag(flagName string, req models.EvaluationRequest) (bool, error) {

	// 1️⃣ Check cache first
	flag, exists := flagCache[req.FlagName]
	if !exists {
		var err error
		flag, err = repository.GetFlagByName(flagName)
		if err != nil {
			return false, err
		}
		flagCache[req.FlagName] = flag
	}

	log.Println("Evaluating flag:", flag.Name)

	// 1️⃣ Kill Switch
	if flag.KillSwitch {
		log.Println("Kill switch enabled")
		return false, nil
	}

	// 2️⃣ Environment Check
	if normalizeEnv(flag.Environment) != normalizeEnv(req.Environment) {
		log.Println("Environment mismatch")
		return false, nil
	}

	// 3️⃣ Parse Rules
	rules := flag.Rules

	// 4️⃣ User Targeting (Whitelist)
	if users, ok := rules["users"].([]interface{}); ok && len(users) > 0 {
		for _, u := range users {
			if str, ok := u.(string); ok && str == req.UserID {
				log.Println("User in whitelist - ENABLED")
				return true, nil // Bypass the rest!
			}
		}
	}

	// 5️⃣ Country Targeting (Restrictive Filter)
	if countries, ok := rules["countries"].([]interface{}); ok && len(countries) > 0 {
		found := false
		for _, c := range countries {
			if str, ok := c.(string); ok && strings.EqualFold(str, req.Country) {
				found = true
				break
			}
		}
		if !found {
			log.Println("Country not in allowed list - DISABLED")
			return false, nil
		}
	}

	// 6️⃣ Version Targeting (Restrictive Filter)
	if minVersion, ok := rules["min_version"].(string); ok && minVersion != "" {
		if req.AppVersion != "" && req.AppVersion < minVersion {
			log.Println("App version too low - DISABLED")
			return false, nil
		}
	}

	// 7️⃣ Percentage Rollout
	if flag.RolloutPercentage > 0 && flag.RolloutPercentage < 100 {
		userPercent := getUserPercentage(req.UserID)
		if userPercent >= flag.RolloutPercentage {
			log.Println("Did not meet rollout percentage - DISABLED")
			return false, nil
		}
		log.Println("Met rollout percentage - ENABLED")
		return true, nil
	} else if flag.RolloutPercentage == 100 {
		log.Println("100% Rollout - ENABLED")
		return true, nil
	}

	// 8️⃣ Global Boolean (Fallback)
	if !flag.Enabled {
		log.Println("Flag disabled globally")
		return false, nil
	}

	log.Println("Flag enabled globally")
	return true, nil
}

func getUserPercentage(userID string) int {
	h := fnv.New32a()
	h.Write([]byte(userID))
	return int(h.Sum32() % 100)
}

func normalizeEnv(env string) string {
	env = strings.ToLower(env)
	if env == "production" || env == "prod" {
		return "prod"
	}
	return env
}
