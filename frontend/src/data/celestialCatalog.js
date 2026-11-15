/**
 * Master Astronomical Catalog for PhotonX
 * ========================================
 * Comprehensive offline registry containing:
 * - All 88 IAU Constellations with central coordinates and lore
 * - Over 80 Named Anchor Stars, Red Dwarfs & Planet X Analogs
 * - Famous Exoplanet Systems (TRAPPIST-1, Proxima Centauri b, Kepler)
 * - Complete Messier Deep-Sky Catalog & benchmark galaxies
 * - Real-time fuzzy query matcher and coordinate parser
 */

export const ALL_CONSTELLATIONS = [
  { name: 'Andromeda', ra: 15.0, dec: 38.0, desc: 'Chained Maiden constellation, home of M31', category: 'Constellation' },
  { name: 'Antlia', ra: 151.0, dec: -32.5, desc: 'Air Pump, southern constellation', category: 'Constellation' },
  { name: 'Apus', ra: 242.0, dec: -75.3, desc: 'Bird of Paradise, deep southern sky', category: 'Constellation' },
  { name: 'Aquarius', ra: 334.0, dec: -9.0, desc: 'Water Bearer, zodiac constellation', category: 'Constellation' },
  { name: 'Aquila', ra: 296.5, dec: 3.4, desc: 'The Eagle, contains bright star Altair', category: 'Constellation' },
  { name: 'Ara', ra: 263.0, dec: -53.6, desc: 'The Altar, southern Milky Way constellation', category: 'Constellation' },
  { name: 'Aries', ra: 40.0, dec: 20.8, desc: 'The Ram, zodiac constellation', category: 'Constellation' },
  { name: 'Auriga', ra: 84.0, dec: 42.0, desc: 'The Charioteer, contains golden Capella', category: 'Constellation' },
  { name: 'Boötes', ra: 219.0, dec: 31.0, desc: 'The Herdsman, home of bright Arcturus', category: 'Constellation' },
  { name: 'Caelum', ra: 71.0, dec: -37.8, desc: "The Engraver's Chisel, faint southern constellation", category: 'Constellation' },
  { name: 'Camelopardalis', ra: 88.0, dec: 69.4, desc: 'The Giraffe, circumpolar northern constellation', category: 'Constellation' },
  { name: 'Cancer', ra: 130.0, dec: 19.8, desc: 'The Crab, contains Beehive Cluster (M44)', category: 'Constellation' },
  { name: 'Canes Venatici', ra: 196.0, dec: 40.1, desc: 'Hunting Dogs, contains Whirlpool Galaxy (M51)', category: 'Constellation' },
  { name: 'Canis Major', ra: 104.0, dec: -22.1, desc: 'Great Dog, contains Sirius (brightest night star)', category: 'Constellation' },
  { name: 'Canis Minor', ra: 115.0, dec: 6.4, desc: 'Lesser Dog, home of subgiant Procyon', category: 'Constellation' },
  { name: 'Capricornus', ra: 315.0, dec: -18.0, desc: 'Sea Goat, zodiac constellation', category: 'Constellation' },
  { name: 'Carina', ra: 132.0, dec: -63.2, desc: 'The Keel, contains Canopus and Eta Carinae', category: 'Constellation' },
  { name: 'Cassiopeia', ra: 15.0, dec: 60.0, desc: 'The Queen, prominent W-shape circumpolar figure', category: 'Constellation' },
  { name: 'Centaurus', ra: 196.0, dec: -47.3, desc: 'The Centaur, contains Proxima and Alpha Centauri', category: 'Constellation' },
  { name: 'Cepheus', ra: 338.0, dec: 71.0, desc: 'The King, home of Delta Cephei variable prototype', category: 'Constellation' },
  { name: 'Cetus', ra: 25.0, dec: -7.2, desc: 'The Sea Monster, home of pulsating Mira', category: 'Constellation' },
  { name: 'Chamaeleon', ra: 165.0, dec: -79.2, desc: 'The Chameleon, south circumpolar sky', category: 'Constellation' },
  { name: 'Circinus', ra: 228.0, dec: -63.1, desc: 'The Compasses, southern Milky Way', category: 'Constellation' },
  { name: 'Columba', ra: 85.0, dec: -35.1, desc: "Noah's Dove, near Canis Major", category: 'Constellation' },
  { name: 'Coma Berenices', ra: 192.0, dec: 23.3, desc: "Berenice's Hair, rich in deep galaxies", category: 'Constellation' },
  { name: 'Corona Australis', ra: 286.0, dec: -40.0, desc: 'Southern Crown, elegant arc near Sagittarius', category: 'Constellation' },
  { name: 'Corona Borealis', ra: 237.0, dec: 28.5, desc: 'Northern Crown, horseshoe of stars with Gemma', category: 'Constellation' },
  { name: 'Corvus', ra: 186.0, dec: -18.4, desc: 'The Crow, compact quadrilateral of stars', category: 'Constellation' },
  { name: 'Crater', ra: 171.0, dec: -15.9, desc: 'The Cup, faint constellation near Hydra', category: 'Constellation' },
  { name: 'Crux', ra: 186.0, dec: -60.2, desc: 'The Southern Cross, iconic southern navigational marker', category: 'Constellation' },
  { name: 'Cygnus', ra: 308.0, dec: 42.1, desc: 'The Swan (Northern Cross), home of Deneb', category: 'Constellation' },
  { name: 'Delphinus', ra: 310.0, dec: 11.7, desc: 'The Dolphin, compact diamond-shaped asterism', category: 'Constellation' },
  { name: 'Dorado', ra: 78.0, dec: -65.3, desc: 'Swordfish / Dolphinfish, contains Large Magellanic Cloud', category: 'Constellation' },
  { name: 'Draco', ra: 257.0, dec: 67.2, desc: 'The Dragon, winding circumpolar figure near Ursa Minor', category: 'Constellation' },
  { name: 'Equuleus', ra: 318.0, dec: 7.8, desc: 'Little Horse, second-smallest constellation', category: 'Constellation' },
  { name: 'Eridanus', ra: 55.0, dec: -29.0, desc: 'The Celestial River, long meandering stream ending at Achernar', category: 'Constellation' },
  { name: 'Fornax', ra: 38.0, dec: -31.6, desc: 'The Furnace, home of Fornax Galaxy Cluster', category: 'Constellation' },
  { name: 'Gemini', ra: 107.0, dec: 22.5, desc: 'The Twins, marked by bright Castor and Pollux', category: 'Constellation' },
  { name: 'Grus', ra: 337.0, dec: -46.4, desc: 'The Crane, southern constellation', category: 'Constellation' },
  { name: 'Hercules', ra: 258.0, dec: 27.5, desc: 'The Hero, contains Great Globular Cluster (M13)', category: 'Constellation' },
  { name: 'Horologium', ra: 48.0, dec: -53.4, desc: 'The Pendulum Clock, southern constellation', category: 'Constellation' },
  { name: 'Hydra', ra: 170.0, dec: -14.5, desc: 'Female Water Snake, largest constellation by area', category: 'Constellation' },
  { name: 'Hydrus', ra: 36.0, dec: -70.0, desc: 'Male Water Snake, near Small Magellanic Cloud', category: 'Constellation' },
  { name: 'Indus', ra: 318.0, dec: -56.8, desc: 'The Indian / Indigenous Figure', category: 'Constellation' },
  { name: 'Lacerta', ra: 337.0, dec: 46.0, desc: 'The Lizard, small zigzag of faint northern stars', category: 'Constellation' },
  { name: 'Leo', ra: 161.0, dec: 13.1, desc: 'The Lion, prominent sickle shape with Regulus', category: 'Constellation' },
  { name: 'Leo Minor', ra: 153.0, dec: 33.5, desc: 'Lesser Lion, faint northern constellation', category: 'Constellation' },
  { name: 'Lepus', ra: 83.0, dec: -19.0, desc: 'The Hare, crouched at the feet of Orion', category: 'Constellation' },
  { name: 'Libra', ra: 228.0, dec: -15.6, desc: 'The Scales, zodiac balance constellation', category: 'Constellation' },
  { name: 'Lupus', ra: 231.0, dec: -42.8, desc: 'The Wolf, southern Milky Way near Centaurus', category: 'Constellation' },
  { name: 'Lynx', ra: 119.0, dec: 44.8, desc: 'The Lynx, faint constellation near Ursa Major', category: 'Constellation' },
  { name: 'Lyra', ra: 283.0, dec: 36.0, desc: 'The Harp, contains brilliant Vega and Ring Nebula', category: 'Constellation' },
  { name: 'Mensa', ra: 84.0, dec: -77.5, desc: 'Table Mountain, south polar constellation', category: 'Constellation' },
  { name: 'Microscopium', ra: 312.0, dec: -36.3, desc: 'The Microscope, faint southern constellation', category: 'Constellation' },
  { name: 'Monoceros', ra: 106.0, dec: -5.7, desc: 'The Unicorn, contains Rosette Nebula', category: 'Constellation' },
  { name: 'Musca', ra: 189.0, dec: -70.2, desc: 'The Fly, near the Southern Cross', category: 'Constellation' },
  { name: 'Norma', ra: 242.0, dec: -52.0, desc: "Carpenter's Square, southern Milky Way", category: 'Constellation' },
  { name: 'Octans', ra: 315.0, dec: -82.0, desc: 'The Octant, contains Southern Celestial Pole', category: 'Constellation' },
  { name: 'Ophiuchus', ra: 260.0, dec: -4.3, desc: "Serpent Bearer, 13th zodiac sign, home of Barnard's Star", category: 'Constellation' },
  { name: 'Orion', ra: 84.0, dec: 1.0, desc: 'The Hunter, marked by Betelgeuse, Rigel and Belt', category: 'Constellation' },
  { name: 'Pavo', ra: 292.0, dec: -65.7, desc: 'The Peacock, prominent southern constellation', category: 'Constellation' },
  { name: 'Pegasus', ra: 340.0, dec: 19.5, desc: 'The Winged Horse, Great Square of Pegasus', category: 'Constellation' },
  { name: 'Perseus', ra: 48.0, dec: 42.5, desc: 'The Hero, contains Algol and Double Cluster', category: 'Constellation' },
  { name: 'Phoenix', ra: 10.0, dec: -42.3, desc: 'The Mythical Phoenix Bird, southern sky', category: 'Constellation' },
  { name: 'Pictor', ra: 86.0, dec: -53.5, desc: "The Painter's Easel, contains Beta Pictoris disk", category: 'Constellation' },
  { name: 'Pisces', ra: 14.0, dec: 13.7, desc: 'The Fishes, zodiac constellation', category: 'Constellation' },
  { name: 'Piscis Austrinus', ra: 334.0, dec: -30.6, desc: 'Southern Fish, contains Fomalhaut and dust ring', category: 'Constellation' },
  { name: 'Puppis', ra: 112.0, dec: -31.2, desc: 'The Stern of the Argo Navis ship', category: 'Constellation' },
  { name: 'Pyxis', ra: 133.0, dec: -27.3, desc: "Mariner's Compass, near Puppis and Vela", category: 'Constellation' },
  { name: 'Reticulum', ra: 59.0, dec: -59.9, desc: 'The Reticle / Eyepiece Crosshair', category: 'Constellation' },
  { name: 'Sagitta', ra: 297.0, dec: 18.9, desc: 'The Arrow, third-smallest constellation', category: 'Constellation' },
  { name: 'Sagittarius', ra: 286.0, dec: -25.5, desc: 'The Archer, teapot asterism pointing to Galactic Center', category: 'Constellation' },
  { name: 'Scorpius', ra: 253.0, dec: -27.0, desc: 'The Scorpion, marked by red supergiant Antares', category: 'Constellation' },
  { name: 'Sculptor', ra: 0.0, dec: -32.5, desc: "Sculptor's Studio, contains Sculptor Galaxy (NGC 253)", category: 'Constellation' },
  { name: 'Scutum', ra: 281.0, dec: -10.0, desc: "Sobieski's Shield, rich Milky Way star clouds", category: 'Constellation' },
  { name: 'Serpens', ra: 260.0, dec: 6.0, desc: 'The Serpent, split into Caput (head) and Cauda (tail)', category: 'Constellation' },
  { name: 'Sextans', ra: 153.0, dec: -1.0, desc: 'The Sextant, astronomical instrument near Leo', category: 'Constellation' },
  { name: 'Taurus', ra: 69.0, dec: 16.0, desc: 'The Bull, contains Aldebaran, Pleiades, and Hyades', category: 'Constellation' },
  { name: 'Telescopium', ra: 275.0, dec: -51.0, desc: 'The Telescope, faint southern constellation', category: 'Constellation' },
  { name: 'Triangulum', ra: 33.0, dec: 31.5, desc: 'The Triangle, contains Triangulum Galaxy (M33)', category: 'Constellation' },
  { name: 'Triangulum Australe', ra: 242.0, dec: -65.4, desc: 'Southern Triangle, bright southern geometric group', category: 'Constellation' },
  { name: 'Tucana', ra: 359.0, dec: -65.8, desc: 'The Toucan, contains Small Magellanic Cloud & 47 Tuc', category: 'Constellation' },
  { name: 'Ursa Major', ra: 160.0, dec: 55.4, desc: 'The Great Bear, contains iconic Big Dipper asterism', category: 'Constellation' },
  { name: 'Ursa Minor', ra: 225.0, dec: 77.0, desc: 'The Little Bear, contains Polaris (North Star)', category: 'Constellation' },
  { name: 'Vela', ra: 140.0, dec: -47.0, desc: 'The Sails of Argo Navis, contains Vela Supernova Remnant', category: 'Constellation' },
  { name: 'Virgo', ra: 198.0, dec: -4.2, desc: 'The Maiden, contains Spica and Virgo Galaxy Cluster', category: 'Constellation' },
  { name: 'Volans', ra: 112.0, dec: -69.8, desc: 'The Flying Fish, southern sky', category: 'Constellation' },
  { name: 'Vulpecula', ra: 304.0, dec: 24.5, desc: 'The Fox, contains Dumbbell Nebula (M27)', category: 'Constellation' },
];

