# XPilot - Social Media Management Platform

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your Supabase configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## 🔧 Features

- 🔐 **Google OAuth Authentication**
- 🐦 **Twitter Integration**
- 📊 **Social Media Dashboard**
- 🤖 **AI Assistant**
- 📱 **Responsive Design**

## 📁 Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── lib/               # Utility libraries
├── pages/             # Page components
├── types/             # TypeScript types
└── utils/             # Helper utilities
```

## 🔒 Authentication

The app supports Google OAuth authentication through Supabase. Configure your Google OAuth credentials in the Supabase dashboard.

## 🛠️ Development

Built with:
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Vite

## 📚 Documentation

For detailed setup instructions, refer to the configuration files and environment examples in the project.