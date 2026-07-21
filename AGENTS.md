# Codex project guide

## Purpose

Samaveshi is an accessibility-first educational application. Preserve its multilingual, disability-aware behavior and its four modes: Hear Images, See Sound, Easy Read, and Class Pack.

## Architecture

- `App.tsx` and `components/` contain the React UI.
- `server.ts` owns all OpenAI API calls. Never expose `OPENAI_API_KEY` to browser code or Vite defines.
- `services/openaiService.ts` is the browser-to-server API client; it must not instantiate the OpenAI SDK.
- `services/regionalContextMcpServer.ts` supplies localized analogy context.
- `skills/easy_read/SKILL.md` contains product constraints used at runtime.

## Model policy

- Default educational analysis and chat to `gpt-5.6-sol` through `OPENAI_MODEL`.
- Use the Responses API for GPT-5.6 text, vision, structured output, and chat.
- GPT-5.6 does not accept audio input. Transcribe audio first with `OPENAI_TRANSCRIPTION_MODEL` and then send text to GPT-5.6.
- Use `OPENAI_SPEECH_MODEL` for text-to-speech.
- Preserve structured response fields defined in `types.ts` and do not weaken accessibility instructions.

## Verification

Run these before completing changes:

```sh
npm run build
npm test
```

The app must also remain usable without an API key through its existing local mock behavior.
