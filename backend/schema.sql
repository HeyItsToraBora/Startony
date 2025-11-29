CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    user_type VARCHAR(20) CHECK (user_type IN ('developer', 'entrepreneur')),
    github_link VARCHAR(255),
    portfolio_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    company_name VARCHAR(100),
    profile_picture VARCHAR(255),
    banner VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE,
    general_tags TEXT[],
    programming_tags TEXT[],
    likes INTEGER DEFAULT 0,
    status VARCHAR(50),
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
