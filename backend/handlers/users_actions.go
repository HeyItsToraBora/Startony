package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"auth-app-backend/database"
)

type FollowResponse struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	Following bool   `json:"following"`
}

type FollowStatusResponse struct {
	Success   bool `json:"success"`
	Following bool `json:"following"`
}

func FollowUser(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST method for follow/unfollow
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Method not allowed"})
		return
	}

	// Extract username from URL
	vars := mux.Vars(r)
	username := vars["username"]
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Username required"})
		return
	}

	// Get user ID from JWT token
	userID := getUserIDFromToken(r)
	if userID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Unauthorized"})
		return
	}

	// Get the user to follow's ID from username
	var targetUserID int
	err := database.DB.QueryRow("SELECT id FROM users WHERE username = $1", username).Scan(&targetUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "User not found"})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Database error"})
		}
		return
	}

	// Check if user is trying to follow themselves
	if userID == targetUserID {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Cannot follow yourself"})
		return
	}

	// Check if already following
	var isFollowing bool
	err = database.DB.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2)",
		userID, targetUserID,
	).Scan(&isFollowing)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Database error"})
		return
	}

	var response FollowResponse

	if isFollowing {
		// Unfollow the user
		_, err = database.DB.Exec(
			"DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
			userID, targetUserID,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Failed to unfollow"})
			return
		}
		response = FollowResponse{
			Success:   true,
			Message:   "Successfully unfollowed",
			Following: false,
		}
	} else {
		// Follow the user
		_, err = database.DB.Exec(
			"INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
			userID, targetUserID,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(FollowResponse{Success: false, Message: "Failed to follow"})
			return
		}
		response = FollowResponse{
			Success:   true,
			Message:   "Successfully followed",
			Following: true,
		}
	}

	json.NewEncoder(w).Encode(response)
}

// CheckFollowStatus checks if the current user is following the target user
func CheckFollowStatus(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET method
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	// Extract username from URL
	vars := mux.Vars(r)
	username := vars["username"]
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	// Get user ID from JWT token
	userID := getUserIDFromToken(r)
	if userID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	// Get the target user's ID from username
	var targetUserID int
	err := database.DB.QueryRow("SELECT id FROM users WHERE username = $1", username).Scan(&targetUserID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	// Check if user is trying to check their own follow status
	if userID == targetUserID {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	// Check if following
	var isFollowing bool
	err = database.DB.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2)",
		userID, targetUserID,
	).Scan(&isFollowing)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(FollowStatusResponse{Success: false, Following: false})
		return
	}

	response := FollowStatusResponse{
		Success:   true,
		Following: isFollowing,
	}

	json.NewEncoder(w).Encode(response)
}
