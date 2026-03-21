package repository

import (
	"context"
	"encoding/json"
	"feature-flag/config"
	"feature-flag/models"
)

func CreateFlag(flag models.FeatureFlag) error {

	query := `
	INSERT INTO feature_flags
	(name, enabled, environment, rollout_percentage, rules, kill_switch)
	VALUES ($1,$2,$3,$4,$5,$6)
	`

	rulesJSON, _ := json.Marshal(flag.Rules)

	_, err := config.DB.Exec(
		context.Background(),
		query,
		flag.Name,
		flag.Enabled,
		flag.Environment,
		flag.RolloutPercentage,
		rulesJSON,
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
		var rulesBytes []byte

		err := rows.Scan(
			&flag.ID,
			&flag.Name,
			&flag.Enabled,
			&flag.Environment,
			&flag.RolloutPercentage,
			&rulesBytes,
			&flag.KillSwitch,
			&flag.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		json.Unmarshal(rulesBytes, &flag.Rules)

		flags = append(flags, flag)
	}

	return flags, nil
}

func GetFlagByID(id int) (models.FeatureFlag, error) {

	query := "SELECT * FROM feature_flags WHERE id=$1"

	var flag models.FeatureFlag
	var rulesBytes []byte

	err := config.DB.QueryRow(context.Background(), query, id).Scan(
		&flag.ID,
		&flag.Name,
		&flag.Enabled,
		&flag.Environment,
		&flag.RolloutPercentage,
		&rulesBytes,
		&flag.KillSwitch,
		&flag.CreatedAt,
	)

	json.Unmarshal(rulesBytes, &flag.Rules)

	return flag, err
}

func DeleteFlag(id int) error {

	query := "DELETE FROM feature_flags WHERE id=$1"

	_, err := config.DB.Exec(context.Background(), query, id)

	return err
}

func UpdateFlag(id int, flag models.FeatureFlag) error {

	query := `
	UPDATE feature_flags
	SET name=$1, enabled=$2, environment=$3, rollout_percentage=$4, rules=$5, kill_switch=$6
	WHERE id=$7
	`

	rulesJSON, _ := json.Marshal(flag.Rules)

	_, err := config.DB.Exec(
		context.Background(),
		query,
		flag.Name,
		flag.Enabled,
		flag.Environment,
		flag.RolloutPercentage,
		rulesJSON,
		flag.KillSwitch,
		id,
	)

	return err
}

func GetFlagByName(name string) (models.FeatureFlag, error) {

	query := "SELECT * FROM feature_flags WHERE name=$1"

	var flag models.FeatureFlag
	var rulesBytes []byte

	err := config.DB.QueryRow(context.Background(), query, name).Scan(
		&flag.ID,
		&flag.Name,
		&flag.Enabled,
		&flag.Environment,
		&flag.RolloutPercentage,
		&rulesBytes,
		&flag.KillSwitch,
		&flag.CreatedAt,
	)

	json.Unmarshal(rulesBytes, &flag.Rules)

	return flag, err
}
