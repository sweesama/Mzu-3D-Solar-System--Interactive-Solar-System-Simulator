# Mzu 3D Solar System

A free, browser-based 3D Solar System visualization built with Three.js.

- Live site: https://www.3dsolarsystem.net/
- Repository: https://github.com/sweesama/Mzu-3D-Solar-System--Interactive-Solar-System-Simulator

## Product scope

The project is an artistic educational visualization. It lets visitors rotate and zoom a 3D scene, select celestial objects, view basic reference data, follow a planet tour, share focused links, save a canvas snapshot, and copy an embed snippet.

It is **not** a live ephemeris or a professional astronomy simulator. Object sizes, distances, orbital periods, and animation speed are adjusted for visibility. Some textures and surface details are artistic or procedural.

## Run locally

Serve the repository through a local HTTP server; opening the HTML files directly may prevent browser workers or assets from loading correctly.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Useful URLs

- Focus a supported object: `/?focus=Earth`
- Use a lightweight embedded interface: `/?focus=Earth&embed=1`
- Force reduced detail: `/?quality=low`
- Force full detail on a capable device: `/?quality=high`

## Generate planet pages

The eight planet pages are generated from `index.html` and factual page data:

```bash
node generate_seo_pages.cjs
```

Validate public output after generation:

```bash
node validate_site.cjs
node --check main.js
```

## Main files

- `index.html`: shared page shell and visible homepage copy
- `main.js`: Three.js scene, interactions, guided tour, sharing, and performance profile
- `style.css`: responsive overlay and scene controls
- `generate_seo_pages.cjs`: deterministic planet-page generator
- `validate_site.cjs`: metadata, content, sitemap, and claim checks
- `llms.txt` and `llms-full.txt`: factual machine-readable product summaries

## Asset and data note

The repository contains code, textures, models, and third-party runtime dependencies from multiple sources. Do not assume every file has the same reuse terms. Keep source and attribution records for any external asset before redistributing it.

## License status

No project-wide open-source license is included. Unless the repository owner publishes a license, no permission to copy, modify, or redistribute the project is granted beyond rights provided by law. Third-party assets remain subject to their own terms.
