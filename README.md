# CommandCraft

CommandCraft is a client-side Minecraft Java and Bedrock command finder. It
uses a curated, edition-aware command catalog and does not require an API key
or backend.

## Run locally

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The project is configured for the GitHub Pages project URL:
`https://itay-harry.github.io/CommandCraft/`.

Deployment runs automatically through GitHub Actions whenever `main` is
updated. The workflow only publishes the generated `dist` directory.
