package models

type EvaluationRequest struct {
	FlagName    string `json:"flag_name"`
	UserID      string `json:"user_id"`
	Country     string `json:"country"`
	AppVersion  string `json:"app_version"`
	Environment string `json:"environment"`
}

type EvaluationResponse struct {
	Enabled bool `json:"enabled"`
}