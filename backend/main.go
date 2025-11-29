package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"auth-app-backend/database"
	"auth-app-backend/handlers"
	"auth-app-backend/utils"

	"github.com/gorilla/mux"
)

func main() {
	// Connect to Database
	database.Connect()

	// Helper function to extract user ID from JWT token
	getUserIDFromToken := func(r *http.Request) int {
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

		// Validate token and extract user ID
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			return 0
		}

		return claims.UserID
	}

	// CORS Middleware
	corsMiddleware := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // your frontend
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			// ⚡ This handles the preflight request
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next(w, r) // normal requests go to your handler
		}
	}

	// Setup Routes with mux
	router := mux.NewRouter()

	// Global CORS middleware that handles all OPTIONS requests
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

			// Handle preflight
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// Health check
	router.HandleFunc("/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running!")
	})).Methods("GET")

	// Auth routes
	router.HandleFunc("/login", handlers.Login).Methods("POST", "OPTIONS")
	router.HandleFunc("/signup", handlers.Signup).Methods("POST", "OPTIONS")

	router.HandleFunc("/logout", corsMiddleware(handlers.Logout)).Methods("POST")
	router.HandleFunc("/validate", corsMiddleware(handlers.ValidateToken)).Methods("GET")
	router.HandleFunc("/profile/update", corsMiddleware(handlers.UpdateProfile)).Methods("PUT")

	// Project routes
	router.HandleFunc("/projects", corsMiddleware(handlers.GetProjects)).Methods("GET")
	router.HandleFunc("/projects/create", corsMiddleware(handlers.CreateProject)).Methods("POST")
	router.HandleFunc("/projects/saved", corsMiddleware(handlers.GetSavedProjects)).Methods("GET")
	router.HandleFunc("/projects/{id}", corsMiddleware(handlers.HandleProjectActions)).Methods("POST", "DELETE")

	// Follow route
	router.HandleFunc("/users/{username}/follow", corsMiddleware(handlers.FollowUser)).Methods("POST")
	router.HandleFunc("/users/{username}/follow/status", corsMiddleware(handlers.CheckFollowStatus)).Methods("GET")

	// Developer profile routes
	router.PathPrefix("/dev").HandlerFunc(corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extract user ID from JWT token
		userID := getUserIDFromToken(r)

		// Trim "/dev/" prefix
		path := strings.TrimPrefix(r.URL.Path, "/dev/")
		path = strings.TrimSuffix(path, "/") // remove trailing slash
		parts := strings.Split(path, "/")

		username := parts[0]

		if username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}

		// /dev/:username/projects
		if len(parts) == 2 && parts[1] == "projects" {
			handlers.GetUserProjects(w, r, username)
			return
		}

		// /dev/:username/:project
		if len(parts) == 2 {
			projectName := parts[1]
			handlers.GetProjectDetail(w, r, username, projectName, userID)
			return
		}

		// /dev/:username
		handlers.GetUserProfile(w, r, username)
	})).Methods("GET")

	router.HandleFunc("/users/{username}/follow", corsMiddleware(handlers.FollowUser)).Methods("POST")

	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	// Start Server
	port := ":8080"
	fmt.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(port, router); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
