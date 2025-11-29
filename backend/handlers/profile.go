package handlers

import (
	"auth-app-backend/database"
	"auth-app-backend/models"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user ID from JWT token (you'd need to implement JWT validation middleware)
	// For now, we'll get it from the request body or use a hardcoded user ID
	userID := 1 // This should come from JWT token validation

	// Parse multipart form (for file uploads)
	err := r.ParseMultipartForm(10 << 20) // 10MB max
	if err != nil {
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}

	// Get the current user data
	var currentUser models.User
	query := `SELECT id, username, email, first_name, last_name, phone, user_type, 
		github_link, portfolio_link, linkedin_link, company_name, profile_picture, banner, bio, 
		created_at, updated_at FROM users WHERE id = $1`

	err = database.DB.QueryRow(query, userID).Scan(
		&currentUser.ID, &currentUser.Username, &currentUser.Email, &currentUser.FirstName,
		&currentUser.LastName, &currentUser.Phone, &currentUser.UserType, &currentUser.GithubLink,
		&currentUser.PortfolioLink, &currentUser.LinkedinLink, &currentUser.CompanyName,
		&currentUser.ProfilePicture, &currentUser.Banner, &currentUser.Bio,
		&currentUser.CreatedAt, &currentUser.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Update fields from form data
	updateFields := []string{}
	updateValues := []interface{}{}
	paramIndex := 1

	// Handle text fields
	if firstName := r.FormValue("first_name"); firstName != "" {
		updateFields = append(updateFields, "first_name = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, firstName)
		paramIndex++
	}

	if lastName := r.FormValue("last_name"); lastName != "" {
		updateFields = append(updateFields, "last_name = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, lastName)
		paramIndex++
	}

	if email := r.FormValue("email"); email != "" {
		updateFields = append(updateFields, "email = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, email)
		paramIndex++
	}

	if phone := r.FormValue("phone"); phone != "" {
		updateFields = append(updateFields, "phone = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, phone)
		paramIndex++
	}

	if bio := r.FormValue("bio"); bio != "" {
		updateFields = append(updateFields, "bio = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, bio)
		paramIndex++
	}

	if githubLink := r.FormValue("github_link"); githubLink != "" {
		updateFields = append(updateFields, "github_link = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, githubLink)
		paramIndex++
	}

	if portfolioLink := r.FormValue("portfolio_link"); portfolioLink != "" {
		updateFields = append(updateFields, "portfolio_link = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, portfolioLink)
		paramIndex++
	}

	if linkedinLink := r.FormValue("linkedin_link"); linkedinLink != "" {
		updateFields = append(updateFields, "linkedin_link = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, linkedinLink)
		paramIndex++
	}

	if companyName := r.FormValue("company_name"); companyName != "" {
		updateFields = append(updateFields, "company_name = $"+string(rune(paramIndex+'0')))
		updateValues = append(updateValues, companyName)
		paramIndex++
	}

	// Handle file uploads (for now, we'll just store the file data as base64)
	if profilePicture, header, err := r.FormFile("profile_picture"); err == nil {
		defer profilePicture.Close()
		fileBytes, err := io.ReadAll(profilePicture)
		if err == nil {
			profilePictureData := "data:" + header.Header.Get("Content-Type") + ";base64," +
				string(fileBytes) // This is a simplified approach - in production, store files properly
			updateFields = append(updateFields, "profile_picture = $"+string(rune(paramIndex+'0')))
			updateValues = append(updateValues, profilePictureData)
			paramIndex++
		}
	}

	if banner, header, err := r.FormFile("banner"); err == nil {
		defer banner.Close()
		fileBytes, err := io.ReadAll(banner)
		if err == nil {
			bannerData := "data:" + header.Header.Get("Content-Type") + ";base64," +
				string(fileBytes) // This is a simplified approach - in production, store files properly
			updateFields = append(updateFields, "banner = $"+string(rune(paramIndex+'0')))
			updateValues = append(updateValues, bannerData)
			paramIndex++
		}
	}

	// Add updated_at timestamp
	updateFields = append(updateFields, "updated_at = NOW()")

	// Add user ID to the end
	updateValues = append(updateValues, userID)

	if len(updateFields) > 1 { // More than just updated_at
		// Build the UPDATE query
		updateQuery := "UPDATE users SET " + strings.Join(updateFields, ", ") + " WHERE id = $" + string(rune(paramIndex+'0'))

		_, err = database.DB.Exec(updateQuery, updateValues...)
		if err != nil {
			http.Error(w, "Failed to update profile", http.StatusInternalServerError)
			return
		}
	}

	// Fetch and return the updated user data
	var updatedUser models.User
	query = `SELECT id, username, email, first_name, last_name, phone, user_type, 
		github_link, portfolio_link, linkedin_link, company_name, profile_picture, banner, bio, 
		created_at, updated_at FROM users WHERE id = $1`

	err = database.DB.QueryRow(query, userID).Scan(
		&updatedUser.ID, &updatedUser.Username, &updatedUser.Email, &updatedUser.FirstName,
		&updatedUser.LastName, &updatedUser.Phone, &updatedUser.UserType, &updatedUser.GithubLink,
		&updatedUser.PortfolioLink, &updatedUser.LinkedinLink, &updatedUser.CompanyName,
		&updatedUser.ProfilePicture, &updatedUser.Banner, &updatedUser.Bio,
		&updatedUser.CreatedAt, &updatedUser.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to fetch updated user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedUser)
}
