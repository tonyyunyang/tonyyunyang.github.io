# Complete Website Modification Guide

This guide provides detailed instructions for customizing Jon Barron's academic website template for your own use.

## Table of Contents
1. [Personal Information Section](#personal-information-section)
2. [Research Publications Section](#research-publications-section)
3. [Asset Replacement Guide](#asset-replacement-guide)
4. [Styling Customization](#styling-customization)
5. [Project Pages](#project-pages)
6. [Final Steps](#final-steps)

---

## Personal Information Section

### 1. Website Title and Meta Information
**File:** `index.html`

**Lines 6, 8:** Change the page title and author meta tag
```html
<title>Your Name</title>
<meta name="author" content="Your Name">
```

### 2. Your Name Display
**File:** `index.html`

**Line 23:** Replace the main name display
```html
<p class="name" style="text-align: center;">
  Your Full Name
</p>
```

### 3. Bio/About Section
**File:** `index.html`

**Lines 25-30:** Replace the entire bio paragraph
```html
<p>
I'm a [your position] at <a href="https://your-institution.edu/">Your Institution</a> in [Your City]. 
[Add your current work description and research interests].
I did my PhD at <a href="https://your-university.edu/">Your University</a>, where I was advised by <a href="https://advisor-website.edu/">Your Advisor</a>.
[Add any awards or achievements].
</p>
```

### 4. Contact Links
**File:** `index.html`

**Lines 31-39:** Update all contact information
```html
<p style="text-align:center">
  <a href="mailto:your.email@domain.com">Email</a> &nbsp;/&nbsp;
  <a href="data/YourName-CV.pdf">CV</a> &nbsp;/&nbsp;
  <a href="data/YourName-bio.txt">Bio</a> &nbsp;/&nbsp;
  <a href="https://scholar.google.com/citations?user=YOURID">Scholar</a> &nbsp;/&nbsp;
  <a href="https://twitter.com/yourusername">Twitter</a> &nbsp;/&nbsp;
  <a href="https://github.com/yourusername/">Github</a>
</p>
```

**Note:** Add or remove social media links as needed. Use the same format with `&nbsp;/&nbsp;` separators.

### 5. Profile Photo
**File:** `index.html`

**Line 42:** Update image references
```html
<a href="images/YourPhoto.jpg"><img style="width:100%;max-width:100%;object-fit: cover; border-radius: 50%;" alt="profile photo" src="images/YourPhoto.jpg" class="hoverZoomLink"></a>
```

### 6. Research Interest Description
**File:** `index.html`

**Lines 50-52:** Update research description
```html
<p>
  I'm interested in [your research areas]. Most of my research is about [your main focus]. Some papers are <span class="highlight">highlighted</span>.
</p>
```

---

## Research Publications Section

### Publication Entry Structure
Each publication follows this pattern in `index.html`:

```html
<tr onmouseout="paperid_stop()" onmouseover="paperid_start()" bgcolor="#ffffd0">
  <!-- Left column: Image/Video -->
  <td style="padding:16px;width:20%;vertical-align:middle">
    <div class="one">
      <div class="two" id='paperid_image'>
        <!-- For video hover effect -->
        <video width=100% height=100% muted autoplay loop>
          <source src="images/paper_video.mp4" type="video/mp4">
        </video>
        <!-- OR for image hover effect -->
        <img src='images/paper_after.jpg' width=100%>
      </div>
      <img src='images/paper_before.jpg' width="160">
    </div>
    <script type="text/javascript">
      function paperid_start() {
        document.getElementById('paperid_image').style.opacity = "1";
      }
      function paperid_stop() {
        document.getElementById('paperid_image').style.opacity = "0";
      }
      paperid_stop()
    </script>
  </td>
  
  <!-- Right column: Paper details -->
  <td style="padding:8px;width:80%;vertical-align:middle">
    <a href="https://project-page-url.com">
      <span class="papertitle">Paper Title Here</span>
    </a>
    <br>
    <a href="https://author1-website.com">Author One</a>,
    <a href="https://author2-website.com">Author Two</a>,
    <strong>Your Name</strong>,
    <a href="https://author3-website.com">Author Three</a>
    <br>
    <em>Conference/Journal Name</em>, Year &nbsp <font color="red"><strong>(Oral/Spotlight if applicable)</strong></font>
    <br>
    <a href="https://project-page.com">project page</a>
    /
    <a href="https://arxiv.org/abs/paperid">arXiv</a>
    /
    <a href="https://github.com/repo">code</a>
    <p></p>
    <p>
    Brief description of the paper's contribution and main findings.
    </p>
  </td>
</tr>
```

### To Add a New Publication:

1. **Choose a unique paper ID** (e.g., "mypaper2024")
2. **Create the hover functions** using your paper ID
3. **Add images/videos** to the `images/` folder:
   - Static image: `mypaper2024.jpg` (160px width recommended)
   - Hover effect: `mypaper2024_after.jpg` OR `mypaper2024.mp4`
4. **Update all instances** of the paper ID in the JavaScript functions
5. **Fill in all paper details** (title, authors, venue, links, description)

### Highlighting Important Papers:
Add `bgcolor="#ffffd0"` to the `<tr>` tag to highlight important papers with a yellow background.

### Removing Publications:
Simply delete the entire `<tr>...</tr>` block for any publication you want to remove.

---

## Asset Replacement Guide

### Required Assets to Replace:

#### 1. Profile Photo
- **Location:** `images/JonBarron.jpg`
- **Requirements:** 
  - Square aspect ratio recommended
  - High resolution (400x400px minimum)
  - Good quality headshot
- **Note:** Update both href and src attributes in `index.html` line 42

#### 2. CV and Bio Files
- **CV:** `data/JonBarron-CV.pdf` → `data/YourName-CV.pdf`
- **Bio:** `data/JonBarron-bio.txt` → `data/YourName-bio.txt`
- **Update references** in `index.html` lines 33-34

#### 3. Publication Assets
For each publication, create:
- **Static image:** `images/papername.jpg` (160px width)
- **Hover effect:** Either:
  - `images/papername_after.jpg` (for before/after comparison)
  - `images/papername.mp4` (for video demos)

#### 4. Favicon
- **Location:** `images/favicon/`
- **Files to replace:**
  - `favicon.ico`
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`

### Asset Creation Tips:

#### Publication Images:
- **Dimensions:** 160x160px for consistency
- **Format:** JPG for photos, PNG for diagrams
- **Quality:** Balance between file size and visual clarity

#### Publication Videos:
- **Format:** MP4 (widely supported)
- **Dimensions:** 160x160px or maintain aspect ratio
- **Duration:** 3-10 seconds, looping
- **Size:** Keep under 5MB for web performance

#### Favicon Generation:
Use online tools like [favicon.io](https://favicon.io) to generate all required favicon formats from a single image.

---

## Styling Customization

### Color Scheme
**File:** `stylesheet.css`

#### Highlight Color (for important papers):
**Line 134:** Yellow highlight background
```css
span.highlight {
  background-color: #ffffd0; /* Change this hex code */
}
```

#### Text Colors:
Default text color is inherited. To change:
```css
body {
  color: #333333; /* Add this for custom text color */
}
```

### Typography
**File:** `stylesheet.css`

#### Name Font Size:
**Lines 105-110:**
```css
.name {
  padding-top: 20px;
  margin: 0;
  font-family: 'Lato', Verdana, Helvetica, sans-serif;
  font-size: 32px; /* Change this value */
}
```

#### Body Font:
**Lines 100-103:**
```css
body {
  font-family: 'Lato', Verdana, Helvetica, sans-serif;
  font-size: 14px; /* Change this value */
  font-weight: 700;
}
```

### Layout Adjustments

#### Main Content Width:
**File:** `index.html`, **Line 16:**
```html
<table style="width:100%;max-width:800px;...">
```
Change `max-width:800px` to your preferred width.

#### Profile Photo Layout:
**File:** `index.html`, **Lines 21, 41:**
- Line 21: `width:63%` (text area)
- Line 41: `width:37%` (photo area)

Adjust these percentages to change the layout balance.

---

## Project Pages

### Existing Project Pages:
- `mipnerf/` - MipNeRF project page
- `mipnerf360/` - MipNeRF 360 project page  
- `zipnerf/` - Zip-NeRF project page

### To Remove Project Pages:
1. Delete the entire folder (e.g., `rm -rf mipnerf/`)
2. Update any links in `index.html` that point to these pages

### To Create New Project Pages:
1. **Copy existing structure:**
   ```bash
   cp -r mipnerf/ myproject/
   ```

2. **Update the HTML file** (`myproject/index.html`):
   - Change title and meta information
   - Update all content, images, and videos
   - Modify navigation and links

3. **Replace assets** in `myproject/img/`:
   - Add your project's images and videos
   - Update all references in the HTML

4. **Update styling** in `myproject/css/app.css` if needed

### Project Page Structure:
```
myproject/
├── index.html          # Main project page
├── css/
│   ├── app.css        # Project-specific styles
│   └── bootstrap.min.css
├── img/               # Project images and videos
│   ├── teaser.jpg
│   ├── demo.mp4
│   └── ...
└── js/
    ├── app.js         # Project JavaScript
    └── ...
```

---

## Final Steps

### 1. Testing Locally
```bash
# Navigate to your website directory
cd /path/to/your/website

# Start a local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### 2. Validation Checklist
- [ ] All personal information updated
- [ ] All links working (email, social media, CV, etc.)
- [ ] Profile photo displaying correctly
- [ ] Publication images/videos loading
- [ ] Hover effects working on publications
- [ ] Mobile responsiveness (test on phone)
- [ ] All file paths correct (case-sensitive on some servers)
- [ ] No broken links or missing images

### 3. Performance Optimization
- Compress large images (use tools like [TinyPNG](https://tinypng.com/))
- Optimize videos for web (reasonable file sizes)
- Test loading speed on slow connections

### 4. SEO Considerations
- Update meta description in `<head>` section
- Ensure all images have proper `alt` attributes
- Use descriptive file names for images

### 5. Deployment
If using GitHub Pages:
```bash
git add .
git commit -m "Customize website for [Your Name]"
git push origin main
```

Your site will be available at `https://yourusername.github.io/`

---

## Common Issues and Solutions

### Images Not Loading:
- Check file paths are correct (case-sensitive)
- Ensure images are in the correct directory
- Verify image file extensions match HTML references

### Hover Effects Not Working:
- Ensure JavaScript function names match the paper ID
- Check that image files exist for both states
- Verify video files are properly formatted

### Layout Issues:
- Test on different screen sizes
- Adjust table widths if content doesn't fit
- Consider mobile responsiveness

### Performance Issues:
- Compress large images and videos
- Consider lazy loading for many publications
- Optimize file formats (WebP for images, optimized MP4 for videos)

---

This guide covers all major aspects of customizing the academic website template. Start with the personal information section, then work through publications one by one, and finally customize the styling to match your preferences.