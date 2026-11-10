/*
 * In-browser positions for the sky pages.
 *
 * Planets and the Sun use the Keplerian elements JPL published for
 * approximate positions over 3000 BC–3000 AD (E. M. Standish and
 * J. G. Williams). The 1800–2050 element set stops at 2050, so it is
 * not used here. The 3D explorer’s orbit angles are artistic and are
 * not read by this file. This is not a JPL Horizons ephemeris.
 *
 * The Moon uses the truncated series in Jean Meeus, Astronomical
 * Algorithms, chapter 47 (geocentric ecliptic of date, no nutation).
 * The Sun’s longitude for the lunar phase uses Meeus chapter 25 so it
 * is in the same equinox-of-date frame. Phase times are usually within
 * a few minutes of an almanac, not telescope-grade.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.SkyEphemeris = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var DEG = Math.PI / 180;
    var AU_KM = 149597870.7;
    var C_KMS = 299792.458;
    var J2000 = 2451545.0;
    var UNIX_JD = 2440587.5;

    // a0, adot, e0, edot, I0, Idot, L0, Ldot, varpi0, varpidot, node0, nodedot.
    // Extra M terms b, c, s, f for Jupiter–Neptune (Table 2b). Angles in degrees.
    var ELEMENTS = {
        Mercury: {
            el: [0.38709843, 0, 0.20563661, 0.00002123, 7.00559432, -0.00590158, 252.25166724, 149472.67486623, 77.45771895, 0.15940013, 48.33961819, -0.12214182],
            extra: null,
            rhoErrKm: 1000
        },
        Venus: {
            el: [0.72332102, -0.00000026, 0.00676399, -0.00005107, 3.39777545, 0.00043494, 181.97970850, 58517.81560260, 131.76755713, 0.05679648, 76.67261496, -0.27274174],
            extra: null,
            rhoErrKm: 8000
        },
        Earth: {
            el: [1.00000018, -0.00000003, 0.01673163, -0.00003661, -0.00054346, -0.01337178, 100.46691572, 35999.37306329, 102.93005885, 0.31795260, -5.11260389, -0.24123856],
            extra: null,
            rhoErrKm: 15000
        },
        Mars: {
            el: [1.52371243, 0.00000097, 0.09336511, 0.00009149, 1.85181869, -0.00724757, -4.56813164, 19140.29934243, -23.91744784, 0.45223625, 49.71320984, -0.26852431],
            extra: null,
            rhoErrKm: 30000
        },
        Jupiter: {
            el: [5.20248019, -0.00002864, 0.04853590, 0.00018026, 1.29861416, -0.00322699, 34.33479152, 3034.90371757, 14.27495244, 0.18199196, 100.29282654, 0.13024619],
            extra: [-0.00012452, 0.06064060, -0.35635438, 38.35125000],
            rhoErrKm: 1000000
        },
        Saturn: {
            el: [9.54149883, -0.00003065, 0.05550825, -0.00032044, 2.49424102, 0.00451969, 50.07571329, 1222.11494724, 92.86136063, 0.54179478, 113.63998702, -0.25015002],
            extra: [0.00025899, -0.13434469, 0.87320147, 38.35125000],
            rhoErrKm: 4000000
        },
        Uranus: {
            el: [19.18797948, -0.00020455, 0.04685740, -0.00001550, 0.77298127, -0.00180155, 314.20276625, 428.49512595, 172.43404441, 0.09266985, 73.96250215, 0.05739699],
            extra: [0.00058331, -0.97731848, 0.17689245, 7.67025000],
            rhoErrKm: 8000000
        },
        Neptune: {
            el: [30.06952752, 0.00006447, 0.00895439, 0.00000818, 1.77005520, 0.00022400, 304.22289287, 218.46515314, 46.68158724, 0.01009938, 131.78635853, -0.00606302],
            extra: [-0.00041348, 0.68346318, -0.10162547, 7.67025000],
            rhoErrKm: 4000000
        }
    };

    // Meeus ch. 47, Table 47.A: D, M, M', F, longitude (1e-6 deg), distance (1e-3 km).
    var MOON_LON = [
        [0, 0, 1, 0, 6288774, -20905355],
        [2, 0, -1, 0, 1274027, -3699111],
        [2, 0, 0, 0, 658314, -2955968],
        [0, 0, 2, 0, 213618, -569925],
        [0, 1, 0, 0, -185116, 48888],
        [0, 0, 0, 2, -114332, -3149],
        [2, 0, -2, 0, 58793, 246158],
        [2, -1, -1, 0, 57066, -152138],
        [2, 0, 1, 0, 53322, -170733],
        [2, -1, 0, 0, 45758, -204586],
        [0, 1, -1, 0, -40923, -129620],
        [1, 0, 0, 0, -34720, 108743],
        [0, 1, 1, 0, -30383, 104755],
        [2, 0, 0, -2, 15327, 10321],
        [0, 0, 1, 2, -12528, 0],
        [0, 0, 1, -2, 10980, 79661],
        [4, 0, -1, 0, 10675, -34782],
        [0, 0, 3, 0, 10034, -23210],
        [4, 0, -2, 0, 8548, -21636],
        [2, 1, -1, 0, -7888, 24208],
        [2, 1, 0, 0, -6766, 30824],
        [1, 0, -1, 0, -5163, -8379],
        [1, 1, 0, 0, 4987, -16675],
        [2, -1, 1, 0, 4036, -12831],
        [2, 0, 2, 0, 3994, -10445],
        [4, 0, 0, 0, 3861, -11650],
        [2, 0, -3, 0, 3665, 14403],
        [0, 1, -2, 0, -2689, -7003],
        [2, 0, -1, 2, -2602, 0],
        [2, -1, -2, 0, 2390, 10056],
        [1, 0, 1, 0, -2348, 6322],
        [2, -2, 0, 0, 2236, -9884],
        [0, 1, 2, 0, -2120, 5751],
        [0, 2, 0, 0, -2069, 0],
        [2, -2, -1, 0, 2048, -4950],
        [2, 0, 1, -2, -1773, 4130],
        [2, 0, 0, 2, -1595, 0],
        [4, -1, -1, 0, 1215, -3958],
        [0, 0, 2, 2, -1110, 0],
        [3, 0, -1, 0, -892, 3258],
        [2, 1, 1, 0, -810, 2616],
        [4, -1, -2, 0, 759, -1897],
        [0, 2, -1, 0, -713, -2117],
        [2, 2, -1, 0, -700, 2354],
        [2, 1, -2, 0, 691, 0],
        [2, -1, 0, -2, 596, 0],
        [4, 0, 1, 0, 549, -1423],
        [0, 0, 4, 0, 537, -1117],
        [4, -1, 0, 0, 520, -1571],
        [1, 0, -2, 0, -487, -1739],
        [2, 1, 0, -2, -399, 0],
        [0, 0, 2, -2, -381, -4421],
        [1, 1, 1, 0, 351, 0],
        [3, 0, -2, 0, -340, 0],
        [4, 0, -3, 0, 330, 0],
        [2, -1, 2, 0, 327, 0],
        [0, 2, 1, 0, -323, 1165],
        [1, 1, -1, 0, 299, 0],
        [2, 0, 3, 0, 294, 0],
        [2, 0, -1, -2, 0, 8752]
    ];

    // Meeus ch. 47 latitude terms: D, M, M', F, latitude (1e-6 deg).
    var MOON_LAT = [
        [0, 0, 0, 1, 5128122],
        [0, 0, 1, 1, 280602],
        [0, 0, 1, -1, 277693],
        [2, 0, 0, -1, 173237],
        [2, 0, -1, 1, 55413],
        [2, 0, -1, -1, 46271],
        [2, 0, 0, 1, 32573],
        [0, 0, 2, 1, 17198],
        [2, 0, 1, -1, 9266],
        [0, 0, 2, -1, 8822],
        [2, -1, 0, -1, 8216],
        [2, 0, -2, -1, 4324],
        [2, 0, 1, 1, 4200],
        [2, 1, 0, -1, -3359],
        [2, -1, -1, 1, 2463],
        [2, -1, 0, 1, 2211],
        [2, -1, -1, -1, 2065],
        [0, 1, -1, -1, -1870],
        [4, 0, -1, -1, 1828],
        [0, 1, 0, 1, -1794],
        [0, 0, 0, 3, -1749],
        [0, 1, -1, 1, -1565],
        [1, 0, 0, 1, -1491],
        [0, 1, 1, 1, -1475],
        [0, 1, 1, -1, -1410],
        [0, 1, 0, -1, -1344],
        [1, 0, 0, -1, -1335],
        [0, 0, 3, 1, 1107],
        [4, 0, 0, -1, 1021],
        [4, 0, -1, 1, 833],
        [0, 0, 1, -3, 777],
        [4, 0, -2, 1, 671],
        [2, 0, 0, -3, 607],
        [2, 0, 2, -1, 596],
        [2, -1, 1, -1, 491],
        [2, 0, -2, 1, -451],
        [0, 0, 3, -1, 439],
        [2, 0, 2, 1, 422],
        [2, 0, -3, -1, 421],
        [2, 1, -1, 1, -366],
        [2, 1, 0, 1, -351],
        [4, 0, 0, 1, 331],
        [2, -1, 1, 1, 315],
        [2, -2, 0, -1, 302],
        [0, 0, 1, 3, -283],
        [2, 1, 1, -1, -229],
        [1, 1, 0, -1, 223],
        [1, 1, 0, 1, 223],
        [0, 1, -2, -1, -220],
        [2, 1, -1, -1, -220],
        [1, 0, 1, 1, -185],
        [2, -1, -2, -1, 181],
        [0, 1, 2, 1, -177],
        [4, 0, -2, -1, 176],
        [4, -1, -1, -1, 166],
        [1, 0, 1, -1, -164],
        [4, 0, 1, -1, 132],
        [1, 0, -1, -1, -119],
        [4, -1, 0, -1, 115],
        [2, -2, 0, 1, 107]
    ];

    var PHASES = [
        { angle: 0, name: 'New Moon' },
        { angle: 90, name: 'First Quarter' },
        { angle: 180, name: 'Full Moon' },
        { angle: 270, name: 'Last Quarter' }
    ];

    var PLANET_ORDER = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

    var NAKED_EYE = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

    var FINDING = {
        Mercury: 'Mercury never strays far from the Sun. Look low, in bright twilight, and give yourself a clear horizon. It is the easiest naked-eye planet to miss.',
        Venus: 'Venus is the brightest planet. In the evening it is the first point to appear in the west; in the morning it is the last to fade in the east.',
        Mars: 'Mars is the reddish one. When it is well clear of the Sun it stands out; a small elongation leaves it in twilight.',
        Jupiter: 'Jupiter is a bright, steady point. Stars twinkle; Jupiter usually does not.',
        Saturn: 'Saturn is dimmer than Jupiter and slightly golden. It still looks like a bright star once it is clear of twilight.'
    };

    var SEARCH_DAYS = {
        Sun: 380,
        Moon: 32,
        Mercury: 150,
        Venus: 620,
        Mars: 820,
        Jupiter: 450,
        Saturn: 420,
        Uranus: 400,
        Neptune: 400
    };

    function sinDeg(d) { return Math.sin(d * DEG); }
    function cosDeg(d) { return Math.cos(d * DEG); }

    function norm360(deg) {
        var x = deg % 360;
        return x < 0 ? x + 360 : x;
    }

    function norm180(deg) {
        var x = norm360(deg);
        return x > 180 ? x - 360 : x;
    }

    function julianDate(date) {
        return date.getTime() / 86400000 + UNIX_JD;
    }

    function dateFromJd(jd) {
        return new Date((jd - UNIX_JD) * 86400000);
    }

    function centuries(jd) {
        return (jd - J2000) / 36525;
    }

    function solveKepler(meanDeg, e) {
        var eStar = e * (180 / Math.PI);
        var E = meanDeg + eStar * sinDeg(meanDeg);
        for (var n = 0; n < 12; n++) {
            var dM = meanDeg - (E - eStar * sinDeg(E));
            var dE = dM / (1 - e * cosDeg(E));
            E += dE;
            if (Math.abs(dE) <= 1e-6) break;
        }
        return E;
    }

    function heliocentric(name, jd) {
        var spec = ELEMENTS[name];
        var T = centuries(jd);
        var el = spec.el;
        var a = el[0] + el[1] * T;
        var e = el[2] + el[3] * T;
        var I = el[4] + el[5] * T;
        var L = el[6] + el[7] * T;
        var p = el[8] + el[9] * T;
        var O = el[10] + el[11] * T;
        var w = p - O;
        var M = L - p;
        if (spec.extra) {
            var b = spec.extra[0], c = spec.extra[1], s = spec.extra[2], f = spec.extra[3];
            M += b * T * T + c * Math.cos(f * T * DEG) + s * Math.sin(f * T * DEG);
        }
        M = norm180(M);
        var Edeg = solveKepler(M, e);
        var Er = Edeg * DEG;
        var xp = a * (Math.cos(Er) - e);
        var yp = a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(Er);
        var wr = w * DEG, Or = O * DEG, Ir = I * DEG;
        var cw = Math.cos(wr), sw = Math.sin(wr);
        var cO = Math.cos(Or), sO = Math.sin(Or);
        var cI = Math.cos(Ir), sI = Math.sin(Ir);
        return {
            x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
            y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
            z: (sw * sI) * xp + (cw * sI) * yp
        };
    }

    function geocentricPlanet(name, jd) {
        var earth = heliocentric('Earth', jd);
        var body = heliocentric(name, jd);
        var x = body.x - earth.x;
        var y = body.y - earth.y;
        var z = body.z - earth.z;
        var dist = Math.hypot(x, y, z);
        return {
            distAU: dist,
            lon: norm360(Math.atan2(y, x) / DEG),
            lat: Math.atan2(z, Math.hypot(x, y)) / DEG
        };
    }

    function sunVector(jd) {
        var earth = heliocentric('Earth', jd);
        var dist = Math.hypot(earth.x, earth.y, earth.z);
        return {
            distAU: dist,
            lon: norm360(Math.atan2(-earth.y, -earth.x) / DEG),
            lat: Math.atan2(-earth.z, Math.hypot(earth.x, earth.y)) / DEG
        };
    }

    function moonFundamentals(jd) {
        var T = centuries(jd);
        var T2 = T * T;
        var T3 = T2 * T;
        var T4 = T3 * T;
        return {
            T: T,
            Lp: 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000,
            D: 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000,
            M: 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000,
            Mp: 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000,
            F: 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000
        };
    }

    function moonPosition(jd) {
        var f = moonFundamentals(jd);
        var T = f.T;
        var a1 = 119.75 + 131.849 * T;
        var a2 = 53.09 + 479264.290 * T;
        var a3 = 313.45 + 481266.484 * T;
        var E = 1 - 0.002516 * T - 0.0000074 * T * T;
        var E2 = E * E;
        var sumL = 3958 * sinDeg(a1) + 1962 * sinDeg(f.Lp - f.F) + 318 * sinDeg(a2);
        var sumB = -2235 * sinDeg(f.Lp) + 382 * sinDeg(a3) + 175 * sinDeg(a1 - f.F) + 175 * sinDeg(a1 + f.F) + 127 * sinDeg(f.Lp - f.Mp) - 115 * sinDeg(f.Lp + f.Mp);
        var sumR = 0;
        var i, row, arg, factor, mAbs;
        for (i = 0; i < MOON_LON.length; i++) {
            row = MOON_LON[i];
            arg = row[0] * f.D + row[1] * f.M + row[2] * f.Mp + row[3] * f.F;
            mAbs = row[1] < 0 ? -row[1] : row[1];
            factor = mAbs === 1 ? E : mAbs === 2 ? E2 : 1;
            sumL += row[4] * sinDeg(arg) * factor;
            sumR += row[5] * cosDeg(arg) * factor;
        }
        for (i = 0; i < MOON_LAT.length; i++) {
            row = MOON_LAT[i];
            arg = row[0] * f.D + row[1] * f.M + row[2] * f.Mp + row[3] * f.F;
            mAbs = row[1] < 0 ? -row[1] : row[1];
            factor = mAbs === 1 ? E : mAbs === 2 ? E2 : 1;
            sumB += row[4] * sinDeg(arg) * factor;
        }
        return {
            lon: norm360(f.Lp + sumL * 1e-6),
            lat: sumB * 1e-6,
            distKm: 385000.56 + sumR * 1e-3
        };
    }

    // Geometric solar longitude and Earth–Sun distance, mean equinox of date.
    function sunOfDate(jd) {
        var T = centuries(jd);
        var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
        var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
        var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M)
            + (0.019993 - 0.000101 * T) * sinDeg(2 * M)
            + 0.000289 * sinDeg(3 * M);
        var e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
        var nu = M + C;
        var R = (1.000001018 * (1 - e * e)) / (1 + e * cosDeg(nu));
        return { lon: norm360(L0 + C), distAU: R };
    }

    function moonState(jd) {
        var moon = moonPosition(jd);
        var sun = sunOfDate(jd);
        var dlon = moon.lon - sun.lon;
        var elong = norm360(dlon);
        var cosPsi = Math.cos(moon.lat * DEG) * Math.cos(dlon * DEG);
        cosPsi = Math.min(1, Math.max(-1, cosPsi));
        var psi = Math.acos(cosPsi);
        var R = sun.distAU * AU_KM;
        var delta = moon.distKm;
        var S = Math.sqrt(Math.max(0, R * R + delta * delta - 2 * R * delta * Math.cos(psi)));
        var cosI = (delta - R * Math.cos(psi)) / S;
        cosI = Math.min(1, Math.max(-1, cosI));
        var illum = (1 + cosI) / 2;
        return {
            lon: moon.lon,
            lat: moon.lat,
            distKm: delta,
            elong: elong,
            illum: illum,
            waxing: elong < 180,
            name: phaseName(elong),
            sunLon: sun.lon
        };
    }

    function phaseName(elong) {
        var e = norm360(elong);
        if (e >= 350 || e < 10) return 'New Moon';
        if (e < 80) return 'Waxing Crescent';
        if (e < 100) return 'First Quarter';
        if (e < 170) return 'Waxing Gibbous';
        if (e < 190) return 'Full Moon';
        if (e < 260) return 'Waning Gibbous';
        if (e < 280) return 'Last Quarter';
        return 'Waning Crescent';
    }

    function elongationOf(jd) {
        return moonState(jd).elong;
    }

    function solvePhase(jdGuess, target) {
        var jd = jdGuess;
        for (var i = 0; i < 14; i++) {
            var e1 = elongationOf(jd);
            var deriv = norm180(elongationOf(jd + 0.01) - e1) / 0.01;
            if (Math.abs(deriv) < 1) deriv = 12.19;
            jd -= norm180(e1 - target) / deriv;
        }
        return jd;
    }

    function adjacentPhase(jd, target, sign) {
        var elong = elongationOf(jd);
        var delta = norm360(sign > 0 ? target - elong : elong - target);
        if (delta < 0.15) delta += 360;
        return solvePhase(jd + sign * delta / 12.19, target);
    }

    function upcomingPhases(jd, count) {
        var events = [];
        var i;
        for (i = 0; i < PHASES.length; i++) {
            var when = adjacentPhase(jd, PHASES[i].angle, 1);
            events.push({
                name: PHASES[i].name,
                jd: when,
                date: dateFromJd(when)
            });
        }
        events.sort(function (a, b) { return a.jd - b.jd; });
        return events.slice(0, count || 4);
    }

    function moonAgeDays(jd) {
        var elong = elongationOf(jd);
        var prev = solvePhase(jd - elong / 12.19, 0);
        var age = jd - prev;
        if (age < -0.02) prev = solvePhase(jd, 0);
        age = jd - prev;
        if (age < 0 && age > -0.05) return 0;
        return age;
    }

    function planetElongation(name, jd) {
        var sun = sunVector(jd);
        var body = geocentricPlanet(name, jd);
        var dlon = norm180(body.lon - sun.lon);
        var cosSep = Math.sin(sun.lat * DEG) * Math.sin(body.lat * DEG)
            + Math.cos(sun.lat * DEG) * Math.cos(body.lat * DEG) * Math.cos((body.lon - sun.lon) * DEG);
        cosSep = Math.min(1, Math.max(-1, cosSep));
        var sep = Math.acos(cosSep) / DEG;
        var signed = (dlon < 0 ? -1 : 1) * sep;
        var glare = sep < 15;
        var sky;
        if (glare) sky = 'glare';
        else if (dlon > 0) sky = 'evening';
        else sky = 'morning';
        return {
            name: name,
            sep: sep,
            signed: signed,
            sky: sky,
            hours: sep / 15,
            finding: FINDING[name] || ''
        };
    }

    function distanceKm(name, jd) {
        if (name === 'Moon') return moonPosition(jd).distKm;
        if (name === 'Sun') return sunVector(jd).distAU * AU_KM;
        return geocentricPlanet(name, jd).distAU * AU_KM;
    }

    function sampleDistance(name, jd) {
        return distanceKm(name, jd);
    }

    function nextClosest(name, jd) {
        var horizon = SEARCH_DAYS[name] || 400;
        var step = name === 'Moon' ? 0.25 : name === 'Mercury' ? 0.5 : 1;
        var guard = Math.round(horizon / step);
        var prev = sampleDistance(name, jd);
        var curr = sampleDistance(name, jd + step);
        var best = null;
        var i, t, next;
        for (i = 1; i <= guard; i++) {
            t = jd + i * step;
            next = sampleDistance(name, t + step);
            if (curr <= prev && curr <= next) {
                best = t;
                break;
            }
            prev = curr;
            curr = next;
        }
        if (best === null) return null;
        var a = best - step;
        var b = best + step;
        for (i = 0; i < 36; i++) {
            var m1 = a + (b - a) / 3;
            var m2 = b - (b - a) / 3;
            if (sampleDistance(name, m1) < sampleDistance(name, m2)) b = m2;
            else a = m1;
        }
        var at = (a + b) / 2;
        return { jd: at, date: dateFromJd(at), distKm: sampleDistance(name, at) };
    }

    function motion(name, jd) {
        var d0 = distanceKm(name, jd);
        var d1 = distanceKm(name, jd + 1 / 24);
        var kms = (d1 - d0) / 3600;
        return {
            distKm: d0,
            kms: kms,
            approaching: kms < 0,
            lightSeconds: d0 / C_KMS
        };
    }

    function rhoErrorKm(name) {
        if (name === 'Sun') return ELEMENTS.Earth.rhoErrKm;
        if (name === 'Moon') return 5;
        return ELEMENTS[name] ? ELEMENTS[name].rhoErrKm : null;
    }

    function formatUtc(date) {
        var text = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(date);
        return text.replace(',', '') + ' UTC';
    }

    function formatLocal(date) {
        var zone = 'local time';
        try {
            zone = Intl.DateTimeFormat().resolvedOptions().timeZone || zone;
        } catch (err) { /* keep the fallback label */ }
        var text = new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(date);
        return text.replace(',', '') + ' · ' + zone;
    }

    function formatKm(km, name) {
        if (name === 'Moon') return Math.round(km).toLocaleString('en-US') + ' km';
        var err = rhoErrorKm(name) || 10000;
        var step = err >= 1000000 ? 1000000 : err >= 100000 ? 100000 : 10000;
        var rounded = Math.round(km / step) * step;
        var digits = step >= 1000000 ? 0 : step >= 100000 ? 1 : 2;
        return (rounded / 1000000).toLocaleString('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        }) + ' million km';
    }

    function formatAU(km) {
        var au = km / AU_KM;
        var digits = au < 0.2 ? 5 : au < 10 ? 4 : 3;
        return au.toFixed(digits) + ' AU';
    }

    function formatLight(seconds) {
        if (seconds < 10) return seconds.toFixed(1) + ' s';
        if (seconds < 90) return Math.round(seconds) + ' s';
        if (seconds < 7200) return (seconds / 60).toFixed(1) + ' min';
        return (seconds / 3600).toFixed(2) + ' h';
    }

    function formatSpeed(kms) {
        var abs = Math.abs(kms);
        var digits = abs >= 10 ? 1 : 2;
        return abs.toFixed(digits) + ' km/s';
    }

    function errorPhrase(name) {
        var km = rhoErrorKm(name);
        if (name === 'Moon') return 'a few kilometres';
        if (km >= 1000000) {
            var millions = km / 1000000;
            return 'about ' + (millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)) + ' million km';
        }
        return 'about ' + Math.round(km / 1000).toLocaleString('en-US') + ',000 km';
    }

    return {
        AU_KM: AU_KM,
        PLANET_ORDER: PLANET_ORDER,
        NAKED_EYE: NAKED_EYE,
        julianDate: julianDate,
        dateFromJd: dateFromJd,
        moonState: moonState,
        moonAgeDays: moonAgeDays,
        upcomingPhases: upcomingPhases,
        planetElongation: planetElongation,
        motion: motion,
        nextClosest: nextClosest,
        rhoErrorKm: rhoErrorKm,
        errorPhrase: errorPhrase,
        formatUtc: formatUtc,
        formatLocal: formatLocal,
        formatKm: formatKm,
        formatAU: formatAU,
        formatLight: formatLight,
        formatSpeed: formatSpeed
    };
});
