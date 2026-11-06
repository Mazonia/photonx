/**
 * Curated Constellation Data for Educational & Interactive Stargazing
 * Includes stick-figure star segments, names, and kid-friendly lore.
 */

export const CONSTELLATIONS = [
  {
    id: 'ursa_major',
    name: 'Ursa Major (The Big Dipper)',
    latin: 'Ursa Major',
    culture: 'Greek / Native American / Global',
    funFact: 'The two outer stars in the bowl (Merak and Dubhe) point directly to Polaris, the North Star!',
    lines: [
      { from: { ra: 206.88, dec: 49.31, name: 'Alkaid' }, to: { ra: 200.98, dec: 54.92, name: 'Mizar' } },
      { from: { ra: 200.98, dec: 54.92, name: 'Mizar' }, to: { ra: 193.51, dec: 55.96, name: 'Alioth' } },
      { from: { ra: 193.51, dec: 55.96, name: 'Alioth' }, to: { ra: 183.86, dec: 57.03, name: 'Megrez' } },
      { from: { ra: 183.86, dec: 57.03, name: 'Megrez' }, to: { ra: 178.46, dec: 53.69, name: 'Phecda' } },
      { from: { ra: 178.46, dec: 53.69, name: 'Phecda' }, to: { ra: 165.46, dec: 56.38, name: 'Merak' } },
      { from: { ra: 165.46, dec: 56.38, name: 'Merak' }, to: { ra: 165.93, dec: 61.75, name: 'Dubhe' } },
      { from: { ra: 165.93, dec: 61.75, name: 'Dubhe' }, to: { ra: 183.86, dec: 57.03, name: 'Megrez' } },
    ],
  },
  {
    id: 'orion',
    name: 'Orion (The Hunter)',
    latin: 'Orion',
    culture: 'Greek / Egyptian / Babylonian',
    funFact: "Orion's belt is made of three supergiant stars. Hanging from his belt is the Orion Nebula, where new stars are being born!",
    lines: [
      { from: { ra: 88.79, dec: 7.41, name: 'Betelgeuse' }, to: { ra: 81.28, dec: 6.35, name: 'Bellatrix' } },
      { from: { ra: 81.28, dec: 6.35, name: 'Bellatrix' }, to: { ra: 83.00, dec: -0.30, name: 'Mintaka' } },
      { from: { ra: 83.00, dec: -0.30, name: 'Mintaka' }, to: { ra: 84.05, dec: -1.20, name: 'Alnilam' } },
      { from: { ra: 84.05, dec: -1.20, name: 'Alnilam' }, to: { ra: 85.19, dec: -1.94, name: 'Alnitak' } },
      { from: { ra: 85.19, dec: -1.94, name: 'Alnitak' }, to: { ra: 86.94, dec: -9.67, name: 'Saiph' } },
      { from: { ra: 85.19, dec: -1.94, name: 'Alnitak' }, to: { ra: 78.63, dec: -8.20, name: 'Rigel' } },
      { from: { ra: 88.79, dec: 7.41, name: 'Betelgeuse' }, to: { ra: 85.19, dec: -1.94, name: 'Alnitak' } },
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia (The Queen)',
    latin: 'Cassiopeia',
    culture: 'Greek mythology',
    funFact: 'Famous for its distinctive "W" shape in the northern night sky. It never sets below the horizon for observers in North America or Europe!',
    lines: [
      { from: { ra: 2.30, dec: 59.15, name: 'Caph' }, to: { ra: 10.13, dec: 56.54, name: 'Schedar' } },
      { from: { ra: 10.13, dec: 56.54, name: 'Schedar' }, to: { ra: 14.18, dec: 60.72, name: 'Gamma Cas' } },
      { from: { ra: 14.18, dec: 60.72, name: 'Gamma Cas' }, to: { ra: 20.30, dec: 60.23, name: 'Ruchbah' } },
      { from: { ra: 20.30, dec: 60.23, name: 'Ruchbah' }, to: { ra: 26.60, dec: 63.67, name: 'Segin' } },
    ],
  },
  {
    id: 'ophiuchus',
    name: 'Ophiuchus (The Serpent Bearer)',
    latin: 'Ophiuchus',
    culture: 'Greek / Ptolemy',
    funFact: "Home to Barnard's Star! The Sun passes through Ophiuchus in December, making it the unofficial 13th zodiac constellation!",
    lines: [
      { from: { ra: 263.73, dec: 12.56, name: 'Rasalhague' }, to: { ra: 266.02, dec: 4.57, name: 'Cebalrai' } },
      { from: { ra: 266.02, dec: 4.57, name: 'Cebalrai' }, to: { ra: 269.45, dec: 4.69, name: "Barnard's Star" } },
      { from: { ra: 266.02, dec: 4.57, name: 'Cebalrai' }, to: { ra: 257.59, dec: -15.72, name: 'Sabik' } },
      { from: { ra: 263.73, dec: 12.56, name: 'Rasalhague' }, to: { ra: 243.85, dec: -3.69, name: 'Yed Prior' } },
    ],
  },
];
