package handlers

import (
	"auth-app-backend/database"
	"auth-app-backend/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/lib/pq"
)

func GetUserProfile(w http.ResponseWriter, r *http.Request, username string) {
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	// Fetch user info with followers and following counts
	userQuery := `
    SELECT 
        u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.user_type,
        u.github_link, u.portfolio_link, u.linkedin_link, u.company_name, 
        u.profile_picture, u.banner, u.bio, u.created_at, u.updated_at,
        COUNT(DISTINCT f1.follower_id) AS followers,
        COUNT(DISTINCT f2.following_id) AS following
    FROM users u
    LEFT JOIN followers f1 ON f1.following_id = u.id
    LEFT JOIN followers f2 ON f2.follower_id = u.id
    WHERE u.username = $1
    GROUP BY u.id
    `

	var user models.User
	err := database.DB.QueryRow(userQuery, username).Scan(
		&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Phone,
		&user.UserType, &user.GithubLink, &user.PortfolioLink, &user.LinkedinLink, &user.CompanyName,
		&user.ProfilePicture, &user.Banner, &user.Bio, &user.CreatedAt, &user.UpdatedAt,
		&user.FollowersCount, &user.FollowingCount,
	)
	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Fetch user's projects in one query
	projectsQuery := `
    SELECT p.id, p.name, p.description, p.code, p.general_tags, p.programming_tags, p.status, p.likes, p.created_at, p.images,
           u.id, u.username, u.first_name, u.last_name, u.profile_picture
    FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    `
	rows, err := database.DB.Query(projectsQuery, user.ID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		var genTags, progTags, images []string
		var dev models.User
		if err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Code, pq.Array(&genTags), pq.Array(&progTags),
			&p.Status, &p.Likes, &p.CreatedAt, pq.Array(&images),
			&dev.ID, &dev.Username, &dev.FirstName, &dev.LastName, &dev.ProfilePicture,
		); err != nil {
			continue
		}
		p.GeneralTags = genTags
		p.ProgrammingTags = progTags
		p.Images = images
		p.Developer = &dev
		projects = append(projects, p)
	}

	// Response struct
	type UserWithProjects struct {
		models.User
		Projects []models.Project `json:"projects"`
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(UserWithProjects{
		User:     user,
		Projects: projects,
	})
}

func GetUserProjects(w http.ResponseWriter, r *http.Request, username string) {
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

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
		return
	}

	// Verify user exists
	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", username).Scan(&exists)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Get user's projects with complete information
	query := `
		SELECT p.id, p.name, p.description, p.code, p.general_tags, p.programming_tags, 
			p.status, p.likes, p.created_at, p.images,
			u.username, u.email, u.first_name, u.last_name, u.profile_picture,
			COALESCE(l.likes_count, 0) as likes_count,
			CASE WHEN s.user_id IS NOT NULL THEN TRUE ELSE FALSE END as saved_by_user,
			CASE WHEN st.user_id IS NOT NULL THEN TRUE ELSE FALSE END as starred_by_user
		FROM projects p
		JOIN users u ON p.user_id = u.id
		LEFT JOIN (
			SELECT project_id, COUNT(*) AS likes_count
			FROM project_likes
			GROUP BY project_id
		) l ON p.id = l.project_id
		LEFT JOIN saved_projects s ON p.id = s.project_id AND s.user_id = COALESCE(
			(SELECT id FROM users WHERE username = $1 LIMIT 1), 0
		)
		LEFT JOIN starred_projects st ON p.id = st.project_id AND st.user_id = COALESCE(
			(SELECT id FROM users WHERE username = $1 LIMIT 1), 0
		)
		WHERE p.user_id = (SELECT id FROM users WHERE username = $1) 
		ORDER BY p.created_at DESC`

	rows, err := database.DB.Query(query, username)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		var genTags, progTags, images []string
		var dev models.User
		err := rows.Scan(
			&project.ID, &project.Name, &project.Description, &project.Code,
			pq.Array(&genTags), pq.Array(&progTags), &project.Status,
			&project.Likes, &project.CreatedAt, pq.Array(&images),
			&dev.Username, &dev.Email, &dev.FirstName, &dev.LastName, &dev.ProfilePicture,
			&project.LikesCount, &project.SavedByUser, &project.StarredByUser,
		)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Handle empty image arrays - set to empty slice instead of null
		if images == nil {
			images = []string{}
		}
		if genTags == nil {
			genTags = []string{}
		}
		if progTags == nil {
			progTags = []string{}
		}

		project.GeneralTags = genTags
		project.ProgrammingTags = progTags
		project.Images = images
		project.Developer = &dev
		projects = append(projects, project)
	}

	// Return empty array instead of null if no projects
	if projects == nil {
		projects = []models.Project{}
	}

	json.NewEncoder(w).Encode(projects)
}

func GetProjectDetail(w http.ResponseWriter, r *http.Request, username, projectName string, currentUserID int) {
	query := `
        SELECT p.id, p.user_id, p.name, p.description, p.code, p.general_tags, p.programming_tags, p.status, p.likes, p.created_at, p.images,
               u.username, u.email,
               COALESCE(l.likes_count, 0),
               CASE WHEN s.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS saved_by_user,
               CASE WHEN st.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS starred_by_user
        FROM projects p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN (
            SELECT project_id, COUNT(*) AS likes_count
            FROM project_likes
            GROUP BY project_id
        ) l ON l.project_id = p.id
        LEFT JOIN project_saves s ON s.project_id = p.id AND s.user_id = $1
        LEFT JOIN project_stars st ON st.project_id = p.id AND st.user_id = $1
        WHERE p.name = $2 AND u.username = $3
    `

	var project models.Project
	var dev models.User
	var genTags, progTags, images []string

	err := database.DB.QueryRow(query, currentUserID, projectName, username).Scan(
		&project.ID, &project.UserID, &project.Name, &project.Description, &project.Code,
		pq.Array(&genTags), pq.Array(&progTags), &project.Status, &project.Likes, &project.CreatedAt, pq.Array(&images),
		&dev.Username, &dev.Email,
		&project.LikesCount, &project.SavedByUser, &project.StarredByUser,
	)
	if err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	project.GeneralTags = genTags
	project.ProgrammingTags = progTags
	project.Images = images
	project.Developer = &dev

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(project)
}

func LikeProject(w http.ResponseWriter, r *http.Request, userID, projectID int) {
	_, err := database.DB.Exec(`
        INSERT INTO project_likes (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
    `, userID, projectID)
	if err != nil {
		http.Error(w, "Failed to like project", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