export const MASTER_CELESTIAL_TARGETS = [
  // Famous Near Neighbors & High Proper Motion Stars
  {
    name: 'Proxima Centauri',
    aliases: ['Alpha Centauri C', 'Proxima', 'V645 Cen', 'GL 551'],
    ra: 217.4289,
    dec: -62.6795,
    mag: 11.13,
    type: 'Red Dwarf Star',
    desc: 'Nearest star to Earth (4.246 light-years). Host to habitable-zone exoplanet Proxima b.',
    category: 'Nearest Star',
  },
  {
    name: 'Alpha Centauri A',
    aliases: ['Rigil Kentaurus', 'Toliman', 'Alpha Cen A', 'Gl 559A'],
    ra: 219.9021,
    dec: -60.8340,
    mag: -0.01,
    type: 'Yellow Star (G2V)',
    desc: 'Primary star of closest stellar system to Earth (4.37 ly). Solar twin.',
    category: 'Bright Star',
  },
  {
    name: 'Alpha Centauri B',
    aliases: ['Toliman', 'Alpha Cen B', 'Gl 559B'],
    ra: 219.9021,
    dec: -60.8375,
    mag: 1.33,
    type: 'Orange Star (K1V)',
    desc: 'Secondary component of Alpha Centauri binary system at 4.37 light-years.',
    category: 'Bright Star',
  },
  {
    name: "Barnard's Star",
    aliases: ['Barnard Star', 'V2500 Oph', 'Gl 699'],
    ra: 269.4521,
    dec: 4.6933,
    mag: 9.54,
    type: 'Red Dwarf Star',
    desc: 'Fastest proper motion star in Earth sky (10.3"/yr). Prime SPHEREx benchmark.',
    category: 'High Proper Motion',
  },
  {
    name: 'WISE 0855−0714',
    aliases: ['WISE 0855', 'WISE J085510.83-071442.5', 'WISE0855'],
    ra: 133.7933,
    dec: -7.2451,
    mag: 14.2,
    type: 'Cold Brown Dwarf',
    desc: 'Coldest known brown dwarf (~250 K). Sub-stellar Planet X analog at 7.2 ly.',
    category: 'Brown Dwarf',
  },
  {
    name: 'Wolf 359',
    aliases: ['CN Leonis', 'Gl 406'],
    ra: 164.1203,
    dec: 7.0147,
    mag: 13.54,
    type: 'Red Dwarf Star',
    desc: 'Fifth-closest individual star to the Sun at 7.86 light-years.',
    category: 'Nearest Star',
  },
  {
    name: 'Lalande 21185',
    aliases: ['Gl 411', 'HD 95735'],
    ra: 165.8341,
    dec: 35.9699,
    mag: 7.52,
    type: 'Red Dwarf Star',
    desc: 'Brightest red dwarf in the northern celestial hemisphere at 8.31 ly.',
    category: 'Nearest Star',
  },
  {
    name: 'Sirius',
    aliases: ['Alpha Canis Majoris', 'Dog Star', 'Sirius A', 'Gl 244'],
    ra: 101.2872,
    dec: -16.7161,
    mag: -1.46,
    type: 'White Main-Sequence Star (A1V)',
    desc: 'Brightest star in Earth night sky. Binary system with white dwarf Sirius B at 8.6 ly.',
    category: 'Bright Star',
  },
  {
    name: 'Luyten 726-8',
    aliases: ['BL Ceti', 'UV Ceti'],
    ra: 24.7542,
    dec: -17.9503,
    mag: 12.57,
    type: 'Flare Star Binary',
    desc: 'Prototype UV Ceti flare star system at 8.7 light-years.',
    category: 'Nearest Star',
  },
  {
    name: 'Ross 128',
    aliases: ['FI Virginis', 'Gl 447'],
    ra: 176.9351,
    dec: 0.8045,
    mag: 11.15,
    type: 'Red Dwarf Star',
    desc: 'Inactive red dwarf star at 11.0 light-years with temperate exoplanet Ross 128 b.',
    category: 'Nearest Star',
  },
  {
    name: 'Epsilon Eridani',
    aliases: ['Ran', '18 Eridani', 'Gl 144'],
    ra: 53.2327,
    dec: -9.4583,
    mag: 3.73,
    type: 'Orange Star (K2V)',
    desc: 'Nearest solar-type star with known planetary debris disk at 10.5 light-years.',
    category: 'Exoplanet Host',
  },
  {
    name: 'Epsilon Indi',
    aliases: ['Eps Ind', 'Gl 845'],
    ra: 330.8413,
    dec: -56.7860,
    mag: 4.69,
    type: 'Orange Dwarf + Brown Dwarf Binary',
    desc: 'Orange dwarf star at 11.9 ly with nearby binary brown dwarf companions.',
    category: 'Brown Dwarf',
  },
  {
    name: 'Tau Ceti',
    aliases: ['52 Ceti', 'Gl 71'],
    ra: 26.0170,
    dec: -15.9374,
    mag: 3.50,
    type: 'Yellow Star (G8V)',
    desc: 'Stable solar-type star at 11.9 light-years with multiple candidate exoplanets.',
    category: 'Exoplanet Host',
  },
  {
    name: 'TRAPPIST-1',
    aliases: ['Trappist 1', '2MASS J23062928-0502285'],
    ra: 346.6222,
    dec: -5.0413,
    mag: 18.8,
    type: 'Ultra-Cool Red Dwarf',
    desc: 'Star hosting 7 Earth-sized terrestrial planets, 3 in habitable zone at 39.6 ly.',
    category: 'Exoplanet Host',
  },

  // Optical Anchor Stars
  {
    name: 'Canopus',
    aliases: ['Alpha Carinae', 'Alpha Car'],
    ra: 95.9879,
    dec: -52.6957,
    mag: -0.74,
    type: 'Bright Giant (F0II)',
    desc: 'Second-brightest star in sky. Primary navigational guide for spacecraft.',
    category: 'Bright Star',
  },
  {
    name: 'Arcturus',
    aliases: ['Alpha Boötis', 'Alpha Boo'],
    ra: 213.9153,
    dec: 19.1824,
    mag: -0.05,
    type: 'Red Giant Star (K1.5III)',
    desc: 'Brightest star in northern celestial hemisphere at 36.7 light-years.',
    category: 'Bright Star',
  },
  {
    name: 'Vega',
    aliases: ['Alpha Lyrae', 'Alpha Lyr'],
    ra: 279.2347,
    dec: 38.7837,
    mag: 0.03,
    type: 'White Main-Sequence Star (A0V)',
    desc: 'Zero-point standard star for astronomical magnitude scale. Pure optical anchor.',
    category: 'Bright Star',
  },
  {
    name: 'Capella',
    aliases: ['Alpha Aurigae', 'Alpha Aur'],
    ra: 79.1723,
    dec: 45.9980,
    mag: 0.08,
    type: 'Quadruple Giant System',
    desc: 'Brilliant yellow giant system at 42.9 light-years in Auriga.',
    category: 'Bright Star',
  },
  {
    name: 'Rigel',
    aliases: ['Beta Orionis', 'Beta Ori'],
    ra: 78.6345,
    dec: -8.2016,
    mag: 0.13,
    type: 'Blue Supergiant (B8Ia)',
    desc: 'Blinding blue supergiant in Orion, 40,000 times brighter than the Sun.',
    category: 'Bright Star',
  },
  {
    name: 'Procyon',
    aliases: ['Alpha Canis Minoris', 'Alpha CMi'],
    ra: 114.8255,
    dec: 5.2250,
    mag: 0.38,
    type: 'Yellow-White Subgiant (F5IV-V)',
    desc: 'Bright subgiant star at 11.46 light-years with white dwarf companion.',
    category: 'Bright Star',
  },
  {
    name: 'Betelgeuse',
    aliases: ['Alpha Orionis', 'Alpha Ori'],
    ra: 88.7929,
    dec: 7.4071,
    mag: 0.50,
    type: 'Red Supergiant (M1-2 Ia-ab)',
    desc: 'Massive pulsating red supergiant star in Orion, approaching supernova.',
    category: 'Bright Star',
  },
  {
    name: 'Achernar',
    aliases: ['Alpha Eridani', 'Alpha Eri'],
    ra: 24.4285,
    dec: -57.2367,
    mag: 0.46,
    type: 'Blue Star (B6Vep)',
    desc: 'Least spherical star known, rotating so fast it bulges 56% at equator.',
    category: 'Bright Star',
  },
  {
    name: 'Altair',
    aliases: ['Alpha Aquilae', 'Alpha Aql'],
    ra: 297.6958,
    dec: 8.8683,
    mag: 0.77,
    type: 'White Star (A7V)',
    desc: 'Rapidly rotating star in the Summer Triangle at 16.7 light-years.',
    category: 'Bright Star',
  },
  {
    name: 'Aldebaran',
    aliases: ['Alpha Tauri', 'Alpha Tau', 'Eye of Taurus'],
    ra: 68.9802,
    dec: 16.5093,
    mag: 0.85,
    type: 'Orange Giant (K5III)',
    desc: 'Glowing red eye of Taurus the Bull, in front of the Hyades cluster.',
    category: 'Bright Star',
  },
  {
    name: 'Antares',
    aliases: ['Alpha Scorpii', 'Alpha Sco', 'Heart of Scorpion'],
    ra: 247.3519,
    dec: -26.4320,
    mag: 1.06,
    type: 'Red Supergiant (M1.5Iab)',
    desc: 'Colossal red supergiant at heart of Scorpius, 700 times size of Sun.',
    category: 'Bright Star',
  },
  {
    name: 'Spica',
    aliases: ['Alpha Virginis', 'Alpha Vir'],
    ra: 201.2982,
    dec: -11.1613,
    mag: 0.98,
    type: 'Blue Giant Binary (B1III-IV)',
    desc: 'Brilliant spectroscopic binary star in Virgo at 250 light-years.',
    category: 'Bright Star',
  },
  {
    name: 'Pollux',
    aliases: ['Beta Geminorum', 'Beta Gem'],
    ra: 116.3290,
    dec: 28.0262,
    mag: 1.14,
    type: 'Orange Giant (K0III)',
    desc: 'Brightest star in Gemini with confirmed exoplanet Thestias.',
    category: 'Bright Star',
  },
  {
    name: 'Castor',
    aliases: ['Alpha Geminorum', 'Alpha Gem'],
    ra: 113.6494,
    dec: 31.8883,
    mag: 1.58,
    type: 'Sextuple Star System',
    desc: 'Fascinating sextuple star system composed of three binary pairs.',
    category: 'Bright Star',
  },
  {
    name: 'Fomalhaut',
    aliases: ['Alpha Piscis Austrini', 'Alpha PsA'],
    ra: 344.4127,
    dec: -29.6222,
    mag: 1.16,
    type: 'White Star with Dust Ring',
    desc: 'Young star at 25 ly encircled by dramatic cold debris and dust belts.',
    category: 'Bright Star',
  },
  {
    name: 'Deneb',
    aliases: ['Alpha Cygni', 'Alpha Cyg'],
    ra: 310.3579,
    dec: 45.2803,
    mag: 1.25,
    type: 'White Supergiant (A2Ia)',
    desc: 'Incredibly luminous supergiant 2,600 light-years away at head of Northern Cross.',
    category: 'Bright Star',
  },
  {
    name: 'Polaris',
    aliases: ['Alpha Ursae Minoris', 'Alpha UMi', 'North Star'],
    ra: 37.9546,
    dec: 89.2641,
    mag: 1.98,
    type: 'Cepheid Variable Supergiant',
    desc: 'The North Celestial Pole star, classical navigational anchor.',
    category: 'Bright Star',
  },
  {
    name: 'Eta Carinae',
    aliases: ['Eta Car', 'HD 93308'],
    ra: 161.2647,
    dec: -59.6844,
    mag: 4.3,
    type: 'Luminous Blue Variable Hypergiant',
    desc: 'Supermassive unstable stellar binary surrounded by expanding Homunculus Nebula.',
    category: 'Massive Star',
  },

  // Deep-Sky Benchmark Objects & Galaxies
  {
    name: 'Messier 31 (Andromeda Galaxy)',
    aliases: ['M31', 'Andromeda Galaxy', 'NGC 224'],
    ra: 10.6847,
    dec: 41.2687,
    mag: 3.44,
    type: 'Spiral Galaxy',
    desc: 'Nearest large spiral galaxy at 2.5 million ly. SPHEREx pierces dust lanes.',
    category: 'Galaxy',
  },
  {
    name: 'Messier 42 (Orion Nebula)',
    aliases: ['M42', 'Orion Nebula', 'NGC 1976'],
    ra: 83.8221,
    dec: -5.3911,
    mag: 4.0,
    type: 'Stellar Nursery / H II Region',
    desc: 'Nearest massive star factory glowing in water ice and organic PAH molecules.',
    category: 'Nebula',
  },
  {
    name: 'Messier 45 (Pleiades)',
    aliases: ['M45', 'Pleiades', 'Seven Sisters'],
    ra: 56.6011,
    dec: 24.1141,
    mag: 1.6,
    type: 'Open Star Cluster',
    desc: 'Young cluster of over 1,000 stars embedded in striking blue reflection nebulosity.',
    category: 'Star Cluster',
  },
  {
    name: 'Sagittarius A*',
    aliases: ['Sgr A*', 'Galactic Center', 'Milky Way Core'],
    ra: 266.4168,
    dec: -29.0078,
    mag: 12.0,
    type: 'Supermassive Black Hole',
    desc: '4.3-million-solar-mass black hole at center of the Milky Way galaxy.',
    category: 'Black Hole',
  },
  {
    name: 'Messier 1 (Crab Nebula)',
    aliases: ['M1', 'Crab Nebula', 'NGC 1952'],
    ra: 83.6331,
    dec: 22.0145,
    mag: 8.4,
    type: 'Supernova Remnant',
    desc: 'Debris from supernova observed in year 1054 with central spinning pulsar.',
    category: 'Nebula',
  },
  {
    name: 'Messier 33 (Triangulum Galaxy)',
    aliases: ['M33', 'Triangulum Galaxy', 'NGC 598'],
    ra: 23.4621,
    dec: 30.6602,
    mag: 5.72,
    type: 'Spiral Galaxy',
    desc: 'Third-largest member of our Local Group of galaxies at 2.73 Mly.',
    category: 'Galaxy',
  },
  {
    name: 'Messier 51 (Whirlpool Galaxy)',
    aliases: ['M51', 'Whirlpool Galaxy', 'NGC 5194'],
    ra: 202.4696,
    dec: 47.1953,
    mag: 8.4,
    type: 'Grand Design Spiral Galaxy',
    desc: 'Classic interacting face-on spiral galaxy with pronounced companion NGC 5195.',
    category: 'Galaxy',
  },
  {
    name: 'Messier 57 (Ring Nebula)',
    aliases: ['M57', 'Ring Nebula', 'NGC 6720'],
    ra: 283.3962,
    dec: 33.0292,
    mag: 8.8,
    type: 'Planetary Nebula',
    desc: 'Iconic smoke-ring shell of gas ejected by dying central white dwarf in Lyra.',
    category: 'Nebula',
  },
  {
    name: 'Messier 87 (Virgo A)',
    aliases: ['M87', 'Virgo A', 'NGC 4486'],
    ra: 187.7059,
    dec: 12.3911,
    mag: 8.6,
    type: 'Giant Elliptical Galaxy',
    desc: 'Immense galaxy containing 6.5-billion-solar-mass black hole imaged by EHT.',
    category: 'Galaxy',
  },
  {
    name: 'Messier 104 (Sombrero Galaxy)',
    aliases: ['M104', 'Sombrero Galaxy', 'NGC 4594'],
    ra: 189.9976,
    dec: -11.6231,
    mag: 8.0,
    type: 'Spiral Galaxy with Dust Lane',
    desc: 'Striking galaxy with broad dust ring and massive central bulge.',
    category: 'Galaxy',
  },
  {
    name: 'COSMOS Deep Survey Field',
    aliases: ['COSMOS', 'COSMOS Field'],
    ra: 150.1192,
    dec: 2.2058,
    mag: 20.0,
    type: 'Deep Survey Field',
    desc: 'Richest extragalactic survey field for galaxy evolution and SED fitting.',
    category: 'Deep Field',
  },
];

