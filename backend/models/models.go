package models

import "time"

type User struct {
	ID             int       `json:"id"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	PasswordHash   string    `json:"-"`
	FirstName      *string   `json:"first_name,omitempty"`
	LastName       *string   `json:"last_name,omitempty"`
	Phone          *string   `json:"phone,omitempty"`
	UserType       *string   `json:"user_type,omitempty"`
	GithubLink     *string   `json:"github_link,omitempty"`
	PortfolioLink  *string   `json:"portfolio_link,omitempty"`
	LinkedinLink   *string   `json:"linkedin_link,omitempty"`
	CompanyName    *string   `json:"company_name,omitempty"`
	ProfilePicture *string   `json:"profile_picture,omitempty"`
	Banner         *string   `json:"banner,omitempty"`
	Bio            *string   `json:"bio,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`

	FollowersCount int `json:"followers"`
	FollowingCount int `json:"following"`
}

type Project struct {
	ID              int       `json:"id"`
	UserID          int       `json:"user_id"`
	Name            string    `json:"name"`
	Description     string    `json:"description"`
	Code            string    `json:"code"`
	GeneralTags     []string  `json:"general_tags"`
	ProgrammingTags []string  `json:"programming_tags"`
	Likes           int       `json:"likes"`
	Status          string    `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
	Developer       *User     `json:"developer,omitempty"`

	// Support up to 9 images
	Images []string `json:"images"`

	LikesCount    int  `json:"likes_count"`
	SavedByUser   bool `json:"saved_by_user"`
	StarredByUser bool `json:"starred_by_user"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupRequest struct {
	Username      string `json:"username"`
	Email         string `json:"email"`
	Password      string `json:"password"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	Phone         string `json:"phone"`
	UserType      string `json:"userType"`
	GithubLink    string `json:"githubLink"`
	PortfolioLink string `json:"portfolioLink"`
	LinkedinLink  string `json:"linkedinLink"`
	CompanyName   string `json:"companyName"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
