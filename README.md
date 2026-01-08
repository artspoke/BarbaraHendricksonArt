# Barbara Hendrickson Art - Website

An elegant, responsive portfolio website showcasing the original paintings of artist Barbara Hendrickson.

## Features

- **Responsive Design** - Looks beautiful on desktop, tablet, and mobile devices
- **Image Gallery** - Grid layout with hover effects and lightbox viewer
- **Image Protection** - Multiple layers of protection to discourage casual downloading:
  - Right-click disabled on images
  - Drag-and-drop disabled
  - Images served at web-resolution (not full resolution)
- **Smooth Navigation** - Fixed header with smooth scrolling
- **Instagram Integration** - Link to @barbarahendricksonart

## Project Structure

```
BarbaraHendricksonArt/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── gallery.js          # Gallery and lightbox functionality
│   └── main.js             # Navigation and UI interactions
├── images/
│   ├── paintings/          # Web-resolution painting images
│   │   └── (add images here)
│   └── artist-photo.jpg    # Photo of Barbara (optional)
└── README.md
```

## Adding Paintings

1. **Prepare Images:**
   - Create web-resolution versions of the paintings (recommended: 1200-1600px on the longest side)
   - Save as JPG with quality around 80-85% for good balance of quality and file size
   - Use descriptive filenames like `sunset-over-mountains.jpg`

2. **Add to Gallery:**
   - Place images in the `images/paintings/` folder
   - Edit `js/gallery.js` and add entries to the `paintings` array:

```javascript
{
    id: 1,
    title: "Sunset Over Mountains",
    medium: "Oil on Canvas",
    dimensions: "24\" x 36\"",
    year: 2024,
    image: "images/paintings/sunset-over-mountains.jpg",
    description: "Inspired by an evening hike in the Rockies",
    available: true
}
```

## Image Size Recommendations

For web display while protecting high-resolution originals:

| Use | Recommended Size | Quality |
|-----|-----------------|---------|
| Gallery/Lightbox | 1200-1600px longest side | 80-85% |
| Thumbnails (optional) | 400-600px | 75-80% |
| Hero/Banner images | 1920px wide | 80% |

## Customization

### Colors
Edit CSS variables in `css/styles.css`:

```css
:root {
    --color-bg: #faf9f7;        /* Background */
    --color-accent: #8b7355;     /* Accent/buttons */
    --color-text: #2c2c2c;       /* Main text */
}
```

### Fonts
The site uses Google Fonts:
- **Cormorant Garamond** - For headings (elegant serif)
- **Montserrat** - For body text (clean sans-serif)

### Content
- Update the About section in `index.html`
- Update contact email address
- Add/modify the Instagram link

## Deployment

This is a static website and can be hosted on any web server or static hosting service:

- **GitHub Pages** - Free, easy to set up
- **Netlify** - Free tier, automatic deployments
- **Vercel** - Free tier, fast CDN
- **Squarespace/Wix** - If you prefer managed hosting
- **Traditional hosting** - Upload via FTP

### Quick Deploy to GitHub Pages

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings > Pages
4. Select "main" branch as source
5. Your site will be live at `https://yourusername.github.io/repository-name`

## Future Enhancements

When ready to add e-commerce functionality:

- **Print Sales** - Integration with print-on-demand services (Fine Art America, Printful)
- **Original Sales** - Stripe/PayPal integration for direct sales
- **Inquiry Forms** - Contact form for commission requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

All artwork images are © Barbara Hendrickson. All rights reserved.  
Website code may be used as a template for personal portfolio sites.
