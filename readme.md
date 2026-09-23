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
- Let the site choose a profile and adapt after sustained low frame rates: `/?quality=auto`
- Force the balanced profile: `/?quality=balanced`
- Force reduced detail: `/?quality=low`
- Force full detail on a capable device: `/?quality=high`

The visible quality selector stores the visitor's preference locally. Auto mode uses available memory, CPU, viewport, pixel-density, and data-saving signals without treating every phone as low-end. It can reduce render resolution and procedural asteroid load if measured performance remains poor.

### Camera focus behavior

- `?focus=` and the planet navigation share one focus path: the camera flies to the object and then follows it (`trackedObject`), so moving bodies stay framed. Satellites keep the same close-up framing as planets (`radius × 2.5`); there is no separate widened framing.
- Before the first `animate()` frame, orbital positions have not been written yet, so initial focus runs `updateOrbitalPosition()` once over all bodies to place them before computing the camera destination.
- Camera transitions aim at where the object will be when the flight ends (`predictWorldPosition`), so fast-moving moons do not get left behind mid-flight.
- Canvas clicks ignore orbit guide lines, ignore a planet's invisible click-helper sphere when the camera is inside it, and pick the candidate the ray passes closest to relative to its size. Moons also carry small click-helper spheres (capped at 35% of their orbit radius), so they can be clicked reliably even inside a planet's own helper zone. Belt particles are only a fallback when nothing else was aimed at.

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
- `quality-policy.js`: testable automatic quality selection and render profiles
- `main.js`: Three.js scene, interactions, runtime performance relief, and rendering
- `style.css`: responsive overlay and scene controls
- `generate_seo_pages.cjs`: deterministic planet-page generator
- `validate_site.cjs`: metadata, content, sitemap, and claim checks
- `llms.txt` and `llms-full.txt`: factual machine-readable product summaries

## Asset and data note

The repository contains code, textures, models, and third-party runtime dependencies from multiple sources. Do not assume every file has the same reuse terms. Keep source and attribution records for any external asset before redistributing it.

## Moon expedition

The public page is `https://www.3dsolarsystem.net/moon.html`. It is listed in `sitemap.xml`, linked from the homepage and generated planet pages, and includes indexable robots metadata, a canonical URL, Open Graph/Twitter cards, and WebApplication JSON-LD. Query-string preferences canonicalize to the same page; there are no separately indexed language pages. Sharing cards use the existing site logo. `robots.txt` already allows crawling and advertises the sitemap. These settings enable discovery but do not guarantee search-engine indexing or ranking.

Open `http://localhost:8000/moon.html` or use **Step onto the Moon** in the Solar System guide. This independent page does not load the orbital simulation. It needs no account, AI service, API key, or build step.

- A science-inspired, procedurally generated lunar region with a 300-metre walking radius; not an actual surveyed landing site or a whole-planet terrain model.
- Five observation points within the same landscape: crater overlook, boulder field, Earth viewing point, a small seismic station, and a shadowed crater hollow. The numbered buttons offer quick travel to the first three; the last two can only be reached on foot. Arriving by quick travel does not automatically record a discovery.
- Follow the amber guide dots, direction arrow, and route distance. Walk close to a discovery and press **E**, click its marker, or use **Discover**. You must be on the ground to record a new discovery. **Next stop** changes the destination without moving you. After reading a discovery, **Continue exploring** selects the next undiscovered stop.
- The boulder discovery opens a separate 3D specimen view. Drag or use arrow keys to rotate, and use the zoom buttons to inspect it. Clicking the large featured boulder at close range also opens it. This is a representative artistic rock, not an identified sample.
- The journal counts unique discoveries from **0/5** to **5/5** and saves locally under `mzu-moon-discoveries-v1`. Reloading restores the journal, not the astronaut's position. If browser storage is blocked or full, discoveries still work for the current visit and the interface says they are not saved. No account or server is required.
- The amber dots are optional visual navigation aids, not physical lunar installations; photo mode hides both the route and destination marker.
- The viewpoint is an astronaut on foot, not a rover or flying camera. Click **Step onto the Moon**, then use WASD or arrow keys to walk, Shift for a brisker pace, and drag to look. Look down to see your boots. Touchscreens have a direction pad and **Jump** button.
- **Space** jumps from the ground. There is no double jump or automatic repeated jumping when held. Airborne movement preserves takeoff momentum; steep uphill terrain, larger rocks, and the region boundary still block passage. Landing and uneven terrain are handled against the rendered ground.
- Walking leaves alternating boot prints on the regolith, and jumps kick up dust that falls back along ballistic arcs — there is no air to drift it. A subtle helmet-visor frame borders the view and is hidden in photo mode for clean captures.
- Optional suit sounds (key **M** or the field guide toggle) play a quiet life-support hum, conducted footfalls, landing thumps, and a radio chime on each discovery; the exterior remains silent. All audio is synthesized in the browser with Web Audio — there are no audio files.
- **G** or the field-guide button switches between lunar gravity (1.62 m/s²) and Earth gravity (9.8 m/s²) with the same takeoff velocity, so visitors can feel the difference in jump height. The telemetry panel and dust both follow the active gravity.
- **Field guide** explains controls and scientific/artistic choices. Its **Camera motion** toggle disables walking sway and landing dip without disabling gravity. Motion is initially off for visitors requesting reduced motion. H toggles the field notes; Esc closes the guide and returns keyboard control to walking.
- **Photo mode** or P hides the interface and pauses movement, including mid-jump. Save photograph exports the canvas as PNG; Esc exits photo mode.
- English is the default, including in Chinese-language browsers. Switch manually or use `?lang=zh` to explicitly open Chinese; `?lang=en` forces English.
- `?quality=auto|high|balanced|low` selects a render profile. The quality preference is shared with the existing explorer. Auto mode can lower pixel resolution after sustained slow rendering; it does not promise a fixed frame rate on every device.
- **Return to orbit** reopens the Solar System focused on the Moon.