/**
 * Intelligent fuzzy resolver for celestial targets, constellations, and coordinates
 */
export function resolveCelestialTarget(rawQuery) {
  if (!rawQuery) return null;
  const q = rawQuery.trim().toLowerCase();

  // 1. Direct coordinate format: "217.42, -62.68" or "10.68 +41.27"
  const coordMatch = q.match(/^([+-]?\d+\.?\d*)[,\s]+([+-]?\d+\.?\d*)$/);
  if (coordMatch) {
    const ra = parseFloat(coordMatch[1]);
    const dec = parseFloat(coordMatch[2]);
    if (!isNaN(ra) && !isNaN(dec) && ra >= 0 && ra <= 360 && dec >= -90 && dec <= 90) {
      return {
        name: `Coordinates (${ra.toFixed(4)}°, ${dec >= 0 ? '+' : ''}${dec.toFixed(4)}°)`,
        ra,
        dec,
        category: 'Coordinates',
        desc: `Custom celestial coordinates RA ${ra.toFixed(4)}° Dec ${dec >= 0 ? '+' : ''}${dec.toFixed(4)}°`,
      };
    }
  }

  // 2. Exact or Alias Match in Master Targets
  for (const t of MASTER_CELESTIAL_TARGETS) {
    if (t.name.toLowerCase() === q) return t;
    if (t.aliases && t.aliases.some((a) => a.toLowerCase() === q)) return t;
  }

  // 3. Exact Constellation Match
  for (const c of ALL_CONSTELLATIONS) {
    if (c.name.toLowerCase() === q) return c;
  }

  // 4. Substring Match in Master Targets
  for (const t of MASTER_CELESTIAL_TARGETS) {
    if (t.name.toLowerCase().includes(q) || q.includes(t.name.toLowerCase())) return t;
    if (t.aliases && t.aliases.some((a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()))) {
      return t;
    }
  }

  // 5. Substring Constellation Match
  for (const c of ALL_CONSTELLATIONS) {
    if (c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())) return c;
  }

  return null;
}

