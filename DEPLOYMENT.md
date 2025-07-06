# 🚀 BLUEPRINT AI - Deployment Guide

This guide will help you deploy BLUEPRINT AI to make it live for real users using GitHub and Netlify.

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] A GitHub account
- [ ] A Netlify account (free)
- [ ] A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- [ ] Git installed on your computer

## 🎯 Quick Deployment (5 minutes)

### Step 1: Upload to GitHub

1. **Create a new repository on GitHub**:
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" icon → "New repository"
   - Name it `blueprint-ai`
   - Make it public (for GitHub Pages)
   - Don't initialize with README (we already have files)

2. **Upload your files**:
   
   **Option A: Using GitHub Web Interface** (Easiest)
   - In your new repo, click "uploading an existing file"
   - Drag and drop all these files:
     - `index.html`
     - `style.css`
     - `script.js`
     - `package.json`
     - `netlify.toml`
     - `.gitignore`
     - `README.md`
     - `DEPLOYMENT.md`
   - Commit with message: "Initial deployment-ready version"

   **Option B: Using Git Command Line**
   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial deployment-ready version"
   git branch -M main
   git remote add origin https://github.com/yourusername/blueprint-ai.git
   git push -u origin main
   ```

### Step 2: Deploy to Netlify

1. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify

2. **Select your repository**:
   - Find and select your `blueprint-ai` repository
   - Click on it

3. **Configure deployment**:
   - **Branch to deploy**: `main`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (dot)
   - Click "Deploy site"

4. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Click "Add environment variable"
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - Click "Create variable"

5. **Get your live URL**:
   - Your site will be live at something like `https://amazing-name-123456.netlify.app`
   - You can customize this in Site settings → Domain management

## 🎨 Customization Before Deployment

### Update URLs and Branding

1. **In `README.md`**:
   - Replace `yourusername` with your GitHub username
   - Replace `your-site-name.netlify.app` with your actual Netlify URL

2. **In `package.json`**:
   - Update repository URLs
   - Update homepage URL

3. **In `index.html`**:
   - Update Open Graph and Twitter meta tags with your actual URL
   - Update site name if desired

### Optional: Custom Domain

1. **Buy a domain** (e.g., `blueprintai.com`)
2. **In Netlify**:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration instructions
3. **SSL**: Netlify provides free SSL automatically

## 🌍 Alternative Deployment Options

### Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub account
3. Import your `blueprint-ai` repository
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy automatically

### Deploy to GitHub Pages

1. In your GitHub repository:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` / `(root)`
   - Save

2. Your site will be live at:
   `https://yourusername.github.io/blueprint-ai`

**Note**: GitHub Pages doesn't support environment variables, so you'll need to hardcode the API key in `script.js` (not recommended for security).

## 🔧 Environment Variables Setup

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Keep it secure!

### Setting Up Environment Variables

**Netlify:**
```
Key: GEMINI_API_KEY
Value: AIzaSyDH3t25pYyd2FIOMrLGiCK5xzl2oihI6ZU
```

**Vercel:**
```
Name: GEMINI_API_KEY
Value: AIzaSyDH3t25pYyd2FIOMrLGiCK5xzl2oihI6ZU
```

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads correctly
- [ ] Hero section displays properly
- [ ] Input form works
- [ ] Generate PRD button functions
- [ ] AI generates content (API key working)
- [ ] PRD cards display correctly
- [ ] Export functions work
- [ ] Mobile responsiveness
- [ ] All images and fonts load

## 🔍 Testing Your Deployment

1. **Basic functionality**:
   - Enter a test idea: "A fitness app for runners"
   - Click "Generate PRD"
   - Verify AI generates content

2. **Mobile testing**:
   - Open on phone browser
   - Check responsive layout
   - Test input and generation

3. **Share testing**:
   - Share URL with friends
   - Check social media previews
   - Verify Open Graph images

## 🚨 Troubleshooting

### Common Issues

**1. Site loads but Generate PRD doesn't work**
- Check if environment variable `GEMINI_API_KEY` is set correctly
- Verify API key is valid and has quota

**2. Styling looks broken**
- Check if `style.css` uploaded correctly
- Clear browser cache
- Check browser console for errors

**3. Images or fonts not loading**
- Verify all files uploaded to repository
- Check file paths in HTML
- Ensure fonts.googleapis.com is accessible

**4. Deploy failed**
- Check Netlify deploy logs
- Verify `netlify.toml` syntax
- Ensure all files are in repository

### Getting Help

1. **Check deploy logs** in Netlify dashboard
2. **Browser console** for JavaScript errors
3. **Network tab** for failed resource loads
4. **Create an issue** in your GitHub repository

## 🎉 Going Live

Once deployed successfully:

1. **Share your creation**:
   - Post on social media
   - Share with product manager friends
   - Add to your portfolio

2. **Monitor usage**:
   - Check Netlify analytics
   - Monitor API usage in Google AI Studio
   - Gather user feedback

3. **Iterate and improve**:
   - Add new features
   - Improve AI prompts
   - Enhance user experience

## 📈 Optional Enhancements

### Analytics Setup

Add Google Analytics to track usage:

```html
<!-- Add before closing </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring

- Set up Netlify Analytics (paid)
- Use Lighthouse for performance audits
- Monitor Core Web Vitals

### User Feedback

- Add feedback forms
- Set up error tracking (Sentry)
- Create user support channels

---

## 🎯 Summary

You now have BLUEPRINT AI deployed and live for real users! 🎉

**Your live site**: `https://your-site-name.netlify.app`

**Next steps**:
1. Test thoroughly
2. Share with users
3. Gather feedback
4. Iterate and improve

**Need help?** Create an issue in your GitHub repository or check the troubleshooting section above.

---

*Built with ❤️ for product teams worldwide* 