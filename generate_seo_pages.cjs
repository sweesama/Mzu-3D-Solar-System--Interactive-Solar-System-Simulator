const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexPath = path.join(root, 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');
const SITE = 'https://www.3dsolarsystem.net/';

const planets = [
  {
    name: 'Mercury',
    description: 'Explore Mercury in an interactive 3D Solar System visualization and learn why this small, cratered world has the shortest year of any planet.',
    intro: 'Mercury is the smallest planet and the closest major planet to the Sun. Its year lasts about 88 Earth days, while its heavily cratered surface records a long history of impacts.',
    detail: 'Use the scene to inspect Mercury in context, then compare its small visual radius and eccentric orbit with the other planets.',
    facts: ['Year: 88 Earth days', 'Distance from the Sun: about 58 million km', 'Surface gravity: 3.7 m/s²'],
    expedition: { href: 'mercury-expedition.html', label: 'Walk on Mercury', text: 'Walk a cratered plain under a black sky and a Sun up to three times wider.' }
  },
  {
    name: 'Venus',
    description: 'Explore Venus in an interactive 3D Solar System visualization and learn about its dense carbon-dioxide atmosphere and extreme greenhouse effect.',
    intro: 'Venus is similar to Earth in size but radically different at the surface. A dense carbon-dioxide atmosphere and sulfuric-acid clouds help make it the hottest planet.',
    detail: 'Focus the 3D view on Venus, inspect its reference data, and compare its nearly circular orbit with those of neighbouring planets.',
    facts: ['Surface temperature: about 465 °C', 'Surface pressure: about 92 times Earth’s', 'Rotation: 243 Earth days, backwards'],
    expedition: { href: 'venus-expedition.html', label: 'Walk on Venus', text: 'Stand on a volcanic plain at 465 °C beneath a heavy orange sky.' }
  },
  {
    name: 'Earth',
    description: 'Explore Earth and the Moon in an interactive 3D Solar System visualization with basic planetary and orbital reference data.',
    intro: 'Earth is the third planet from the Sun and the only world currently known to support life. Liquid surface water covers most of the planet, and the Moon is its natural satellite.',
    detail: 'Use the 3D view to focus on Earth, select the Moon, and compare their available radius and orbit fields.',
    facts: ['Mean radius: about 6,371 km', 'Year: about 365.25 days', 'Moon: about 384,400 km away'],
    expedition: { href: 'moon.html', label: 'Walk on the Moon', text: 'Walk and jump in lunar gravity with Earth hanging above the horizon.' }
  },
  {
    name: 'Mars',
    description: 'Explore Mars, Phobos, and Deimos in an interactive 3D Solar System visualization and learn about the cold, dusty Red Planet.',
    intro: 'Mars is a cold, rocky world with a thin atmosphere dominated by carbon dioxide. Iron minerals in its soil give the planet its familiar red appearance.',
    detail: 'Focus on Mars, then select its small moons Phobos and Deimos to compare the objects represented in the scene.',
    facts: ['Day (sol): about 24 h 40 min', 'Surface gravity: 3.71 m/s², 38% of Earth’s', 'Moons: Phobos and Deimos'],
    expedition: { href: 'mars-expedition.html', label: 'Walk on Mars', text: 'Walk a dusty plain in 38% gravity under a butterscotch sky.' }
  },
  {
    name: 'Jupiter',
    description: 'Explore Jupiter and selected Galilean moons in an interactive 3D Solar System visualization with key planetary reference data.',
    intro: 'Jupiter is the largest planet in the Solar System. Its striped atmosphere hosts powerful storms, including the long-lived Great Red Spot.',
    detail: 'Use the 3D view to focus on Jupiter and select its represented moons to compare their sizes and orbital fields.',
    facts: ['Diameter: about 11 times Earth’s', 'Day: about 9 h 56 min', 'Galilean moons: Io, Europa, Ganymede, Callisto'],
    expedition: { href: 'jupiter-expedition.html', label: 'Descend into Jupiter', text: 'Ride a probe down through ammonia clouds to the lightning layer.' }
  },
  {
    name: 'Saturn',
    description: 'Explore Saturn, its rings, and selected moons in an interactive 3D Solar System visualization for learning and visual comparison.',
    intro: 'Saturn is a gas giant best known for its broad ring system, made mainly of ice particles with smaller amounts of rocky material and dust.',
    detail: 'Focus on Saturn to view its rings in context, then inspect the represented moons and compare their reference data.',
    facts: ['Main rings: about 270,000 km across', 'Day: about 10.7 hours', 'Average density: lower than water'],
    expedition: { href: 'saturn-expedition.html', label: 'Fly through Saturn’s rings', text: 'Cruise the icy ring plane with NASA’s Cassini flying alongside.' }
  },
  {
    name: 'Uranus',
    description: 'Explore Uranus in an interactive 3D Solar System visualization and learn about the ice giant whose rotation axis is tilted sideways.',
    intro: 'Uranus is an ice giant with a rotation axis tilted roughly sideways relative to its orbit. Methane in its atmosphere contributes to its blue-green appearance.',
    detail: 'Use the 3D scene to focus on Uranus and compare its distant orbit and selected moons with the inner Solar System.',
    facts: ['Axial tilt: about 98°', 'Year: about 84 Earth years', 'Visited once: Voyager 2, 1986'],
    expedition: { href: 'uranus-expedition.html', label: 'Fly through Uranus’s rings', text: 'Drift between narrow, charcoal-dark rings beside Voyager 2.' }
  },
  {
    name: 'Neptune',
    description: 'Explore Neptune in an interactive 3D Solar System visualization and learn about the distant blue ice giant and its strong winds.',
    intro: 'Neptune is the farthest major planet from the Sun. It is a cold ice giant with active weather and some of the fastest winds measured in the Solar System.',
    detail: 'Focus the scene on Neptune, inspect its available reference data, and compare its orbit with the seven other major planets.',
    facts: ['Winds: up to about 2,000 km/h', 'Year: about 165 Earth years', 'Visited once: Voyager 2, 1989'],
    expedition: { href: 'neptune-expedition.html', label: 'Fly into Neptune’s storms', text: 'Fly the storm layer toward the Great Dark Spot beside Voyager 2.' }
  }
];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

function replaceMeta(html, attribute, key, value) {
  const expression = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*">`, 'i');
  if (!expression.test(html)) throw new Error(`Missing ${attribute} metadata: ${key}`);
  return html.replace(expression, `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`);
}

function buildStructuredData(planet, url, image) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${planet.name} — Interactive 3D Planet View`,
    description: planet.description,
    url,
    image,
    isPartOf: {
      '@type': 'WebApplication',
      name: 'Mzu 3D Solar System',
      url: SITE
    },
    about: {
      '@type': 'Thing',
      name: planet.name
    },
    relatedLink: `${SITE}${planet.expedition.href}`
  };
}

for (const planet of planets) {
  const slug = planet.name.toLowerCase();
  const canonical = `${SITE}${slug}.html`;
  const image = `${SITE}og/${slug}.jpg`;
  const imageAlt = `${planet.name} in the Mzu 3D Solar System`;
  const title = `${planet.name} in 3D | Interactive Solar System Explorer`;
  let html = source;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(html, 'name', 'description', planet.description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', planet.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:image', image);
  html = replaceMeta(html, 'property', 'og:image:alt', imageAlt);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', planet.description);
  html = replaceMeta(html, 'name', 'twitter:image', image);
  html = replaceMeta(html, 'name', 'twitter:image:alt', imageAlt);
  html = html.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${canonical}">`);
  html = html.replace(
    /<script id="app-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="app-structured-data" type="application/ld+json">\n${JSON.stringify(buildStructuredData(planet, canonical, image), null, 2)}\n    </script>`
  );
  html = html.replace(
    '<body data-page-kind="home">',
    `<body data-page-kind="planet" data-page-planet="${planet.name}">`
  );
  html = html.replace(
    '</head>',
    `    <script>window.INITIAL_PLANET = ${JSON.stringify(planet.name)};</script>\n</head>`
  );

  const visibleContent = `<!-- PAGE-CONTENT:START -->
        <section class="experience-copy">
            <p class="eyebrow">Interactive planet view</p>
            <h1>Explore ${planet.name} in 3D</h1>
            <p>${escapeHtml(planet.intro)}</p>
            <ul class="planet-facts">
${planet.facts.map(fact => `                <li>${escapeHtml(fact)}</li>`).join('\n')}
            </ul>
            <p>${escapeHtml(planet.detail)}</p>
            <p class="model-note"><strong>Model note:</strong> This is an artistic educational visualization. Sizes, distances, and time are compressed for visibility; it is not a live ephemeris or a professional astronomy tool.</p>
        </section>
        <!-- PAGE-CONTENT:END -->`;

  html = html.replace(/<!-- PAGE-CONTENT:START -->[\s\S]*?<!-- PAGE-CONTENT:END -->/, visibleContent);

  // Feature this planet's own expedition as a large card, and drop its tile from the grid.
  const { href, label, text } = planet.expedition;
  const tile = new RegExp(`\\s*<a class="expedition-tile" href="${href.replace('.', '\\.')}">[^\\n]*</a>`);
  if (!tile.test(html)) throw new Error(`Missing expedition tile for ${href}`);
  html = html.replace(tile, '');
  const featured = `<a class="expedition-entry" href="${href}"><span class="eyebrow">${planet.name === 'Earth' ? 'Moon' : planet.name} expedition</span><strong>${label} <span aria-hidden="true">↗</span></strong><span>${escapeHtml(text)}</span></a>\n        <!-- EXPEDITIONS:START -->`;
  html = html.replace('<!-- EXPEDITIONS:START -->', featured);
  html = html.replace('<h2 id="expeditions-title" class="nav-label">First-person expeditions</h2>', '<h2 id="expeditions-title" class="nav-label">More first-person expeditions</h2>');

  html = html.replace(
    new RegExp(`<a href="${slug}\\.html" data-focus="${planet.name}">`, 'i'),
    `<a href="${slug}.html" data-focus="${planet.name}" aria-current="page">`
  );

  fs.writeFileSync(path.join(root, `${slug}.html`), html, 'utf8');
  console.log(`Generated ${slug}.html`);
}

console.log(`Generated ${planets.length} visible, page-specific planet pages.`);
