const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = '';

try {
    indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
} catch (e) {
    console.error("Could not read index.html", e);
    process.exit(1);
}

const planets = [
    {
        name: 'Mercury',
        title: 'Mercury - 3D Solar System Simulator',
        description: 'Explore Mercury in true 3D. Learn about the smallest and innermost planet in the Solar System.',
        keywords: 'mercury, planet mercury, inner solar system, 3d space simulator, astronomy',
        content: `<h1>About Planet Mercury</h1>
        <p>Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets.</p>
        <p>It is a rocky planet with a solid cratered surface, much like the Earth's moon. Exploring Mercury gives us vital information about the formation of the inner planets.</p>`
    },
    {
        name: 'Venus',
        title: 'Venus - 3D Solar System Simulator',
        description: 'Discover Venus, the second planet from the Sun. Experience its thick, toxic atmosphere in our interactive 3D simulation.',
        keywords: 'venus, planet venus, greenhouse effect, 3d solar system, space exploration',
        content: `<h1>About Planet Venus</h1>
        <p>Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the brightest natural object in Earth's night sky after the Moon, Venus can cast shadows and can be visible to the naked eye in broad daylight.</p>
        <p>Venus is sometimes called Earth's "sister" or "twin" planet as it is almost as large and has a similar composition. However, its atmosphere is completely different, consisting mostly of carbon dioxide, with clouds of sulfuric acid.</p>`
    },
    {
        name: 'Earth',
        title: 'Earth - 3D Solar System Simulator',
        description: 'Explore Earth, our home planet, in a realistic 3D Solar System environment. View its orbit and the Moon.',
        keywords: 'earth, planet earth, blue marble, solar system simulator, 3d astronomy',
        content: `<h1>About Planet Earth</h1>
        <p>Earth is the third planet from the Sun and the only astronomical object known to harbor life. While large volumes of water can be found throughout the Solar System, only Earth sustains liquid surface water.</p>
        <p>About 71% of Earth's surface is made up of the ocean, dwarfing Earth's polar ice, lakes, and rivers. The remaining 29% of Earth's surface is land, consisting of continents and islands.</p>`
    },
    {
        name: 'Mars',
        title: 'Mars - 3D Solar System Simulator',
        description: 'Experience Mars in 3D. Learn about the Red Planet, its moons Phobos and Deimos, and its rusty surface.',
        keywords: 'mars, planet mars, red planet, phobos, deimos, 3d solar system',
        content: `<h1>About Planet Mars</h1>
        <p>Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. In English, Mars carries the name of the Roman god of war.</p>
        <p>Mars is a terrestrial planet with a thin atmosphere, and has a crust primarily composed of elements similar to Earth's crust, as well as a core made of iron and nickel.</p>`
    },
    {
        name: 'Jupiter',
        title: 'Jupiter - 3D Solar System Simulator',
        description: 'Explore Jupiter, the largest planet in our Solar System. Witness its Great Red Spot and its four Galilean moons in 3D.',
        keywords: 'jupiter, planet jupiter, gas giant, galilean moons, solar system simulator',
        content: `<h1>About Planet Jupiter</h1>
        <p>Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.</p>
        <p>Jupiter's iconic Great Red Spot is a giant storm known to have existed since at least 1831, and possibly since 1665.</p>`
    },
    {
        name: 'Saturn',
        title: 'Saturn - 3D Solar System Simulator',
        description: 'Discover Saturn and its stunning procedural rings in our fully interactive 3D Solar System simulator.',
        keywords: 'saturn, planet saturn, saturn rings, 3d space, astronomy simulator',
        content: `<h1>About Planet Saturn</h1>
        <p>Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth.</p>
        <p>The planet's most famous feature is its prominent ring system, which is composed mostly of ice particles, with a smaller amount of rocky debris and dust.</p>`
    },
    {
        name: 'Uranus',
        title: 'Uranus - 3D Solar System Simulator',
        description: 'Explore Uranus, the icy giant that rotates on its side. View its faint ring system and moons in true 3D.',
        keywords: 'uranus, planet uranus, ice giant, tilted planet, 3d solar system',
        content: `<h1>About Planet Uranus</h1>
        <p>Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.</p>
        <p>Uranus has a unique configuration among the planets because its axis of rotation is tilted sideways, nearly into the plane of its solar orbit.</p>`
    },
    {
        name: 'Neptune',
        title: 'Neptune - 3D Solar System Simulator',
        description: 'Venture to Neptune, the outermost planet in the Solar System. See the deep blue ice giant in our 3D simulator.',
        keywords: 'neptune, planet neptune, ice giant, outer solar system, 3d astronomy',
        content: `<h1>About Planet Neptune</h1>
        <p>Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.</p>
        <p>Neptune's atmosphere is notable for its active and visible weather patterns, driven by the strongest sustained winds of any planet in the Solar System.</p>`
    }
];

// Helper to replace meta tags
function replaceMeta(html, tag, nameAttr, newValue) {
    // Matches <meta name="description" content="..."> 
    const regex = new RegExp('<meta\\\\s+name="' + nameAttr + '"\\\\s+content="[^"]*">', 'i');
    if (html.match(regex)) {
        return html.replace(regex, '<meta name="' + nameAttr + '" content="' + newValue + '">');
    } else {
        // Fallback: inject right after <title>
        return html.replace('</title>', '</title>\\n    <meta name="' + nameAttr + '" content="' + newValue + '">');
    }
}

for (const planet of planets) {
    let planetHtml = indexHtml;

    // 1. Replace title
    planetHtml = planetHtml.replace(/<title>.*?<\/title>/i, '<title>' + planet.title + '</title>');

    // 2. Replace description
    planetHtml = replaceMeta(planetHtml, 'meta', 'description', planet.description);

    // 3. Replace keywords
    planetHtml = replaceMeta(planetHtml, 'meta', 'keywords', planet.keywords);

    // 4. Inject window.INITIAL_PLANET variable
    const scriptInjection = "<script>window.INITIAL_PLANET = '" + planet.name + "';</script>";
    planetHtml = planetHtml.replace("</head>", "    " + scriptInjection + "\n</head>");

    // 5. Inject SEO hidden content
    const seoContent = "\n" +
    "    <!-- SEO Content for Crawlers -->\n" +
    '    <div style="display:none;" id="seo-content">\n' +
    "        " + planet.content + "\n" +
    '        <a href="index.html">Back to Full Solar System</a>\n' +
    "    </div>";
    
    // Inject right after <body>
    planetHtml = planetHtml.replace(/<body[^>]*>/i, match => match + seoContent);

    // Write file
    const fileName = planet.name.toLowerCase() + '.html';
    const outputPath = path.join(__dirname, fileName);
    fs.writeFileSync(outputPath, planetHtml, 'utf8');
    console.log('Generated ' + fileName);
}

console.log('Successfully generated all SEO planet pages.');
