import React, { useState } from 'react';
import useStore from '../store/useStore';
import {
  Rocket,
  Sparkles,
  Trophy,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Play,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Volume2,
} from 'lucide-react';

const TOUR_STOPS = [
  {
    step: 1,
    id: 'barnard',
    title: "Barnard's Star — The Cosmic Speed Demon!",
    subtitle: "Why do some stars move?",
    emoji: "🏃‍♂️⭐",
    ra: 269.4521,
    dec: 4.6933,
    targetName: "Barnard's Star",
    fov: 0.8,
    category: "High-Speed Proper Motion Star",
    story: "Look at the orange star in the center! Most stars look completely still because they are trillions of miles away. But Barnard's Star is flying through space at over 500,000 km/h (310,000 mph)!\n\nThat is so fast it could travel from Earth to the Moon in just 45 seconds!",
    actionTip: "Click the 'BLINK' button on the sky viewer to watch Barnard's Star jump across 6 months of space time!",
    funFact: "In about 10,000 years, Barnard's Star will become the closest star to Earth, passing even closer than Proxima Centauri!",
    question: "Why does Barnard's star seem to move faster than other stars?",
    answer: "It's both moving very fast AND it's one of the closest stars to our Solar System (only 6 light-years away)!",
  },
  {
    step: 2,
    id: 'wise0855',
    title: "WISE 0855 — The Frozen Brown Dwarf (Planet X Cousin)!",
    subtitle: "A star as cold as the North Pole",
    emoji: "🧊🪐",
    ra: 133.7933,
    dec: -7.2451,
    targetName: "WISE 0855-0714",
    fov: 0.6,
    category: "Sub-Stellar Brown Dwarf / Planet X Analog",
    story: "Is there a secret 'Planet X' hiding in the dark frozen edges of our solar system? WISE 0855 is our closest example! It's a 'failed star'—it has the mass of a giant planet, but it never got hot enough to ignite nuclear fusion.\n\nIts temperature is -13°C (8°F)—colder than an ice cube! Because it emits zero visible light, your eyes would see nothing. But SPHEREx's near-infrared sensors can spot its faint, cozy body heat!",
    actionTip: "Look at the '102-Band Spectrum' panel to see its cold water ice clouds absorption signature!",
    funFact: "WISE 0855 has water ice clouds in its atmosphere, just like Earth and Jupiter!",
    question: "Why do we need infrared telescopes like SPHEREx to find Planet X?",
    answer: "Cold objects don't shine with visible light, but they glow softly in infrared heat!",
  },
  {
    step: 3,
    id: 'trappist1',
    title: "TRAPPIST-1 — The 7 Alien Earths!",
    subtitle: "A crowded alien solar system",
    emoji: "🪐👨‍🚀",
    ra: 346.6223,
    dec: -5.0413,
    targetName: "TRAPPIST-1",
    fov: 0.7,
    category: "Multi-Planet Exoplanet System",
    story: "Imagine a cozy little red dwarf star with SEVEN rocky planets orbiting around it! Three of them are in the 'Habitable Zone'—the sweet spot where temperatures could allow liquid oceans and rivers to exist.\n\nAll 7 planets are so close together that if you stood on one, the other planets would look bigger in your sky than the Moon looks from Earth!",
    actionTip: "Click the 'Catalogs & Exoplanets' tab on the right to see the orbital periods of all 7 planets (b through h)!",
    funFact: "TRAPPIST-1 is so calm and long-lived that it could survive for 12 trillion years—over 800 times longer than the current age of our universe!",
    question: "What is the 'Habitable Zone'?",
    answer: "The orbital region where it's not too hot and not too cold for liquid water to exist on a planet's surface.",
  },
  {
    step: 4,
    id: 'm42',
    title: "Orion Nebula (M42) — The Star Nursery!",
    subtitle: "Where baby stars are born",
    emoji: "✨👶",
    ra: 83.8221,
    dec: -5.3911,
    targetName: "Orion Nebula (M42)",
    fov: 1.5,
    category: "Stellar Nursery & Emission Nebula",
    story: "You are looking at a cosmic incubator! Inside this gigantic glowing cloud of interstellar gas and dust, gravity is pulling particles together right now to create brand new stars and infant solar systems.\n\nThick dust blocks normal visible light, but SPHEREx's infrared detectors can peer right through the dust blankets to see baby stars forming inside!",
    actionTip: "Switch surveys between 'DSS Optical' and 'SPHEREx NIR' to see how infrared pierces straight through the thick space dust!",
    funFact: "The Orion Nebula is 24 light-years across. That means a beam of light would take 24 years just to travel from one side of the nursery to the other!",
    question: "What are stars made of when they form?",
    answer: "Giant collapsing clouds of hydrogen gas, helium, and cosmic dust.",
  },
  {
    step: 5,
    id: 'm31',
    title: "Andromeda Galaxy (M31) — Island of 1 Trillion Stars!",
    subtitle: "Our giant spiral neighbor",
    emoji: "🌀🌌",
    ra: 10.6847,
    dec: 41.2687,
    targetName: "Messier 31 (Andromeda)",
    fov: 2.2,
    category: "Spiral Galaxy",
    story: "Look at this grand spiral whirlpool! Andromeda is our nearest galactic neighbor, containing over ONE TRILLION stars—more than twice as many as our Milky Way!\n\nEven though it looks peaceful, Andromeda is currently speeding toward our Milky Way at 110 kilometers per second. But don't worry: they won't meet for another 4.5 billion years!",
    actionTip: "Look at the coordinate readout: the light hitting your screen left Andromeda 2.5 million years ago, when early human ancestors were first discovering stone tools!",
    funFact: "On a clear, dark night away from city lights, you can actually see Andromeda with your naked eyes as a faint fuzzy oval in the sky!",
    question: "How long does light take to reach Earth from Andromeda?",
    answer: "2.5 million years!",
  },
];

