# Auth App - Login & Signup Pages

A modern React application with login and signup pages for developers and entrepreneurs/investors.

## Features

- **Login Page**: Clean and modern login interface
- **Signup Page**: 
  - User type selection (Developer or Entrepreneur/Investor)
  - Comprehensive form fields including:
    - First Name, Last Name
    - Email, Phone Number
    - GitHub Link (for developers)
    - Portfolio Link (for developers)
    - Company Name (for entrepreneurs/investors)
    - LinkedIn Link (for entrepreneurs/investors)
    - Password and Confirm Password
  - Logo placeholder for branding

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
  ├── pages/
  │   ├── Login.js          # Login page component
  │   ├── Login.css         # Login page styles
  │   ├── Signup.js         # Signup page component
  │   └── Signup.css        # Signup page styles
  ├── App.js                # Main app component with routing
  ├── App.css               # App styles
  ├── index.js              # Entry point
  └── index.css             # Global styles
```

## API Integration

The API calls are currently placeholders. To integrate with your backend:

1. **Login Page** (`src/pages/Login.js`):
   - Replace the `handleSubmit` function with your API call

2. **Signup Page** (`src/pages/Signup.js`):
   - Replace the `handleSubmit` function with your API call

## Logo

Replace the logo placeholder in both `Login.js` and `Signup.js`:
- Look for the `logo-box` div
- Replace the `<span className="logo-text">LOGO</span>` with your logo image:
  ```jsx
  <img src="/path-to-your-logo.png" alt="Logo" className="logo-image" />
  ```

## Customization

- Colors: Modify the gradient colors in the CSS files (currently using purple gradient)
- Styling: All styles are in the respective CSS files for easy customization

