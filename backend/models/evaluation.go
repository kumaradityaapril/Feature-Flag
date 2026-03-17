package models

type EvaluationRequest struct {
	FlagName   string `json:"flag_name"`
	Environment string `json:"environment"`
}

type EvaluationResponse struct {
	Enabled bool `json:"enabled"`
}