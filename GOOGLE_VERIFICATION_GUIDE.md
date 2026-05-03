# Google OAuth Verification Guide — CreatorFlow

## URLs to Submit to Google

After deploying to Cloudflare, submit these URLs in the OAuth consent screen:

- **Privacy Policy URL:** https://your-domain.com/privacy
- **Terms of Service URL:** https://your-domain.com/terms

---

## Why CreatorFlow Needs These Scopes (Copy & Paste to Google)

### For `https://www.googleapis.com/auth/drive.file`

> CreatorFlow is a content creation management platform for video creators.
> We use the `drive.file` scope to automatically create and manage a dedicated
> folder named "[CreatorFlow] - [Project Name]" inside the user's Google Drive
> for each project they create. Users can upload, preview, download, and organize
> their raw video footage, thumbnails, and media assets directly within the app.
>
> We only access files that CreatorFlow itself creates — we never read, modify,
> or access any other files or folders in the user's Drive. The `drive.file`
> scope (not the broader `drive` scope) was intentionally chosen to enforce this
> minimum-access principle.

### For `https://www.googleapis.com/auth/youtube.readonly`

> CreatorFlow allows users to link a YouTube video URL to their project so they
> can track how that video is performing. We use the `youtube.readonly` scope
> to fetch basic video metadata (title, thumbnail, view count, like count) for
> display in the analytics dashboard.
>
> This is strictly read-only. We never upload, post, edit, delete, or interact
> with any YouTube content on the user's behalf.

### For `https://www.googleapis.com/auth/yt-analytics.readonly`

> We use the `yt-analytics.readonly` scope to display detailed analytics for
> linked videos in the project's analytics tab: audience retention curves,
> watch time, traffic sources, and demographic breakdowns.
>
> This data is displayed only to the authenticated account owner within their
> own dashboard. We never store, export, share, or sell analytics data.
> This is strictly read-only.

---

## How to Record the Demo Video

Google requires a screen recording video (2-5 minutes) showing how your app
uses each sensitive scope. Here is exactly what to record:

### Tools to Record
- **Windows:** Xbox Game Bar (Win + G) or OBS Studio (free)
- **Mac:** QuickTime Player → File → New Screen Recording
- **Any OS:** Loom (loom.com) — free and easy

### What to Show in the Video

**Part 1 — Sign In (30 sec)**
1. Open your deployed app (your Cloudflare domain)
2. Click "Continue with Google"
3. Show the Google consent screen listing the permissions
4. Complete sign-in

**Part 2 — Google Drive scope (60 sec)**
1. After logging in, click "New Project" and create a project
2. Go to the "Media" tab
3. Show that a folder was automatically created in Google Drive
4. Upload a file and show it appearing in Drive
5. Say or add text: "We only access folders CreatorFlow creates"

**Part 3 — YouTube scope (60 sec)**
1. Open a project → go to "Analytics" tab
2. Paste a YouTube video URL in the input field
3. Show the video metadata loading (title, thumbnail, views)
4. Show the analytics charts populating
5. Say or add text: "Read-only — we never post or modify YouTube content"

**Part 4 — Privacy page (30 sec)**
1. Navigate to: your-domain.com/privacy
2. Scroll through the page slowly
3. Highlight the section "How We Use Google User Data"

### Upload
- Upload to YouTube as **Unlisted** (not public, not private)
- Paste the YouTube URL in the Google verification form

---

## Checklist Before Submitting

- [ ] App is deployed and accessible via HTTPS
- [ ] /privacy page is live and accessible
- [ ] /terms page is live and accessible  
- [ ] OAuth consent screen has app logo uploaded
- [ ] App homepage URL is filled in
- [ ] Developer contact email is filled in
- [ ] Demo video is uploaded to YouTube (Unlisted)
- [ ] All 3 scope justifications are filled in
