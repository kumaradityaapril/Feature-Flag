package services

import (
	"encoding/json"
	"errors"
	"feature-flag/config"
	"feature-flag/models"
	"feature-flag/repository"
	"hash/fnv"
	"log"
	"strings"
	"sync"
	"time"
)

var (
	globalStatsMu     sync.Mutex
	GlobalKillSwitch bool
)

func SetGlobalKillSwitch(state bool) {
	globalStatsMu.Lock()
	defer globalStatsMu.Unlock()
	GlobalKillSwitch = state
}

func GetGlobalKillSwitch() bool {
	globalStatsMu.Lock()
	defer globalStatsMu.Unlock()
	return GlobalKillSwitch
}

func cacheFlag(flag models.FeatureFlag) {
	if config.RedisClient == nil {
		return
	}
	data, err := json.Marshal(flag)
	if err == nil {
		
		config.RedisClient.Set(config.Ctx, "flag:"+flag.Name, data, 5*time.Minute)
	}
}

func invalidateFlagCache(flagName string) {
	if config.RedisClient == nil {
		return
	}
	config.RedisClient.Del(config.Ctx, "flag:"+flagName)
}

func CreateFeatureFlag(flag models.FeatureFlag) error {
	err := repository.CreateFlag(flag)
	if err != nil {
		return err
	}
	cacheFlag(flag)
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
		invalidateFlagCache(flag.Name)
	}
	return repository.DeleteFlag(id)
}

func UpdateFeatureFlag(id int, flag models.FeatureFlag) error {
	err := repository.UpdateFlag(id, flag)
	if err != nil {
		return err
	}
	cacheFlag(flag)
	return nil
}

func EvaluateFlag(flagName string, req models.EvaluationRequest) (bool, error) {

	
	var val string
	var err error
	
	if config.RedisClient != nil {
		val, err = config.RedisClient.Get(config.Ctx, "flag:"+req.FlagName).Result()
	} else {
		err = errors.New("redis disabled")
	}
	
	var flag models.FeatureFlag
	
	if err == nil {
		
		json.Unmarshal([]byte(val), &flag)
	} else {
		
		flag, err = repository.GetFlagByName(flagName)
		if err != nil {
			return false, err
		}
		cacheFlag(flag)
	}

	log.Println("Evaluating flag:", flag.Name)
	defer RecordEvaluation()

	// 0. System-Wide Kill Switch check (Selective)
	// Only disables flags that have their individual KillSwitch property activated.
	if GetGlobalKillSwitch() && flag.KillSwitch {
		log.Println("Global Kill Switch ACTIVE - Selective Override Engaged for:", flag.Name)
		return false, nil
	}

	// 1. Normal Evaluation continues below...
	if normalizeEnv(flag.Environment) != normalizeEnv(req.Environment) {
		log.Println("Environment mismatch")
		return false, nil
	}

	
	rules := flag.Rules

	
	if users, ok := rules["users"].([]interface{}); ok && len(users) > 0 {
		for _, u := range users {
			if str, ok := u.(string); ok && str == req.UserID {
				log.Println("User in whitelist - ENABLED")
				return true, nil 
			}
		}
	}

	
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

	
	if minVersion, ok := rules["min_version"].(string); ok && minVersion != "" {
		if req.AppVersion != "" && req.AppVersion < minVersion {
			log.Println("App version too low - DISABLED")
			return false, nil
		}
	}

	
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
