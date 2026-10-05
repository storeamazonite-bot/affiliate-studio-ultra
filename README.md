# AffiliAI Ultra

Premium local affiliate marketing workspace for home-security products.

## Windows 7 edition

The Windows build uses Electron 22.3.27 because Electron 22 is the last major Electron release that supports Windows 7/8/8.1. Electron 23 and later do not support those systems.

Build output:
- `AffiliAI-Ultra-1.0.0-Win7-x64.exe`

## Features

- Real product image upload
- Affiliate URL preservation
- Landing Page, TikTok, Facebook and Pinterest campaign generation
- 9:16 local vertical video generation
- Background music and voiceover controls
- WebM and local MP4 export
- AI product-specific image generation
- AI product-specific video generation through Runway Product Ad
- Persistent AI asset library
- Local AI provider settings
- Secure local video download route

## AI provider setup

Open the app and enter your provider credentials in **AI Provider Settings**. They are stored locally on that PC and sent through the local backend to the selected provider.

OpenAI:
- Text generation uses the configured OpenAI model, defaulting to `gpt-5.5`.
- Image generation uses `gpt-image-2`.

Runway:
- Product Ad uses the pinned public recipe version `2026-07`.
- Vertical output uses `720:1280`.
- Duration is limited to 4–15 seconds for the real AI video API.

Runway's current Product Ad documentation confirms these inputs and limits.

## Local video mode

The local renderer works without a paid video API and produces a 1080×1920 vertical campaign video. Optional music and voiceover can be mixed with independent volume controls.

## Verification

Every Windows build runs:
- 10 automated unit tests
- syntax checks for all application modules
- Windows packaging
- packaged-app startup smoke test
- artifact verification

The final executable is produced as a Windows x64 portable application.


## CI validation
Windows 7 compatibility changes are validated through the packaged desktop smoke test before release artifacts are published.
