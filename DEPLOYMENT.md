# Deployment Guide: CareerLift

## 1. Source Control (GitHub)
The project is initialized with Git, but the automated push failed due to permission limits. You need to push the code manually using your credentials.

### Steps to Push
Run these commands in your terminal:
```bash
git push -u origin main
```
*If asked for authentication, use your GitHub credentials or a Personal Access Token.*

---

## 2. Hosting Architecture
You asked about hosting on Vercel vs. Render.

**Recommended Stack:**
- **Frontend & Backend**: **Vercel**
  - **Why?**: This is a Next.js application. Vercel automatically deploys both your UI and your API routes (`/api/parse-resume`, Server Actions) as serverless functions.
  - **Do I need Render?**: **No.** You do typically not need Render for this application unless you want to run a separate, heavy backend service (e.g., Python/FastAPI) alongside Next.js. For this project, Next.js handles everything.

- **Database & Auth**: **Supabase**
  - **Why?**: Supabase provides your PostgreSQL database and Authentication out of the box.

---

## 3. Deploying to Vercel
1.  Go to [vercel.com](https://vercel.com) and Sign Up/Login.
2.  Click **"Add New..."** -> **Project**.
3.  Import your GitHub repository (`inceptra2003/AI_RESUME_IMPROVER_PROJECT`).
4.  **Configure Environment Variables**:
    You MUST add these variables in the Vercel Project Settings during deployment (copy from your `.env.local`):
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL` (Set this to your Vercel domain, e.g., `https://your-project.vercel.app`)
    - `OPENROUTER_API_KEY`
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`
5.  Click **Deploy**.

## 4. Updates & Maintenance
Whenever you push code to `main` on GitHub, Vercel will automatically redeploy your application.
