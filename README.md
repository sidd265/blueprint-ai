# 🚀 BLUEPRINT AI - Idea to PRD Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-site-name.netlify.app)

A powerful web application that transforms product ideas into comprehensive Product Requirements Documents (PRDs) using AI. Built for product managers, entrepreneurs, and teams who need professional documentation fast.

## ✨ Features

- **🤖 AI-Powered Generation**: Transform simple product ideas into detailed PRDs using Google Gemini AI
- **📋 Professional Templates**: Industry-standard PRD structure used by Fortune 500 companies
- **✏️ Real-time Editing**: Edit and customize generated content with live preview
- **📤 Multiple Export Options**: PDF, Markdown, JSON, and clipboard export
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **💾 Auto-save**: Automatic saving of work in progress
- **🎨 Modern UI/UX**: Clean, professional interface with purple gradient theme
- **🎯 Card-based Layout**: Easy-to-scan PRD presentation with organized sections

## 🌐 Live Demo

**[🚀 Try BLUEPRINT AI Now](https://aiblueprint.netlify.app/)**

## ⚡ Quick Deploy

### Deploy to Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/blueprint-ai)

1. **Fork this repository** to your GitHub account
2. **Click the Deploy to Netlify button** above
3. **Connect your GitHub account** and select the forked repo
4. **Configure environment variables**:
   - Add `GEMINI_API_KEY` in Netlify dashboard
5. **Deploy automatically** with zero configuration

### Deploy to GitHub Pages

1. **Fork the repository**
2. **Go to Settings** → Pages in your fork
3. **Select source**: Deploy from a branch
4. **Select branch**: main / (root)
5. **Save** - your site will be live at `https://yourusername.github.io/blueprint-ai`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/blueprint-ai)

1. **Click Deploy with Vercel** button above
2. **Connect your GitHub account**
3. **Configure environment variables**: Add `GEMINI_API_KEY`
4. **Deploy automatically**

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/blueprint-ai.git
cd blueprint-ai

# Start a local server
python -m http.server 8000
# or
npx serve .
# or
npm run dev

# Open in browser
open http://localhost:8000
```

## 🔧 Configuration

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key (free tier available)
3. Add it to your deployment platform:

**For Netlify:**
- Go to Site settings → Environment variables
- Add `GEMINI_API_KEY` = `your_api_key_here`

**For Vercel:**
- Go to Project settings → Environment Variables
- Add `GEMINI_API_KEY` = `your_api_key_here`

**For GitHub Pages:**
- API key is hardcoded in script.js (not recommended for production)
- Consider using GitHub Secrets for better security

### Environment Variables

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📁 Project Structure

```
blueprint-ai/
├── index.html          # Main application with hero section
├── style.css           # Purple gradient theme & responsive design
├── script.js           # Core functionality & AI integration
├── package.json        # Project metadata
├── netlify.toml        # Netlify deployment configuration
├── .gitignore          # Git ignore rules
└── README.md           # This documentation
```

## 🎯 Usage

1. **Enter Your Idea**: Describe your product concept in the hero section
2. **Configure Options**: 
   - Toggle MVP focus for lean documentation
   - Include wireframe suggestions
3. **Generate PRD**: AI creates a comprehensive document with cards layout
4. **Edit & Customize**: Modify sections as needed
5. **Export**: Download as PDF, Markdown, or copy to clipboard

## 🏗️ Architecture

The application is built as a static site with:

- **Frontend**: Vanilla HTML/CSS/JavaScript (no build process needed)
- **AI Integration**: Google Gemini API for content generation
- **Styling**: Modern CSS with Grid, Flexbox, and Glassmorphism
- **State Management**: Local storage for auto-save functionality
- **Deployment**: Optimized for static hosting (Netlify, Vercel, GitHub Pages)

## 🎨 Design Features

### Purple Gradient Theme
- **Hero Section**: Beautiful gradient background with floating animations
- **Card Layout**: Professional white cards with purple headers
- **Responsive Design**: Mobile-first approach with 768px and 480px breakpoints
- **Glassmorphism**: Modern visual effects with backdrop blur

### UI/UX Highlights
- **Blue Pie Chart Logo**: Professional branding
- **Inter Font**: Clean, readable typography
- **Card-based PRD**: Easy-to-scan sections organized in grid layout
- **Hero Integration**: Input form directly in hero section
- **Mobile Optimized**: Perfect experience across all devices

## 🚀 Performance Optimizations

- **Static Assets**: No build process required
- **Minification**: Automatic via Netlify/Vercel
- **Caching**: Optimized cache headers in netlify.toml
- **Security**: CSP headers and security configurations
- **SEO**: Meta tags and structured data

## 📊 Analytics Setup

Add analytics to track usage (optional):

```html
<!-- Add to index.html before closing </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security

- **Content Security Policy**: Configured in netlify.toml
- **API Key Protection**: Environment variables (not in source code)
- **HTTPS Enforced**: Automatic HTTPS on all deployments
- **XSS Protection**: Security headers configured

## 🌍 Internationalization

To add language support:

1. Create language files (e.g., `lang/en.json`, `lang/es.json`)
2. Update script.js to load language data
3. Replace hardcoded strings with language variables

## 📈 Monitoring & Analytics

### Netlify Analytics
- Built-in traffic analytics
- Performance monitoring
- Error tracking

### Custom Analytics
- Google Analytics 4
- Plausible Analytics (privacy-focused)
- Simple Analytics

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- **No Build Process**: Keep it simple with vanilla JS/CSS/HTML
- **Mobile First**: Design for mobile, enhance for desktop
- **Performance**: Optimize for fast loading
- **Accessibility**: Ensure keyboard navigation and screen reader support

## 🐛 Troubleshooting

### Common Issues

**API Key not working:**
- Verify API key is correct in environment variables
- Check Gemini API quota and billing
- Ensure API key has proper permissions

**Site not deploying:**
- Check netlify.toml configuration
- Verify all files are committed to repository
- Check deployment logs for errors

**Styling issues:**
- Clear browser cache
- Check for CSS conflicts
- Verify all CSS files are loading

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/blueprint-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/blueprint-ai/discussions)
- 📧 **Contact**: Open an issue for support

## 🏆 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **Netlify** for seamless deployment and hosting
- **Vercel** for excellent static site hosting
- **The Community** for feedback and contributions

---

<div align="center">

**[🌐 Live Demo](https://your-site-name.netlify.app)** • **[📚 Documentation](https://github.com/yourusername/blueprint-ai/wiki)** • **[🚀 Deploy Now](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/blueprint-ai)**

**Transform Ideas → Professional PRDs in Minutes**

Built with ❤️ for product teams worldwide

</div> 