export default function CosmicExplorerTour({ isOpen, onClose }) {
  const { setPosition, setFov, setIsBlinking } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([0]);

  if (!isOpen) return null;

  const stop = TOUR_STOPS[currentStep];

  const flyToTarget = (item) => {
    setPosition(item.ra, item.dec, item.targetName);
    setFov(item.fov);
    if (item.id === 'barnard') {
      setIsBlinking(true);
    }
  };

  const nextStop = () => {
    if (currentStep < TOUR_STOPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setShowAnswer(false);
      if (!completedSteps.includes(next)) {
        setCompletedSteps((prev) => [...prev, next]);
      }
      flyToTarget(TOUR_STOPS[next]);
    }
  };

  const prevStop = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setShowAnswer(false);
      flyToTarget(TOUR_STOPS[prev]);
    }
  };

  const isTourComplete = completedSteps.length === TOUR_STOPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between p-4 px-6 bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-purple-500/10 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm">
              <Rocket className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base tracking-wide text-slate-900 dark:text-white">
                  Cosmic Discovery Tour
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                  KIDS & CITIZENS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore the marvels of the infrared universe with NASA SPHEREx
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour Progress Indicators */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-white/5 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {TOUR_STOPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setShowAnswer(false);
                  flyToTarget(TOUR_STOPS[idx]);
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  idx === currentStep
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-110'
                    : completedSteps.includes(idx)
                    ? 'bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <span className="text-slate-500 dark:text-slate-400">
            Mission Stop {currentStep + 1} of {TOUR_STOPS.length}
          </span>
        </div>

        {/* Scrollable Story Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {/* Stop Title Card */}
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{stop.emoji}</span>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {stop.title}
              </h3>
              <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">
                {stop.subtitle} · {stop.category}
              </p>
            </div>
          </div>

          {/* Educational Storytelling */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 whitespace-pre-line text-sm">
            {stop.story}
          </div>

          {/* Interactive Try It Out Action */}
          <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 flex items-start gap-3">
            <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-xs font-bold uppercase text-cyan-700 dark:text-cyan-300">
                🔭 Try It Now on the Sky Viewer:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {stop.actionTip}
              </p>
            </div>
          </div>

          {/* Did You Know? Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-xs font-bold uppercase text-amber-700 dark:text-amber-300">
                💡 Fun Cosmic Fact:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {stop.funFact}
              </p>
            </div>
          </div>

          {/* Interactive Quiz / Question for Kids */}
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Cosmic Brain Teaser:
              </span>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                {showAnswer ? 'Hide Answer' : 'Reveal Answer 🔍'}
              </button>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
              {stop.question}
            </p>
            {showAnswer && (
              <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-500/20 text-xs text-purple-800 dark:text-purple-200 bg-purple-500/10 p-2 rounded-lg animate-in fade-in">
                ✨ <strong>Answer:</strong> {stop.answer}
              </div>
            )}
          </div>

          {/* Tour Completion Celebration */}
          {isTourComplete && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-4 text-emerald-800 dark:text-emerald-300 animate-in zoom-in-95">
              <Trophy className="w-8 h-8 text-amber-400 shrink-0 animate-bounce" />
              <div>
                <span className="font-bold text-sm">MISSION ACCOMPLISHED!</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Congratulations, Junior Astronomer! You've unlocked the <strong>SPHEREx Cosmic Pioneer Badge</strong>. You now know how astronomers use infrared light to track moving worlds!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between p-4 px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={prevStop}
            disabled={currentStep === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stop</span>
          </button>

          <button
            onClick={() => flyToTarget(stop)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <Compass className="w-4 h-4 text-cyan-500" />
            <span>Center on Sky 🎯</span>
          </button>

          {currentStep < TOUR_STOPS.length - 1 ? (
            <button
              onClick={nextStop}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
            >
              <span>Next Stop</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Finish Tour!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