The landscape and rock materials are generated in the browser. Distant mountains have separate multi-scale rock shading and surface-normal detail, with fine detail faded at small screen sizes to limit shimmer. Earth uses the existing Solar System Scope imagery (CC BY 4.0). Earth's apparent size and location are composed for the scene rather than calculated from an ephemeris. The experience intentionally has no wind audio.

Jump gravity is a constant **1.62 m/s²**, following NASA's average lunar surface value (https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/moon/). Scene distances use metres. The chosen takeoff velocity of **1.8 m/s** gives a rise of **1 metre** and approximately **2.22 seconds** aloft on level ground. Eye height is **1.68 m**; walking and brisk walking are **1.55 m/s** and **2.8 m/s**. Takeoff strength, horizontal acceleration, gait animation, and landing dip are experience settings, not measurements of an astronaut in a specific spacesuit. Rocks currently use conservative horizontal collision bounds, so jumping onto or over large rocks is not supported.

Implementation: `moon.html` and `moon.css` provide the expedition interface, `moon.js` handles rendering and interaction, and `lunar-terrain.js` exposes deterministic terrain sampling and collision-aware movement through `LunarTerrain`. The terrain sampler uses the same triangle interpolation as the rendered ground. `createWalker(surface, position)` returns a grounded locomotion state; `updateWalker(surface, state, input, dt, obstacles)` updates and returns that state, integrating gravity in steps no longer than 1/120 second. `dt` is in seconds; movement input contains `forward`, `right`, `yaw` (radians), `fast`, and a one-shot `jump` request. A hidden browser tab, the field guide, and photo mode pause the simulation.

`lunar-expedition.js` contains the discovery positions, lightweight route graph, proximity checks, and validated journal parsing. `moon-discoveries.js` connects the route to the interface, progress storage, and the on-demand rock viewer. Random large rocks leave a clear corridor around the authored route; the original featured boulders remain. Both the discovery dialog and field guide pause walking and jumping.

## Mars expedition

The public page is `https://www.3dsolarsystem.net/mars-expedition.html` (the name avoids colliding with the existing `mars.html` orbital detail page). It is listed in `sitemap.xml`, linked from the homepage and generated planet pages, and carries the same indexable metadata as the Moon expedition.

- The same first-person engine as the Moon expedition, retuned for Mars: gravity is **3.71 m/s²** (G toggles Earth's 9.8 m/s²), so the same 1.8 m/s takeoff gives roughly a 0.44-metre hop — visibly heavier than the Moon.
- The environment differs deliberately: a butterscotch sky dome, tan dust haze (distance fog), a smaller Sun with a faint blue-tinged halo, and two dim moonlets instead of Earth. Terrain includes a layered flat-topped mesa, a wind-rippled dune field, and degraded craters.
- Audio differs too: Mars has a real but thin atmosphere — Perseverance's microphones showed a deep silence broken by occasional faint gusts, so the soundscape is suit-internal sounds plus rare low-frequency gusts, not a constant wind bed. A quiet life-support hum is present on both worlds (Apollo crews heard their suit fans). Footfalls are crunchier than on the Moon.
- Five discoveries — layered mesa, basalt boulder (3D specimen viewer), dune field, weather mast, degraded crater rim. The weather mast and crater are on foot only. Progress saves under `mzu-mars-discoveries-v1`.
- Files mirror the lunar set: `mars-expedition.html`, `mars.js`, `mars-terrain.js`, `mars-expedition.js`, `mars-audio.js`. `moon-discoveries.js` and `moon.css` are shared — the discoveries module accepts optional `expedition`, `terrain`, and `strings` parameters.

After changes, run:

```bash
node generate_seo_pages.cjs
node validate_site.cjs
node --check moon.js
node --check lunar-terrain.js
node --check lunar-expedition.js
node --check lunar-audio.js
node --check moon-discoveries.js
node --check mars.js
node --check mars-terrain.js
node --check mars-expedition.js
node --check mars-audio.js
```

Route verification includes both directions of every route segment at all three terrain detail levels, distant/airborne discovery rejection, duplicate prevention, and invalid saved-data handling. Browser checks should cover walking the complete route with scene obstacles, specimen rotation/zoom, quick-travel without automatic progress, refresh persistence, storage-disabled fallback, and touch discovery controls.

The validator also checks lunar terrain determinism, crater height, triangle interpolation, rock collisions, slope limits, region boundaries, jump trajectories at different frame rates, prevention of double jumps, landing, walking acceleration/stopping, and airborne momentum. Browser-script policies are evaluated in an isolated Node VM so validation does not depend on an enclosing directory's CommonJS/ES-module settings. For browser checks, exercise desktop walking/dragging, Space jump and landing, touch movement/jump, all five stops, English default in a Chinese browser, camera-motion, gravity and sound switches, photo download, and the round trip to the orbital explorer. This remains a visual prototype; more detailed suit animation and device-specific performance tuning remain future work. If a local preview shows an older interface after changes, perform a hard refresh (Ctrl+F5).

## License status

No project-wide open-source license is included. Unless the repository owner publishes a license, no permission to copy, modify, or redistribute the project is granted beyond rights provided by law. Third-party assets remain subject to their own terms.
