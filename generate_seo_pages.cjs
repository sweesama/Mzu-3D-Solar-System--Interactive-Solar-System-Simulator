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

// Visible "About" article + FAQ for each planet page (also emitted as FAQPage JSON-LD).
// Facts follow the NASA Planetary Fact Sheet and NASA Science planet pages linked as sources.
const articles = {
  Mercury: {
    about: [
      'Mercury is the smallest of the eight planets, only slightly larger than Earth’s Moon, and the closest to the Sun at an average of about 58 million km (0.39 AU). It races around the Sun in 88 Earth days but turns slowly, so one full day–night cycle, sunrise to sunrise, lasts about 176 Earth days.',
      'With almost no atmosphere to hold heat, its surface swings from about 430 °C in daylight to about −180 °C at night. Mercury’s iron core makes up an unusually large share of the planet; as it cooled, the whole planet shrank and its crust wrinkled into long cliffs called lobate scarps. NASA’s MESSENGER spacecraft orbited Mercury from 2011 to 2015 and found evidence of water ice in permanently shadowed craters near the poles.'
    ],
    faq: [
      ['Is Mercury the hottest planet?', 'No. Venus is hotter, at about 465 °C, because its thick carbon-dioxide atmosphere traps heat. Mercury’s days are scorching, but with almost no atmosphere its nights fall to about −180 °C.'],
      ['How long is a day on Mercury?', 'Mercury spins once every 59 Earth days, but because it also moves quickly along its orbit, a full solar day from one sunrise to the next lasts about 176 Earth days — two Mercury years.'],
      ['Does Mercury have any moons?', 'No. Mercury and Venus are the only planets in the Solar System without moons.']
    ]
  },
  Venus: {
    about: [
      'Venus is the second planet from the Sun and almost Earth’s twin in size and mass, but its surface is hostile. A carbon-dioxide atmosphere about 92 times denser than Earth’s traps heat in a runaway greenhouse effect, keeping the surface near 465 °C — hotter than Mercury, even though Venus is farther from the Sun.',
      'Thick clouds of sulfuric acid hide the ground and reflect most sunlight, which is why Venus is the brightest planet in our night sky. It spins backwards compared with most planets, and very slowly: one rotation takes 243 Earth days, longer than its 225-day year. Soviet Venera landers photographed its basalt plains in the 1970s and 1980s, and NASA’s Magellan orbiter mapped almost the whole surface by radar.'
    ],
    faq: [
      ['Why is Venus hotter than Mercury?', 'Venus’s dense carbon-dioxide atmosphere traps heat in a runaway greenhouse effect, so the whole surface stays near 465 °C day and night. Mercury has almost no atmosphere, so its heat escapes into space.'],
      ['Can you see Venus from Earth?', 'Yes. After the Moon it is the brightest natural object in the night sky, often called the morning star or evening star because it appears near sunrise or sunset.'],
      ['Is a day on Venus longer than a year?', 'Yes. Venus takes 243 Earth days to rotate once but only 225 days to orbit the Sun. Because it spins backwards, the time from one sunrise to the next is about 117 Earth days.']
    ]
  },
  Earth: {
    about: [
      'Earth is the third planet from the Sun, at an average distance of about 150 million km (1 AU), and the only world known to support life. About 71% of its surface is covered by liquid water, and a nitrogen–oxygen atmosphere shields life and keeps temperatures moderate. Earth is the densest planet in the Solar System and the largest of the four rocky planets.',
      'Earth’s axis is tilted about 23.4°, which gives us seasons. Its single natural satellite, the Moon, is about a quarter of Earth’s diameter and orbits at an average of 384,400 km. The Moon’s gravity raises ocean tides and helps keep Earth’s tilt stable over long periods.'
    ],
    faq: [
      ['Why does Earth have seasons?', 'Because Earth’s axis is tilted about 23.4°. As Earth orbits the Sun, each hemisphere takes turns leaning toward the Sun (summer) and away from it (winter). Changes in distance from the Sun are too small to cause seasons.'],
      ['How far away is the Moon?', 'About 384,400 km on average. Light covers that distance in roughly 1.3 seconds.'],
      ['How long does Earth take to orbit the Sun?', 'About 365.25 days. The extra quarter day is why calendars add a leap day every four years.']
    ]
  },
  Mars: {
    about: [
      'Mars is the fourth planet from the Sun, about half Earth’s diameter, orbiting at roughly 228 million km (1.52 AU). Iron oxide in its dust gives it its red colour. Its thin atmosphere is mostly carbon dioxide, with surface pressure under 1% of Earth’s, so liquid water cannot last long on the surface today — yet dry river valleys, lake deposits and water-formed minerals show that water once flowed there.',
      'Mars hosts Olympus Mons, the largest volcano in the Solar System at about 22 km high, and Valles Marineris, a canyon system about 4,000 km long. A Martian day, called a sol, lasts about 24 hours 40 minutes, and a year about 687 Earth days. NASA’s Curiosity and Perseverance rovers continue to explore its surface.'
    ],
    faq: [
      ['Why is Mars red?', 'Its surface dust and rocks are rich in iron oxide — essentially rust — which gives the planet its reddish colour.'],
      ['Could humans breathe on Mars?', 'No. The air is about 95% carbon dioxide and less than 1% as dense as Earth’s, so astronauts would need pressurised suits and their own oxygen.'],
      ['How long is a year on Mars?', 'About 687 Earth days — nearly two Earth years.']
    ]
  },
  Jupiter: {
    about: [
      'Jupiter is the largest planet in the Solar System — more than twice as massive as all the other planets combined and about 11 times Earth’s diameter. It is a gas giant made mostly of hydrogen and helium, with no solid surface. Its colourful stripes are cloud bands stretched by fast rotation: a day on Jupiter lasts under 10 hours, the shortest of any planet.',
      'The Great Red Spot is a storm larger than Earth that has been observed for well over 150 years. Jupiter has more than 90 known moons, including the four large Galilean moons discovered in 1610: volcanic Io, ice-covered Europa, Ganymede — the largest moon in the Solar System — and Callisto. NASA’s Juno spacecraft has orbited Jupiter since 2016.'
    ],
    faq: [
      ['Can you stand on Jupiter?', 'No. Jupiter has no solid surface; its hydrogen and helium atmosphere simply gets denser and hotter with depth.'],
      ['How big is Jupiter compared with Earth?', 'Jupiter is about 11 times wider than Earth, and more than 1,300 Earths could fit inside it.'],
      ['What is the Great Red Spot?', 'A giant, long-lived storm spinning in Jupiter’s southern hemisphere. It is wider than Earth and has been watched for well over 150 years, although it has been slowly shrinking.']
    ]
  },
  Saturn: {
    about: [
      'Saturn is the sixth planet from the Sun and the second largest, a gas giant about nine times wider than Earth. It is famous for its rings, made mostly of water-ice pieces ranging from tiny grains to boulders several metres across. The main rings span roughly 270,000 km yet are often only tens of metres thick.',
      'Saturn is the least dense planet — on average less dense than water. A day lasts about 10.7 hours and a year about 29.4 Earth years. Saturn has well over 100 known moons; the largest, Titan, is bigger than the planet Mercury and has a thick nitrogen atmosphere with lakes of liquid methane. NASA’s Cassini spacecraft studied Saturn from orbit from 2004 to 2017.'
    ],
    faq: [
      ['What are Saturn’s rings made of?', 'Mostly chunks of water ice, from dust-sized grains to boulders several metres across, with small amounts of rock and dust.'],
      ['Would Saturn float in water?', 'In principle, yes: its average density is lower than water’s. Of course, there is no ocean anywhere near big enough to try it.'],
      ['How many moons does Saturn have?', 'Well over 100 confirmed moons, and the count keeps rising as new small moons are discovered. Titan is by far the largest.']
    ]
  },
  Uranus: {
    about: [
      'Uranus is the seventh planet from the Sun, an ice giant about four times wider than Earth. Its axis is tilted about 98°, so it rolls around the Sun on its side; over its 84-year orbit, each pole gets around 42 years of continuous sunlight followed by 42 years of darkness. Methane in its upper atmosphere absorbs red light, giving Uranus its pale blue-green colour.',
      'Beneath the clouds, much of the planet is thought to be a hot, dense fluid of water, methane and ammonia ices. Uranus has 13 known rings — narrow and dark — and more than two dozen moons named after characters from Shakespeare and Alexander Pope, such as Titania, Oberon and Miranda. It was the first planet discovered with a telescope, by William Herschel in 1781, and Voyager 2 is the only spacecraft to have visited, flying past in January 1986.'
    ],
    faq: [
      ['Why is Uranus tilted on its side?', 'Scientists think one or more giant collisions early in the Solar System’s history knocked it over, though the exact cause is still debated.'],
      ['Why is Uranus blue-green?', 'Methane gas in its upper atmosphere absorbs red light and reflects blue and green light back into space.'],
      ['How long is a year on Uranus?', 'About 84 Earth years.']
    ]
  },
  Neptune: {
    about: [
      'Neptune is the eighth and farthest planet from the Sun, about 4.5 billion km away (30 AU), where sunlight is roughly 900 times fainter than on Earth. It is an ice giant slightly smaller than Uranus but more massive, and it has the fastest winds measured on any planet — up to about 2,000 km/h.',
      'Neptune takes about 165 Earth years to orbit the Sun, so it completed its first full orbit since discovery only in 2011. It was the first planet found by mathematical prediction rather than by searching the sky. Its largest moon, Triton, orbits backwards and has nitrogen geysers; it was probably captured from the Kuiper Belt. Voyager 2 flew past in August 1989 and photographed the Great Dark Spot, a storm about as wide as Earth.'
    ],
    faq: [
      ['How was Neptune discovered?', 'Astronomers noticed that Uranus was being tugged off its predicted path. Urbain Le Verrier calculated where an unseen planet should be, and Johann Galle found Neptune close to that position in 1846.'],
      ['Why is Neptune so windy?', 'It is not fully understood. Neptune radiates more heat than it receives from the Sun, and with no solid surface to create friction, its winds can reach about 2,000 km/h.'],
      ['How long is a year on Neptune?', 'About 165 Earth years.']
    ]
  }
};

