package handlers

import (
	"auth-app-backend/database"
	"auth-app-backend/models"
	"auth-app-backend/utils"
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Insert user with all profile information
	var user models.User
	query := `
		INSERT INTO users (username, email, password_hash, first_name, last_name, phone, user_type, 
			github_link, portfolio_link, linkedin_link, company_name) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
		RETURNING id, username, email, first_name, last_name, phone, user_type, 
			github_link, portfolio_link, linkedin_link, company_name, created_at, updated_at`

	err = database.DB.QueryRow(query,
		req.Username, req.Email, string(hashedPassword),
		nullStringFromString(req.FirstName),
		nullStringFromString(req.LastName),
		nullStringFromString(req.Phone),
		nullStringFromString(req.UserType),
		nullStringFromString(req.GithubLink),
		nullStringFromString(req.PortfolioLink),
		nullStringFromString(req.LinkedinLink),
		nullStringFromString(req.CompanyName),
	).Scan(
		&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Phone,
		&user.UserType, &user.GithubLink, &user.PortfolioLink, &user.LinkedinLink,
		&user.CompanyName, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Error creating user (email or username might be taken)", http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Username, user.Email)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Return user data and token
	response := models.AuthResponse{
		Token: token,
		User:  user,
	}
	json.NewEncoder(w).Encode(response)
}

// Helper function to convert string to sql.NullString
func nullStringFromString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{String: s, Valid: true}
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user models.User
	var hash string

	query := `SELECT id, username, email, password_hash, first_name, last_name, phone, user_type, 
		github_link, portfolio_link, linkedin_link, company_name, profile_picture, banner, bio, 
		created_at, updated_at FROM users WHERE email = $1`

	err := database.DB.QueryRow(query, req.Email).Scan(
		&user.ID, &user.Username, &user.Email, &hash, &user.FirstName, &user.LastName, &user.Phone,
		&user.UserType, &user.GithubLink, &user.PortfolioLink, &user.LinkedinLink, &user.CompanyName,
		&user.ProfilePicture, &user.Banner, &user.Bio, &user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT token and return user info
	w.Header().Set("Content-Type", "application/json")

	token, err := utils.GenerateToken(user.ID, user.Username, user.Email)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  user,
	}
	json.NewEncoder(w).Encode(response)
}


func Logout(w http.ResponseWriter, r *http.Request) {
    // In a stateless JWT setup, logout is handled on the client side
    w.Header().Set("Content-Type", "application/json")

    json.NewEncoder(w).Encode(map[string]string{
        "message": "Logged out successfully",
    })
}


func ValidateToken(w http.ResponseWriter, r *http.Request) {
    // This endpoint can be used to validate if a token is still valid
    w.Header().Set("Content-Type", "application/json")
    
    json.NewEncoder(w).Encode(map[string]string{
        "message": "Token is valid",
    })
}
