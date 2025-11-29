package handlers

import (
	"auth-app-backend/database"
	"auth-app-backend/models"
	"encoding/json"
	"net/http"

	"github.com/lib/pq"
)

func GetProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := database.DB.Query(`
		SELECT p.id, p.name, p.description, p.code, p.general_tags, p.programming_tags, p.likes, p.status, p.created_at, p.images,
		       u.username, u.email
		FROM projects p
		JOIN users u ON p.user_id = u.id
		ORDER BY p.created_at DESC
	`)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	projects := []models.Project{}
	for rows.Next() {
		var p models.Project
		var u models.User
		var genTags, progTags, images []string

		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Code, pq.Array(&genTags), pq.Array(&progTags), &p.Likes, &p.Status, &p.CreatedAt, pq.Array(&images),
			&u.Username, &u.Email,
		)
		if err != nil {
			continue
		}
		p.GeneralTags = genTags
		p.ProgrammingTags = progTags
		p.Images = images
		p.Developer = &u
		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

func CreateProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.Project
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// In a real app, get user_id from context/token
	// For now, hardcode or expect in body. Let's assume passed in body for simplicity of migration
	if req.UserID == 0 {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	// Validate images (max 9 images)
	if len(req.Images) > 9 {
		http.Error(w, "Maximum 9 images allowed", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO projects (user_id, name, description, code, general_tags, programming_tags, likes, status, images)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at
	`
	err := database.DB.QueryRow(
		query,
		req.UserID, req.Name, req.Description, req.Code, pq.Array(req.GeneralTags), pq.Array(req.ProgrammingTags), req.Likes, req.Status, pq.Array(req.Images),
	).Scan(&req.ID, &req.CreatedAt)

	if err != nil {
		http.Error(w, "Error creating project", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(req)
}
