# TubeBrief

TubeBrief is a web application that leverages AI to generate concise, readable summaries of YouTube videos. Simply provide a YouTube video URL, and TubeBrief will fetch the transcript and use a large language model to create a structured summary in Markdown format.

## Architecture

The project is a monorepo consisting of two main components:

1.  **`tubeBrief` (Frontend)**: A Next.js application that provides the user interface for inputting YouTube URLs and displaying the generated summaries.
2.  **`yt-summerise-api` (Backend)**: A Cloudflare Worker built with Hono that handles the core summarization logic.

### Frontend (`tubeBrief`)

The frontend is a modern web application built with the following technologies:
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks (`useState`)

It sends requests to the backend API, receives the summarized text as a stream, and renders it in a user-friendly Markdown format.

### Backend (`yt-summerise-api`)

The backend is a serverless API deployed on Cloudflare Workers. Its responsibilities include:
- Validating and normalizing YouTube URLs.
- Fetching video transcripts using the `youtube-transcript` library.
- Interacting with the Cloudflare AI binding to access language models (specifically Mistral).
- Chunking long transcripts to fit within model context limits.
- Performing a two-pass summarization: first summarizing individual chunks, then synthesizing those summaries into a final, cohesive document.
- Streaming the final summary back to the client in real-time.

## Getting Started

### Prerequisites

- Node.js and pnpm
- A Cloudflare account with access to Workers AI
- `wrangler` CLI, authenticated with your Cloudflare account

### Backend Setup (`yt-summerise-api`)

1.  **Navigate to the backend directory:**
    ```bash
    cd yt-summerise-api
    ```

2.  **Install dependencies:**
    ```bash
    bun
     install
    ```

3.  **Configure Cloudflare Worker:**
    The `wrangler.toml` file is pre-configured to use the Workers AI binding. No secrets are required for this part.

4.  **Run the worker locally:**
    ```bash
    wrangler dev
    ```
    The API will be available at `http://localhost:8787` by default.

### Frontend Setup (`tubeBrief`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd tubeBrief
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file in the `tubeBrief` directory and add the URL of your running backend API.

    ```
    NEXT_PUBLIC_API_URL=http://localhost:8787
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

The frontend requires the following environment variable to communicate with the backend:

-   `NEXT_PUBLIC_API_URL`: The full URL of the deployed `yt-summerise-api` worker.

## Deployment

### Backend

The backend can be deployed to Cloudflare Workers using the Wrangler CLI.

```bash
cd yt-summerise-api
wrangler deploy --minify
```

After deployment, update the `NEXT_PUBLIC_API_URL` in your frontend's environment variables to the production worker URL.

### Frontend

The Next.js frontend can be deployed to any platform that supports Next.js, such as Vercel. Ensure the `NEXT_PUBLIC_API_URL` environment variable is set in your deployment environment to point to your live backend worker URL.