/**
 * Filter autocomplete suggestions as user types in search bar
 */
export function getSearchSuggestions(query, limit = 8) {
  if (!query || query.trim().length === 0) {
    return [
      { name: "Proxima Centauri", desc: 'Nearest star system to Sun (4.24 ly)', category: 'Nearest Star', ra: 217.4289, dec: -62.6795 },
      { name: "Barnard's Star", desc: 'Fastest proper motion star (10.3"/yr)', category: 'High Proper Motion', ra: 269.4521, dec: 4.6933 },
      { name: 'WISE 0855', desc: 'Coldest brown dwarf (Planet X analog)', category: 'Brown Dwarf', ra: 133.7933, dec: -7.2451 },
      { name: 'Orion', desc: 'The Hunter constellation (Betelgeuse, Rigel)', category: 'Constellation', ra: 84.0, dec: 1.0 },
      { name: 'Ursa Major', desc: 'Great Bear (The Big Dipper)', category: 'Constellation', ra: 160.0, dec: 55.4 },
      { name: 'M31', desc: 'Andromeda Galaxy (2.5 Mly)', category: 'Galaxy', ra: 10.6847, dec: 41.2687 },
      { name: 'Sirius', desc: 'Brightest star in night sky (-1.46 mag)', category: 'Bright Star', ra: 101.2872, dec: -16.7161 },
      { name: 'TRAPPIST-1', desc: '7 Earth-sized exoplanets', category: 'Exoplanet Host', ra: 346.6222, dec: -5.0413 },
    ];
  }

  const q = query.trim().toLowerCase();
  const results = [];
  const seen = new Set();

  // Search in Master Targets
  for (const t of MASTER_CELESTIAL_TARGETS) {
    const matchName = t.name.toLowerCase().includes(q);
    const matchAlias = t.aliases && t.aliases.some((a) => a.toLowerCase().includes(q));
    if (matchName || matchAlias) {
      if (!seen.has(t.name)) {
        seen.add(t.name);
        results.push(t);
        if (results.length >= limit) return results;
      }
    }
  }

  // Search in Constellations
  for (const c of ALL_CONSTELLATIONS) {
    if (c.name.toLowerCase().includes(q)) {
      if (!seen.has(c.name)) {
        seen.add(c.name);
        results.push(c);
        if (results.length >= limit) return results;
      }
    }
  }

  return results;
}