function buildArticle(planet) {
  const data = articles[planet.name];
  return `<!-- PLANET-ARTICLE:START -->
        <section class="planet-article" aria-labelledby="about-title">
            <h2 id="about-title">About ${planet.name}</h2>
${data.about.map(p => `            <p>${escapeHtml(p)}</p>`).join('\n')}
            <h2>${planet.name}: frequently asked questions</h2>
${data.faq.map(([q, a]) => `            <h3>${escapeHtml(q)}</h3>\n            <p>${escapeHtml(a)}</p>`).join('\n')}
            <p class="planet-sources">Sources: <a href="https://science.nasa.gov/${planet.name.toLowerCase()}/" rel="noopener" target="_blank">NASA Science — ${planet.name}</a> · <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" rel="noopener" target="_blank">NASA Planetary Fact Sheet</a>.</p>
        </section>
        <!-- PLANET-ARTICLE:END -->`;
}

function jsonLdScript(id, data) {
  return `<script id="${id}" type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`;
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
  html = html.replace(/<!-- PLANET-ARTICLE:START -->[\s\S]*?<!-- PLANET-ARTICLE:END -->/, buildArticle(planet));
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: articles[planet.name].faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  };
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '3D Solar System', item: SITE },
      { '@type': 'ListItem', position: 2, name: planet.name, item: canonical }
    ]
  };
  html = html.replace(
    /<script id="faq-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `${jsonLdScript('faq-structured-data', faqData)}\n    ${jsonLdScript('breadcrumb-structured-data', breadcrumbData)}`
  );

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
