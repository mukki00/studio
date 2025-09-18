# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment

This project can be deployed to Vercel. When using dynamic API routes you must provide MongoDB environment variables in the deployment target.

### Setting Vercel environment variables via GitHub Actions

1. Add the following **Repository Secrets** in GitHub (`Settings > Secrets > Actions`):
	- `VERCEL_TOKEN` — a personal token from Vercel with scope to edit projects.
	- `VERCEL_PROJECT_ID` — your Vercel project id.
	- `VERCEL_ORG_ID` — your Vercel organization id (if needed).
	- `MONGODB_URI` — your MongoDB connection string.
	- `MONGODB_DB_NAME` — the database name used by this app.
	- `MONGODB_CONTACT_COLLECTION` — optional collection name for contacts.
	- `MONGODB_COUNTERS_COLLECTION` — optional collection name for counters.

2. In the repository, run the GitHub Action `Vercel - Set Environment Variables` (Actions → Vercel - Set Environment Variables → Run workflow). The workflow will call Vercel API to add the variables.

You can also set env vars directly in the Vercel dashboard if you prefer.
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
