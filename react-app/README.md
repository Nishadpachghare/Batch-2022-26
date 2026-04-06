# 🎓 Batch 2022-26 Yearbook - Full Stack Application

A complete digital yearbook platform for batch 2022-26 with React, Vite, Tailwind CSS, Express, MongoDB, and Cloudinary.

## ✨ Features

✅ **Homepage** - Beautiful landing page with batch statistics  
✅ **Journey Timeline** - Year-by-year milestone tracking  
✅ **Dynamic Yearbook** - Pin-style grid gallery with filtering  
✅ **Media Vault** - Image upload & gallery with Cloudinary integration  
✅ **Anonymous Wall** - Leave messages for classmates  
✅ **Dark + Gold Theme** - Elegant, premium design  
✅ **Responsive Design** - Works on all devices  
✅ **Fast Performance** - Vite, React optimization

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI Framework
- **Vite** - Build tool (ultra-fast)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utailit-first styling
- **React Router** - Page navigation
- **Axios** - HTTP client

### Backend

- **Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Cloudinary** - Image hosting
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

## 📦 Project Structure

```
Batch 2022-26/
├── react-app/              # Frontend (Vite + React)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── App.tsx         # Routing
│   │   └── index.css       # Global styles with Tailwind
│   ├── tailwind.config.js  # Tailwind config
│   ├── vite.config.ts      # Vite config
│   └── package.json
│
└── backend/                # Backend (Express + MongoDB)
    ├── server.js           # Main server file
    ├── .env                # Environment variables
    ├── .gitignore
    └── package.json
```

## 🚀 Installation & Setup

### Step 1: Frontend Setup

```bash
cd react-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend runs at:** `http://localhost:5173/`

### Step 2: Backend Setup

Open a new terminal:

```bash
cd ../backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB & Cloudinary credentials

# Start server
npm run dev
```

**Backend runs at:** `http://localhost:5000/`

### Step 3: Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB Community
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to backend `.env` as `MONGODB_URI`

### Step 4: Cloudinary Setup

1. Sign up at https://cloudinary.com/ (free)
2. Go to Dashboard
3. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add to backend `.env`

## 📡 API Endpoints

### Students

```
GET    /api/students           # List all students
POST   /api/students           # Add student
DELETE /api/students/:id       # Remove student
```

### Media

```
GET    /api/media              # Get all media
POST   /api/upload             # Upload image
```

### Messages (Wall)

```
GET    /api/messages           # Get all messages
POST   /api/messages           # Post message
```

See `backend/README.md` for detailed API documentation.

## 🎨 Pages & Routes

| Route       | Page        | Features                               |
| ----------- | ----------- | -------------------------------------- |
| `/`         | Home        | Hero, statistics, CTA buttons          |
| `/journey`  | Journey     | Timeline, milestone cards              |
| `/yearbook` | Yearbook    | Student grid, year filter, details     |
| `/vault`    | Media Vault | Image gallery, upload, category filter |
| `/wall`     | The Wall    | Anonymous messages, post form          |

## 🌈 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  gold: '#D4AF37',
  matte: '#0D0D0D'
}
```

### Fonts

Edit `src/index.css`:

```css
body {
  font-family: "Poppins", sans-serif;
}
```

### Add Students

```javascript
// POST to http://localhost:5000/api/students
{
  "name": "Student Name",
  "roll": 101,
  "year": "2nd Year",
  "email": "student@example.com",
  "image": "https://cloudinary-url"
}
```

## 📝 Environment Variables

### Frontend

No .env needed for frontend. API URL is hardcoded to `http://localhost:5000`

### Backend (.env)

```
MONGODB_URI=mongodb://127.0.0.1:27017/yearbook
PORT=5000
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

## 🔒 Security Tips

- Never commit `.env` file
- Use environment variables for sensitive data
- Enable MongoDB authentication
- Use Cloudinary signed URLs for production
- Add input validation & sanitization
- Implement rate limiting

## 🧪 Testing

### Test Frontend

1. Navigate to each page
2. Click navigation links
3. Test responsive design (F12 → Device Toggle)

### Test Backend

Use Postman or curl:

```bash
# Test API
curl http://localhost:5000

# Get students
curl http://localhost:5000/api/students

# Post message
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello","fromName":"Anonymous"}'
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd react-app
npm run build
# Deploy dist/ folder
```

### Backend (Vercel/Heroku/Railway)

```bash
cd backend
# Push to GitHub
# Connect to deployment service
# Add environment variables
# Deploy!
```

### Important

- Use MongoDB Atlas (not local)
- Update API URL in frontend
- Enable HTTPS
- Set up monitoring & logging

## 🐛 Troubleshooting

**Frontend won't connect to backend:**

- Check if backend is running (`npm run dev`)
- Verify backend URL in Yearbook.tsx is `http://localhost:5000`
- Check browser console for CORS errors
- Ensure backend has CORS enabled

**MongoDB Connection Error:**

- Start MongoDB service (`mongod`)
- Check connection string in `.env`
- For Atlas, whitelist your IP

**Cloudinary Upload Failed:**

- Verify credentials in `.env`
- Check folder permissions in Cloudinary
- Ensure file size is reasonable

**Port Already in Use:**

```bash
# Kill process on port 5000 or 5173
# Windows: netstat -ano | findstr PORT
#         taskkill /PID <PID> /F
```

## 📚 Scripts Reference

### Frontend

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build locally
npm run lint     # ESLint check
```

### Backend

```bash
npm run dev      # Dev server with nodemon
npm start        # Production server
npm test         # Run tests (if configured)
```

## 🎯 Next Steps

1. ✅ Setup complete!
2. Add real student data via API
3. Upload photos to Cloudinary
4. Customize branding & colors
5. Add admin panel for management
6. Deploy to production
7. Promote to batch
8. Collect memories & messages

## 📞 Support & Tips

- Check logs in terminal for errors
- Use browser DevTools (F12) for frontend debugging
- Use Postman for API testing
- Read backend/README.md for detailed API docs
- Keep `.env` secure and never commit it

## 🎓 Credits

Built with ❤️ for Batch 2022-26

---

**Happy Reminiscing! 🎉**

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

The project is already fully configured! Just install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
react-app/
├── src/
│   ├── App.tsx          # Main App component with Tailwind examples
│   ├── App.css          # App styles (minimal, using Tailwind)
│   ├── index.css        # Global styles with Tailwind directives
│   ├── main.tsx         # React entry point
│   └── assets/          # Static assets
├── public/              # Static files
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration with Tailwind
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🎨 Technologies

- **React 18** - UI library
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation with Autoprefixer

## 📚 Configuration Files

### tailwind.config.js

Configures Tailwind CSS with:

- Content scanning for `src/**/*.{js,ts,jsx,tsx}`
- Theme customization options
- Plugin support

### postcss.config.js

Handles PostCSS transformations:

- Tailwind CSS processing
- Autoprefixer for browser compatibility

### vite.config.ts

Optimized Vite configuration for React development

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter (if configured)

## 💡 Tips

1. **HMR (Hot Module Replacement)**: Changes to files are reflected instantly in the browser
2. **Tailwind Classes**: Use utility classes directly in JSX for styling
3. **CSS Modules**: You can still use CSS modules alongside Tailwind
4. **Custom Styles**: Extend Tailwind config in `tailwind.config.js`

## 📦 Dependency Versions

- react: ^18
- vite: ^8.0.0
- tailwindcss: ^3.0.0
- typescript: ^5.0.0

## 🤝 Contributing

Feel free to modify and extend this project as needed!

## 📄 License

This project is open source and available under the MIT License.
tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },

},
])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
