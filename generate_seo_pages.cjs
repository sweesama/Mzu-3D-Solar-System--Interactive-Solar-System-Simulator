const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexPath = path.join(root, 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');

const planets = [
  {
    name: 'Mercury',
    description: 'Explore Mercury in an interactive 3D Solar System visualization and learn why this small, cratered world has the shortest year of any planet.',
    intro: 'Mercury is the smallest planet and the closest major planet to the Sun. Its year lasts about 88 Earth days, while its heavily cratered surface records a long history of impacts.',
    detail: 'Use the scene to inspect Mercury in context, then compare its small visual radius and eccentric orbit with the other planets.'
  },
  {
    name: 'Venus',
    description: 'Explore Venus in an interactive 3D Solar System visualization and learn about its dense carbon-dioxide atmosphere and extreme greenhouse effect.',
    intro: 'Venus is similar to Earth in size but radically different at the surface. A dense carbon-dioxide atmosphere and sulfuric-acid clouds help make it the hottest planet.',
    detail: 'Focus the 3D view on Venus, inspect its reference data, and compare its nearly circular orbit with those of neighbouring planets.'
  },
  {
    name: 'Earth',
    description: 'Explore Earth and the Moon in an interactive 3D Solar System visualization with basic planetary and orbital reference data.',
    intro: 'Earth is the third planet from the Sun and the only world currently known to support life. Liquid surface water covers most of the planet, and the Moon is its natural satellite.',
    detail: 'Use the 3D view to focus on Earth, select the Moon, and compare their available radius and orbit fields.'
  },
  {
    name: 'Mars',
    description: 'Explore Mars, Phobos, and Deimos in an interactive 3D Solar System visualization and learn about the cold, dusty Red Planet.',
    intro: 'Mars is a cold, rocky world with a thin atmosphere dominated by carbon dioxide. Iron minerals in its soil give the planet its familiar red appearance.',
    detail: 'Focus on Mars, then select its small moons Phobos and Deimos to compare the objects represented in the scene.'
  },
  {
    name: 'Jupiter',
    description: 'Explore Jupiter and selected Galilean moons in an interactive 3D Solar System visualization with key planetary reference data.',
    intro: 'Jupiter is the largest planet in the Solar System. Its striped atmosphere hosts powerful storms, including the long-lived Great Red Spot.',
    detail: 'Use the 3D view to focus on Jupiter and select its represented moons to compare their sizes and orbital fields.'
  },
  {
    name: 'Saturn',
    description: 'Explore Saturn, its rings, and selected moons in an interactive 3D Solar System visualization for learning and visual comparison.',
    intro: 'Saturn is a gas giant best known for its broad ring system, made mainly of ice particles with smaller amounts of rocky material and dust.',
    detail: 'Focus on Saturn to view its rings in context, then inspect the represented moons and compare their reference data.'
  },
  {
    name: 'Uranus',
    description: 'Explore Uranus in an interactive 3D Solar System visualization and learn about the ice giant whose rotation axis is tilted sideways.',
    intro: 'Uranus is an ice giant with a rotation axis tilted roughly sideways relative to its orbit. Methane in its atmosphere contributes to its blue-green appearance.',
    detail: 'Use the 3D scene to focus on Uranus and compare its distant orbit and selected moons with the inner Solar System.'
  },
  {
    name: 'Neptune',
    description: 'Explore Neptune in an interactive 3D Solar System visualization and learn about the distant blue ice giant and its strong winds.',
    intro: 'Neptune is the farthest major planet from the Sun. It is a cold ice giant with active weather and some of the fastest winds measured in the Solar System.',
    detail: 'Focus the scene on Neptune, inspect its available reference data, and compare its orbit with the seven other major planets.'
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

function buildStructuredData(planet, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${planet.name} — Interactive 3D Planet View`,
    description: planet.description,
    url,
    isPartOf: {
      '@type': 'WebApplication',
      name: 'Mzu 3D Solar System',
      url: 'https://www.3dsolarsystem.net/'
    },
    about: {
      '@type': 'Thing',
      name: planet.name
    }
  };
}

for (const planet of planets) {
  const slug = planet.name.toLowerCase();
  const canonical = `https://www.3dsolarsystem.net/${slug}.html`;
  const title = `${planet.name} in 3D | Interactive Solar System Explorer`;
  let html = source;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(html, 'name', 'description', planet.description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', planet.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', planet.description);
  html = html.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${canonical}">`);
  html = html.replace(
    /<script id="app-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="app-structured-data" type="application/ld+json">\n${JSON.stringify(buildStructuredData(planet, canonical), null, 2)}\n    </script>`
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
            <p>${escapeHtml(planet.detail)}</p>
            <p class="model-note"><strong>Model note:</strong> This is an artistic educational visualization. Sizes, distances, and time are compressed for visibility; it is not a live ephemeris or a professional astronomy tool.</p>
        </section>
        <!-- PAGE-CONTENT:END -->`;

  html = html.replace(/<!-- PAGE-CONTENT:START -->[\s\S]*?<!-- PAGE-CONTENT:END -->/, visibleContent);
  html = html.replace(
    new RegExp(`<a href="${slug}\\.html" data-focus="${planet.name}">`, 'i'),
    `<a href="${slug}.html" data-focus="${planet.name}" aria-current="page">`
  );

  fs.writeFileSync(path.join(root, `${slug}.html`), html, 'utf8');
  console.log(`Generated ${slug}.html`);
}

console.log(`Generated ${planets.length} visible, page-specific planet pages.`);
