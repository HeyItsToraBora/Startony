package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"auth-app-backend/database"

	"github.com/golang-jwt/jwt/v5"
)

// Helper function to extract user ID from JWT token
func getUserIDFromToken(r *http.Request) int {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return 0
	}

	// Remove "Bearer " prefix
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		// No Bearer prefix found
		return 0
	}

	// Parse and validate token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte("your-secret-key-change-this-in-production"), nil // This should match your JWT secret
	})

	if err != nil || !token.Valid {
		return 0
	}

	// Extract user ID from claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if userID, ok := claims["user_id"].(float64); ok {
			return int(userID)
		}
	}

	return 0
}

// GetSavedProjects retrieves all projects saved by the authenticated user
func GetSavedProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user ID from JWT token
	userID := getUserIDFromToken(r)
	if userID == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Query to get saved projects with their details
	query := `
		SELECT p.id, p.name, p.description, p.code, p.general_tags, p.programming_tags, p.likes, p.status, p.created_at, p.images,
		       u.username, u.first_name, u.last_name, u.profile_picture
		FROM project_saves sp
		JOIN projects p ON sp.project_id = p.id
		JOIN users u ON p.user_id = u.id
		WHERE sp.user_id = $1
		ORDER BY sp.created_at DESC
	`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []map[string]interface{}
	for rows.Next() {
		var p struct {
			ID          int            `json:"id"`
			Name        string         `json:"name"`
			Description string         `json:"description"`
			Code        string         `json:"code"`
			GeneralTags sql.NullString `json:"general_tags"`
			ProgTags    sql.NullString `json:"programming_tags"`
			Likes       int            `json:"likes"`
			Status      string         `json:"status"`
			CreatedAt   string         `json:"created_at"`
			Images      sql.NullString `json:"images"`
			Username    string         `json:"username"`
			FirstName   sql.NullString `json:"first_name"`
			LastName    sql.NullString `json:"last_name"`
			ProfilePic  sql.NullString `json:"profile_picture"`
		}

		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Code,
			&p.GeneralTags, &p.ProgTags, &p.Likes, &p.Status, &p.CreatedAt, &p.Images,
			&p.Username, &p.FirstName, &p.LastName, &p.ProfilePic,
		)
		if err != nil {
			continue
		}

		// Parse tags and images
		var generalTags []string
		if p.GeneralTags.Valid {
			generalTags = strings.Split(p.GeneralTags.String, ",")
		}

		var progTags []string
		if p.ProgTags.Valid {
			progTags = strings.Split(p.ProgTags.String, ",")
		}

		var images []string
		if p.Images.Valid {
			images = strings.Split(p.Images.String, ",")
		}

		project := map[string]interface{}{
			"id":               p.ID,
			"name":             p.Name,
			"description":      p.Description,
			"code":             p.Code,
			"general_tags":     generalTags,
			"programming_tags": progTags,
			"likes":            p.Likes,
			"status":           p.Status,
			"created_at":       p.CreatedAt,
			"images":           images,
			"developer": map[string]interface{}{
				"username":        p.Username,
				"first_name":      p.FirstName.String,
				"last_name":       p.LastName.String,
				"profile_picture": p.ProfilePic.String,
			},
		}

		projects = append(projects, project)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// HandleProjectActions handles save/unsave actions for projects
func HandleProjectActions(w http.ResponseWriter, r *http.Request) {
	// Get user ID from JWT token
	userID := getUserIDFromToken(r)
	if userID == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract project ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/projects/")
	pathParts := strings.Split(path, "/")

	if len(pathParts) < 2 || pathParts[1] != "save" {
		http.Error(w, "Invalid endpoint", http.StatusNotFound)
		return
	}

	projectID, err := strconv.Atoi(pathParts[0])
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		// Save project
		saveProject(w, r, userID, projectID)
	case http.MethodDelete:
		// Unsave project
		unsaveProject(w, r, userID, projectID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// saveProject adds a project to user's saved projects
func saveProject(w http.ResponseWriter, r *http.Request, userID, projectID int) {
	// Check if project exists
	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM projects WHERE id = $1)", projectID).Scan(&exists)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	// Check if already saved
	var alreadySaved bool
	err = database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM project_saves WHERE user_id = $1 AND project_id = $2)",
		userID, projectID).Scan(&alreadySaved)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if alreadySaved {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Project already saved"})
		return
	}

	// Save the project
	_, err = database.DB.Exec("INSERT INTO project_saves (user_id, project_id) VALUES ($1, $2)", userID, projectID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Project saved successfully"})
}

// unsaveProject removes a project from user's saved projects
func unsaveProject(w http.ResponseWriter, r *http.Request, userID, projectID int) {
	// Delete from saved projects
	result, err := database.DB.Exec("DELETE FROM project_saves WHERE user_id = $1 AND project_id = $2", userID, projectID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Project not found in saved projects", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Project unsaved successfully"})
}
