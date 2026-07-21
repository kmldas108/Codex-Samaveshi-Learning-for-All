# Samaveshi — Learning for All

Samaveshi is an accessibility-first educational web app powered by OpenAI GPT-5.6. It turns images, audio, and classroom topics into localized learning materials for learners with visual, hearing, and reading accessibility needs.

## AI architecture

- **GPT-5.6 Sol** (`gpt-5.6-sol`) provides multilingual educational analysis, vision understanding, structured JSON, and tutor chat through the Responses API.
- **GPT-4o mini Transcribe** converts uploaded or recorded audio to text before GPT-5.6 analyzes it.
- **TTS-1** reads generated materials aloud.
- A local Model Context Protocol server supplies regional analogies for Easy Read mode.

All OpenAI calls run in `server.ts`; the API key is never bundled into the browser.

## Run locally

Requirements: Node.js 20 or newer and an OpenAI API key.

```sh
npm install
```

Copy `.env.example` to `.env.local`, then set:

```dotenv
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-sol
```

Start development mode:

```sh
npm run dev
```

Open <http://localhost:3000>. Without a key, the server intentionally uses local mock responses so the UI and BDD flow can still be exercised.

## Verify

```sh
npm run build
npm test
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | — | Server-side OpenAI credential |
| `OPENAI_MODEL` | `gpt-5.6-sol` | Educational analysis and chat |
| `OPENAI_TRANSCRIPTION_MODEL` | `gpt-4o-mini-transcribe` | Speech-to-text |
| `OPENAI_SPEECH_MODEL` | `tts-1` | Text-to-speech |
