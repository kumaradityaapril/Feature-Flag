package models

import "time"

type FeatureFlag struct {
	ID                int       `json:"id"`
	Name              string    `json:"name"`
	Enabled           bool      `json:"enabled"`
	Environment       string    `json:"environment"`
	RolloutPercentage int       `json:"rollout_percentage"`
	Rules             string    `json:"rules"`
	KillSwitch        bool      `json:"kill_switch"`
	CreatedAt         time.Time `json:"created_at"`
}