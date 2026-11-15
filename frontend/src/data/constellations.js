/**
 * Comprehensive Constellation Data for Educational & Interactive Stargazing
 * Includes stick-figure star segments, names, and cultural lore across
 * Northern and Southern celestial hemispheres.
 */

export const CONSTELLATIONS = [
  {
    id: 'ursa_major',
    name: 'Ursa Major (The Great Bear / Big Dipper)',
    latin: 'Ursa Major',
    culture: 'Greek / Native American / Global',
    funFact: 'The two outer bowl stars (Merak and Dubhe) point directly to Polaris, the North Star!',
    lines: [
      // Big Dipper Bowl & Handle
      { from: { ra: 206.88, dec: 49.31, name: 'Alkaid' }, to: { ra: 200.98, dec: 54.92, name: 'Mizar' } },
      { from: { ra: 200.98, dec: 54.92, name: 'Mizar' }, to: { ra: 193.51, dec: 55.96, name: 'Alioth' } },
      { from: { ra: 193.51, dec: 55.96, name: 'Alioth' }, to: { ra: 183.86, dec: 57.03, name: 'Megrez' } },
      { from: { ra: 183.86, dec: 57.03, name: 'Megrez' }, to: { ra: 178.46, dec: 53.69, name: 'Phecda' } },
      { from: { ra: 178.46, dec: 53.69, name: 'Phecda' }, to: { ra: 165.46, dec: 56.38, name: 'Merak' } },
      { from: { ra: 165.46, dec: 56.38, name: 'Merak' }, to: { ra: 165.93, dec: 61.75, name: 'Dubhe' } },
      { from: { ra: 165.93, dec: 61.75, name: 'Dubhe' }, to: { ra: 183.86, dec: 57.03, name: 'Megrez' } },
      // Pointer Line from Dubhe to North Celestial Pole / Polaris Direction
      { from: { ra: 165.46, dec: 56.38, name: 'Merak' }, to: { ra: 165.93, dec: 61.75, name: 'Dubhe' } },
      // Front and Back Legs & Snout
      { from: { ra: 165.93, dec: 61.75, name: 'Dubhe' }, to: { ra: 143.08, dec: 60.72, name: 'Muscida' } },
      { from: { ra: 143.08, dec: 60.72, name: 'Muscida' }, to: { ra: 133.00, dec: 48.04, name: 'Talitha' } },
      { from: { ra: 165.46, dec: 56.38, name: 'Merak' }, to: { ra: 154.50, dec: 42.00, name: 'Tania' } },
      { from: { ra: 178.46, dec: 53.69, name: 'Phecda' }, to: { ra: 170.00, dec: 33.00, name: 'Alula' } },
    ],
  },
  {
    id: 'ursa_minor',
    name: 'Ursa Minor (The Little Bear / Little Dipper)',
    latin: 'Ursa Minor',
    culture: 'Greek / Phoenician',
    funFact: 'Contains Polaris, the North Star, which marks the true North Celestial Pole for Earth navigators!',
    lines: [
      { from: { ra: 37.95, dec: 89.26, name: 'Polaris' }, to: { ra: 262.70, dec: 86.60, name: 'Yildun' } },
      { from: { ra: 262.70, dec: 86.60, name: 'Yildun' }, to: { ra: 244.50, dec: 77.80, name: 'Anwar' } },
      { from: { ra: 244.50, dec: 77.80, name: 'Anwar' }, to: { ra: 234.20, dec: 71.80, name: 'Ahfa' } },
      { from: { ra: 234.20, dec: 71.80, name: 'Ahfa' }, to: { ra: 222.70, dec: 74.15, name: 'Kochab' } },
      { from: { ra: 222.70, dec: 74.15, name: 'Kochab' }, to: { ra: 234.20, dec: 71.83, name: 'Pherkad' } },
      { from: { ra: 234.20, dec: 71.83, name: 'Pherkad' }, to: { ra: 244.50, dec: 77.80, name: 'Anwar' } },
    ],
  },
  {
    id: 'orion',
    name: 'Orion (The Hunter)',
    latin: 'Orion',
    culture: 'Greek / Egyptian / Babylonian',
    funFact: "Orion's belt is made of three supergiant stars. Hanging from his belt is the Orion Nebula, where new stars are being born!",
    lines: [
      // Shoulders
      { from: { ra: 88.79, dec: 7.41, name: 'Betelgeuse' }, to: { ra: 83.78, dec: 9.93, name: 'Meissa' } },
      { from: { ra: 83.78, dec: 9.93, name: 'Meissa' }, to: { ra: 81.28, dec: 6.35, name: 'Bellatrix' } },
      { from: { ra: 88.79, dec: 7.41, name: 'Betelgeuse' }, to: { ra: 85.19, dec: -1.94, name: 'Alnitak' } },
      { from: { ra: 81.28, dec: 6.35, name: 'Bellatrix' }, to: { ra: 83.00, dec: -0.30, name: 'Mintaka' } },
      // Three Belt Stars
      { from: { ra: 83.00, dec: -0.30, name: 'Mintaka' }, to: { ra: 84.05, dec: -1.20, name: 'Alnilam' } },
      { from: { ra: 84.05, dec: -1.20, name: 'Alnilam' }, to: { ra: 85.19, dec: -1.94, name: 'Alnitak' } },
      // Sword and Orion Nebula
      { from: { ra: 84.05, dec: -1.20, name: 'Alnilam' }, to: { ra: 83.82, dec: -5.39, name: 'Orion Nebula' } },
      // Legs to Rigel and Saiph
      { from: { ra: 85.19, dec: -1.94, name: 'Alnitak' }, to: { ra: 86.94, dec: -9.67, name: 'Saiph' } },
      { from: { ra: 83.00, dec: -0.30, name: 'Mintaka' }, to: { ra: 78.63, dec: -8.20, name: 'Rigel' } },
      { from: { ra: 86.94, dec: -9.67, name: 'Saiph' }, to: { ra: 78.63, dec: -8.20, name: 'Rigel' } },
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
    name: 'Ophiuchus (The Serpent Bearer) & Serpens',
    latin: 'Ophiuchus',
    culture: 'Greek / Babylonian / Ptolemy',
    funFact: "Home to Barnard's Star! The Sun passes through Ophiuchus in December, making it the astronomical 13th constellation of the ecliptic!",
    lines: [
      // Complete polygonal body of the Serpent Bearer
      { from: { ra: 263.73, dec: 12.56, name: 'Rasalhague' }, to: { ra: 266.02, dec: 4.57, name: 'Cebalrai' } },
      { from: { ra: 266.02, dec: 4.57, name: 'Cebalrai' }, to: { ra: 269.45, dec: 4.69, name: "Barnard's Star" } },
      { from: { ra: 266.02, dec: 4.57, name: 'Cebalrai' }, to: { ra: 268.50, dec: -9.77, name: 'Nu Oph' } },
      { from: { ra: 268.50, dec: -9.77, name: 'Nu Oph' }, to: { ra: 257.59, dec: -15.72, name: 'Sabik' } },
      { from: { ra: 257.59, dec: -15.72, name: 'Sabik' }, to: { ra: 249.52, dec: -10.57, name: 'Zeta Oph' } },
      { from: { ra: 249.52, dec: -10.57, name: 'Zeta Oph' }, to: { ra: 244.75, dec: -4.69, name: 'Yed Post.' } },
      { from: { ra: 244.75, dec: -4.69, name: 'Yed Post.' }, to: { ra: 243.85, dec: -3.69, name: 'Yed Prior' } },
      { from: { ra: 243.85, dec: -3.69, name: 'Yed Prior' }, to: { ra: 248.80, dec: 9.38, name: 'Kappa Oph' } },
      { from: { ra: 248.80, dec: 9.38, name: 'Kappa Oph' }, to: { ra: 263.73, dec: 12.56, name: 'Rasalhague' } },
      // The Serpent held by Ophiuchus (Serpens Caput & Cauda)
      { from: { ra: 243.85, dec: -3.69, name: 'Yed Prior' }, to: { ra: 236.07, dec: 6.43, name: 'Unukalhai' } },
      { from: { ra: 236.07, dec: 6.43, name: 'Unukalhai' }, to: { ra: 236.50, dec: 15.40, name: 'Beta Ser' } },
      { from: { ra: 268.50, dec: -9.77, name: 'Nu Oph' }, to: { ra: 284.10, dec: 4.20, name: 'Alya' } },
    ],
  },
  {
    id: 'canis_major',
    name: 'Canis Major (The Great Dog)',
    latin: 'Canis Major',
    culture: 'Greek / Egyptian',
    funFact: 'Home to Sirius, the brightest star in the entire night sky (-1.46 mag), just 8.6 light-years away.',
    lines: [
      { from: { ra: 101.28, dec: -16.72, name: 'Sirius' }, to: { ra: 97.74, dec: -17.96, name: 'Murzim' } },
      { from: { ra: 101.28, dec: -16.72, name: 'Sirius' }, to: { ra: 106.05, dec: -15.63, name: 'Muliphein' } },
      { from: { ra: 101.28, dec: -16.72, name: 'Sirius' }, to: { ra: 107.10, dec: -26.39, name: 'Wezen' } },
      { from: { ra: 107.10, dec: -26.39, name: 'Wezen' }, to: { ra: 104.66, dec: -28.97, name: 'Adhara' } },
      { from: { ra: 104.66, dec: -28.97, name: 'Adhara' }, to: { ra: 95.05, dec: -30.06, name: 'Furud' } },
      { from: { ra: 107.10, dec: -26.39, name: 'Wezen' }, to: { ra: 111.02, dec: -29.30, name: 'Aludra' } },
    ],
  },
  {
    id: 'taurus',
    name: 'Taurus (The Bull)',
    latin: 'Taurus',
    culture: 'Babylonian / Greek',
    funFact: "Contains red giant Aldebaran ('the eye of the bull') and the dazzling Pleiades (Seven Sisters) open star cluster.",
    lines: [
      { from: { ra: 68.98, dec: 16.51, name: 'Aldebaran' }, to: { ra: 68.35, dec: 15.96, name: 'Ain' } },
      { from: { ra: 68.98, dec: 16.51, name: 'Aldebaran' }, to: { ra: 64.95, dec: 15.63, name: 'Hyades' } },
      { from: { ra: 64.95, dec: 15.63, name: 'Hyades' }, to: { ra: 56.60, dec: 24.11, name: 'Pleiades (M45)' } },
      // Horns of the Bull
      { from: { ra: 68.98, dec: 16.51, name: 'Aldebaran' }, to: { ra: 84.41, dec: 21.14, name: 'Tianguan' } },
      { from: { ra: 68.35, dec: 15.96, name: 'Ain' }, to: { ra: 81.25, dec: 28.61, name: 'Elnath' } },
    ],
  },
  {
    id: 'cygnus',
    name: 'Cygnus (The Swan / Northern Cross)',
    latin: 'Cygnus',
    culture: 'Greek / Arabic',
    funFact: 'Soaring along the plane of the Milky Way, marked by brilliant blue-white supergiant Deneb.',
    lines: [
      // Central Cross Spine
      { from: { ra: 309.36, dec: 45.28, name: 'Deneb' }, to: { ra: 305.56, dec: 40.26, name: 'Sadr' } },
      { from: { ra: 305.56, dec: 40.26, name: 'Sadr' }, to: { ra: 292.68, dec: 27.96, name: 'Albireo' } },
      // Swan Wings
      { from: { ra: 311.24, dec: 33.97, name: 'Gienah' }, to: { ra: 305.56, dec: 40.26, name: 'Sadr' } },
      { from: { ra: 305.56, dec: 40.26, name: 'Sadr' }, to: { ra: 294.97, dec: 45.13, name: 'Fawaris' } },
    ],
  },
  {
    id: 'scorpius',
    name: 'Scorpius (The Scorpion)',
    latin: 'Scorpius',
    culture: 'Greek / Polynesian / Maya',
    funFact: "Marked by red supergiant Antares (Heart of the Scorpion) and a curving tail ending at Shaula the Stinger.",
    lines: [
      // Claws & Head
      { from: { ra: 241.36, dec: -19.80, name: 'Graffias' }, to: { ra: 240.08, dec: -22.62, name: 'Dschubba' } },
      { from: { ra: 240.08, dec: -22.62, name: 'Dschubba' }, to: { ra: 238.21, dec: -26.11, name: 'Pi Sco' } },
      { from: { ra: 240.08, dec: -22.62, name: 'Dschubba' }, to: { ra: 247.35, dec: -26.43, name: 'Antares' } },
      // Spine & Curving Stinger Tail
      { from: { ra: 247.35, dec: -26.43, name: 'Antares' }, to: { ra: 251.10, dec: -34.70, name: 'Larawag' } },
      { from: { ra: 251.10, dec: -34.70, name: 'Larawag' }, to: { ra: 252.17, dec: -39.03, name: 'Wei' } },
      { from: { ra: 252.17, dec: -39.03, name: 'Wei' }, to: { ra: 263.40, dec: -43.00, name: 'Sargas' } },
      { from: { ra: 263.40, dec: -43.00, name: 'Sargas' }, to: { ra: 263.74, dec: -37.10, name: 'Shaula' } },
      { from: { ra: 263.74, dec: -37.10, name: 'Shaula' }, to: { ra: 264.33, dec: -37.30, name: 'Lesath' } },
    ],
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius (The Teapot / Archer)',
    latin: 'Sagittarius',
    culture: 'Greek / Mesopotamian',
    funFact: 'The spout of the famous "Teapot" asterism points straight toward Sagittarius A*, the supermassive black hole at the center of the Milky Way!',
    lines: [
      // Teapot Lid and Body
      { from: { ra: 276.99, dec: -25.42, name: 'Kaus Bor.' }, to: { ra: 275.40, dec: -29.83, name: 'Kaus Med.' } },
      { from: { ra: 275.40, dec: -29.83, name: 'Kaus Med.' }, to: { ra: 276.04, dec: -34.38, name: 'Kaus Aust.' } },
      { from: { ra: 276.04, dec: -34.38, name: 'Kaus Aust.' }, to: { ra: 286.49, dec: -29.88, name: 'Ascella' } },
      { from: { ra: 286.49, dec: -29.88, name: 'Ascella' }, to: { ra: 282.52, dec: -26.30, name: 'Nunki' } },
      { from: { ra: 282.52, dec: -26.30, name: 'Nunki' }, to: { ra: 276.99, dec: -25.42, name: 'Kaus Bor.' } },
      // Teapot Spout pointing to Galactic Core
      { from: { ra: 275.40, dec: -29.83, name: 'Kaus Med.' }, to: { ra: 271.49, dec: -29.88, name: 'Alnasl' } },
      { from: { ra: 276.04, dec: -34.38, name: 'Kaus Aust.' }, to: { ra: 271.49, dec: -29.88, name: 'Alnasl' } },
    ],
  },
  {
    id: 'leo',
    name: 'Leo (The Lion)',
    latin: 'Leo',
    culture: 'Greek / Egyptian / Babylonian',
    funFact: 'Features the distinctive reverse question mark "Sickle" asterism anchored by blue-white rapid rotator Regulus.',
    lines: [
      // The Sickle (Head and Mane)
      { from: { ra: 152.09, dec: 11.97, name: 'Regulus' }, to: { ra: 155.00, dec: 19.84, name: 'Algieba' } },
      { from: { ra: 155.00, dec: 19.84, name: 'Algieba' }, to: { ra: 154.17, dec: 23.42, name: 'Adhafera' } },
      { from: { ra: 154.17, dec: 23.42, name: 'Adhafera' }, to: { ra: 147.23, dec: 23.77, name: 'Ras Elased' } },
      // The Torso and Tail
      { from: { ra: 155.00, dec: 19.84, name: 'Algieba' }, to: { ra: 168.53, dec: 20.52, name: 'Zosma' } },
      { from: { ra: 168.53, dec: 20.52, name: 'Zosma' }, to: { ra: 177.26, dec: 14.57, name: 'Denebola' } },
      { from: { ra: 177.26, dec: 14.57, name: 'Denebola' }, to: { ra: 169.55, dec: 15.43, name: 'Chertan' } },
      { from: { ra: 169.55, dec: 15.43, name: 'Chertan' }, to: { ra: 152.09, dec: 11.97, name: 'Regulus' } },
      { from: { ra: 169.55, dec: 15.43, name: 'Chertan' }, to: { ra: 168.53, dec: 20.52, name: 'Zosma' } },
    ],
  },
  {
    id: 'pegasus_andromeda',
    name: 'Pegasus (The Winged Horse) & Andromeda',
    latin: 'Pegasus & Andromeda',
    culture: 'Greek mythology',
    funFact: 'The Great Square of Pegasus connects seamlessly to Andromeda, pointing straight to the Andromeda Galaxy (M31)!',
    lines: [
      // Great Square of Pegasus
      { from: { ra: 346.19, dec: 15.21, name: 'Markab' }, to: { ra: 345.94, dec: 28.08, name: 'Scheat' } },
      { from: { ra: 345.94, dec: 28.08, name: 'Scheat' }, to: { ra: 2.30, dec: 29.09, name: 'Alpheratz' } },
      { from: { ra: 2.30, dec: 29.09, name: 'Alpheratz' }, to: { ra: 3.31, dec: 15.18, name: 'Algenib' } },
      { from: { ra: 3.31, dec: 15.18, name: 'Algenib' }, to: { ra: 346.19, dec: 15.21, name: 'Markab' } },
      // Chain of Andromeda to M31
      { from: { ra: 2.30, dec: 29.09, name: 'Alpheratz' }, to: { ra: 17.43, dec: 35.62, name: 'Mirach' } },
      { from: { ra: 17.43, dec: 35.62, name: 'Mirach' }, to: { ra: 30.97, dec: 42.33, name: 'Almach' } },
      { from: { ra: 17.43, dec: 35.62, name: 'Mirach' }, to: { ra: 10.68, dec: 41.27, name: 'Andromeda Galaxy' } },
    ],
  },
  {
    id: 'crux_centaurus',
    name: 'Crux (Southern Cross) & Centaurus',
    latin: 'Crux & Centaurus',
    culture: 'Australian / Polynesian / South American',
    funFact: 'The Southern Cross is the premier navigational marker for Earth’s southern hemisphere, flanked by the brilliant Pointers Alpha & Beta Centauri.',
    lines: [
      // Crux diamond cross
      { from: { ra: 186.65, dec: -63.10, name: 'Acrux' }, to: { ra: 187.80, dec: -57.11, name: 'Gacrux' } },
      { from: { ra: 191.93, dec: -59.69, name: 'Mimosa' }, to: { ra: 183.95, dec: -58.75, name: 'Imai' } },
      // Centaurus Pointers to the Cross
      { from: { ra: 219.90, dec: -60.83, name: 'Alpha Centauri' }, to: { ra: 210.96, dec: -60.37, name: 'Hadar' } },
    ],
  },
  {
    id: 'summer_triangle',
    name: 'Lyra & Aquila (Summer Triangle)',
    latin: 'Lyra & Aquila',
    culture: 'Greek / Chinese (Qixi / Cowherd and Weaver)',
    funFact: 'Features brilliant Vega and Altair, forming two anchors of the famous Northern Summer Triangle.',
    lines: [
      // Lyra Harp
      { from: { ra: 279.23, dec: 38.78, name: 'Vega' }, to: { ra: 282.52, dec: 33.36, name: 'Sheliak' } },
      { from: { ra: 282.52, dec: 33.36, name: 'Sheliak' }, to: { ra: 284.74, dec: 32.69, name: 'Sulafat' } },
      { from: { ra: 284.74, dec: 32.69, name: 'Sulafat' }, to: { ra: 279.23, dec: 38.78, name: 'Vega' } },
      // Aquila Eagle
      { from: { ra: 297.70, dec: 8.87, name: 'Altair' }, to: { ra: 295.38, dec: 10.61, name: 'Tarazed' } },
      { from: { ra: 297.70, dec: 8.87, name: 'Altair' }, to: { ra: 298.83, dec: 6.41, name: 'Alshain' } },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini (The Twins)',
    latin: 'Gemini',
    culture: 'Greek / Roman / Babylonian',
    funFact: 'Anchored by the famous stellar twin stars Castor (a six-star sextuple system!) and orange giant Pollux.',
    lines: [
      { from: { ra: 113.65, dec: 31.89, name: 'Castor' }, to: { ra: 100.98, dec: 25.13, name: 'Mebsuta' } },
      { from: { ra: 100.98, dec: 25.13, name: 'Mebsuta' }, to: { ra: 99.43, dec: 16.40, name: 'Alhena' } },
      { from: { ra: 116.33, dec: 28.03, name: 'Pollux' }, to: { ra: 110.03, dec: 21.98, name: 'Wasat' } },
      { from: { ra: 110.03, dec: 21.98, name: 'Wasat' }, to: { ra: 99.43, dec: 16.40, name: 'Alhena' } },
      { from: { ra: 113.65, dec: 31.89, name: 'Castor' }, to: { ra: 116.33, dec: 28.03, name: 'Pollux' } },
    ],
  },
  {
    id: 'bootes',
    name: 'Boötes (The Herdsman)',
    latin: 'Boötes',
    culture: 'Greek mythology',
    funFact: "Follow the arc of the Big Dipper's handle to 'speed on to Arcturus', the 4th-brightest star in the sky!",
    lines: [
      { from: { ra: 213.91, dec: 19.18, name: 'Arcturus' }, to: { ra: 208.68, dec: 18.39, name: 'Muphrid' } },
      { from: { ra: 213.91, dec: 19.18, name: 'Arcturus' }, to: { ra: 221.25, dec: 27.07, name: 'Izar' } },
      { from: { ra: 221.25, dec: 27.07, name: 'Izar' }, to: { ra: 225.25, dec: 40.39, name: 'Nekkar' } },
      { from: { ra: 225.25, dec: 40.39, name: 'Nekkar' }, to: { ra: 217.98, dec: 38.31, name: 'Seginus' } },
      { from: { ra: 217.98, dec: 38.31, name: 'Seginus' }, to: { ra: 213.91, dec: 19.18, name: 'Arcturus' } },
    ],
  },
];
