package repository

import (
	"context"
	"feature-flag/config"
	"feature-flag/models"
)

func CreateFlag(flag models.FeatureFlag) error {

	query := `
	INSERT INTO feature_flags
	(name, enabled, environment, rollout_percentage, rules, kill_switch)
	VALUES ($1,$2,$3,$4,$5,$6)
	`

	_, err := config.DB.Exec(
		context.Background(),
		query,
		flag.Name,
		flag.Enabled,
		flag.Environment,
		flag.RolloutPercentage,
		flag.Rules,
		flag.KillSwitch,
	)

	return err
}

func GetAllFlags() ([]models.FeatureFlag, error) {

	rows, err := config.DB.Query(context.Background(), "SELECT * FROM feature_flags")

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var flags []models.FeatureFlag

	for rows.Next() {

		var flag models.FeatureFlag

		err := rows.Scan(
			&flag.ID,
			&flag.Name,
			&flag.Enabled,
			&flag.Environment,
			&flag.RolloutPercentage,
			&flag.Rules,
			&flag.KillSwitch,
			&flag.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		flags = append(flags, flag)
	}

	return flags, nil
}