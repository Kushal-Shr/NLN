"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import { loginAnonymously, saveUserProfile } from "@/lib/db"; //newly created from libdb


//Gentle Onboarding - What brings you comfort?
const comfortOptions =[
  {id: "spiritual", label: "Spiritual Thoughts", icon:"🕊️", description:"Guided by faith  and reflection"},
  {id: "nature", label: "Nature & Calm" , icon:"🌿", description:"Grounded in the natural world" },
  {id: "practical", label: "Practical Advice" , icon:"💡", description:"Clear steps and solution" },
  {id: "community", label: " Just Someone to Talk To", icon:"🤝", description:"Human Connection above all"},
]; 

//Language Selection
const languages = [ 
  {id: "en", label:"English"},
  {id: "hi", label:"Hindi"},
  {id: "ne", label:"Nepali"},
  {id: "es", label:"Spanish"},
]; 

//Types
type Mode = "anonymous" | "save" | null;
type Step = "mode" | "comfort" | "language" | "done";

//Main Component 
export default function OnboardingPage(){
  const router = useRouter();
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<Mode>(null);
  const [comfort, setComfort] = useState<string | null>(null); 
  const [language, setLanguage] = useState<string>("en");

  const[mounted, setMounted] = useState(false);
  useEffect(()=> setMounted(true),[]);
  if(!mounted) return null;

  const handleModeSelect = (Selected: Mode) => {
    setMode(Selected);
    setTimeout(() => setStep("comfort"),300);
  }; 

  const handleComfortSelect = (id: string) => {
    setComfort(id);
    setTimeout(() => setStep("language"),300);
  }; 

const handleFinish = async () => {
    // Save preferences to localStorage so the home page can read them
    localStorage.setItem("sanctuary_comfort", comfort || "practical");
    localStorage.setItem("sanctuary_language", language);
    localStorage.setItem("sanctuary_mode", mode || "anonymous");

    if (mode === "save") {
      const user = await loginAnonymously();
      await saveUserProfile(user.uid, {
        comfort: comfort || "practical",
        language: language,
        background: "not set yet",
      });
    }

    
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f1a14] flex flex-col items-center justify-center px-4 py-12">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {["mode", "comfort", "language"].map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step === s
                ? "w-8 bg-[#7ec99a]"
                : ["mode", "comfort", "language"].indexOf(step) > i
                ? "w-4 bg-[#7ec99a]/60"
                : "w-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
            {/*Anonymous or Save*/}
{step === "mode" && (
  <motion.div 
  key="mode"
  initial={{opacity:0, y:24}}
  animate={{opacity:1, y:0}}
  exit={{opacity:0, y:-24}}
  transition={{duration: 0.4}}
  className="w-full max-w-md text-center"
> 
<p className="text-[#7ec99a] text-sm tracking-widest uppercase mb-3">Welcome</p>
<h1 className="text-white text-3xl font-semibold mb-3 leading-snug">
  How would you like to use this space?
</h1>
<p className="text-white/40 text-sm mb-10">
No Judgement. No Pressure. You can always change this later. 
</p>

<div className="flex flex-col gap-4">
  <button onClick={()=> handleModeSelect("anonymous")}
  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:boder-[#7ec99a]/50 rouned-2x1 p-5 text-left transition-all duration-200 group"
  >
    <div className="flex items-center gap-4">
      <span className="text-2xl">❔</span>
      <div>
        <p className="text-white font-medium">Stay Anonymous</p>
        <p className="text-white/40 text-sm mt-0.5">Nothing is saved. Fresh start every time</p>
      </div>
    </div>
  </button>

  <button onClick={() => handleModeSelect("save")}
  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#7ec99a]/50 rounded-2x1 p-5 text-left transition-all duration-200 group">
    <div className="flex items-center gap-4">
      <span className="text-2xl">⭐</span>
      <div>
        <p className="text-white font-medium">Save my Progress</p>
        <p className="text-white/40 text-sm mt-0.5">Remember my preferences and journey</p>
      </div>
    </div>
  </button>
</div>
</motion.div>
)}

                          {/*Comfort*/}
{step === "comfort" && (
  <motion.div 
  key ="comfort"
  initial={{opacity: 0, y:24}}
  animate={{opacity: 1, y:0}}
  exit={{opacity: 0, y:-24}}
  transition={{duration: 0.4}}
  className="w-full max-w-md text-center"
  > 
  <p className="text-[#7ec99a] text-sm tracking-widest uppercase mb-3">Your Space</p>
<h1 className="text-white text-3xl font-semibold mb-3 leading-snug">
  What brings you comfort? 
</h1>
<p className="text-white/40 text-sm mb-10">
We&apos;ll shape your experience around what feels right to you.
</p>
<div className="grid grid-cols-2 gap-3">
              {comfortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleComfortSelect(option.id)}
                  className={`bg-white/5 hover:bg-white/10 border rounded-2xl p-5 text-left transition-all duration-200 ${
                    comfort === option.id
                      ? "border-[#7ec99a] bg-[#7ec99a]/10"   // Selected → green border
                      : "border-white/10 hover:border-[#7ec99a]/40"
                  }`}
                >
                  <span className="text-3xl block mb-3">{option.icon}</span>
                  <p className="text-white font-medium text-sm">{option.label}</p>
                  <p className="text-white/40 text-xs mt-1">{option.description}</p>
                </button>
              ))}
            </div>
  </motion.div>
)}

                          {/*Language*/}
{step === "language" && (
  <motion.div 
  key="language"
  initial={{opacity:0, y:24}}
  animate={{opacity:1, y:0}}
  exit={{opacity:0, y:-24}}
  transition={{duration:0.4}}
  className="w-full max-w-md text-center"
  >
    <p className="text-[#7ec99a] text-sm tracking-widest uppercase mb-3">Language</p>
    <h1 className="text-white text-3xl font-semibold mb-3 leading-snug">
  Which language feels like home?
</h1>
<p className="text-white/40 text-sm mb-10">
You can always switch later.</p>

<div className="flex flex-col gap-3 mb-8">
  {languages.map((lang) => (
    <button 
    key={lang.id}
    onClick={() => setLanguage(lang.id)}
     className={`w-full rounded-2xl px-5 py-4 text-left border transition-all duration-200 ${
                    language === lang.id
                      ? "border-[#7ec99a] bg-[#7ec99a]/10 text-white"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                >
                  {lang.label}
                  </button>
  ))}
</div>

<button 
onClick={handleFinish}
className="w-full bg-[#7ec99a] hover:bg-[#6ab885] text-[#0f1a14] font-semibold rounded-2x1 py-4 transition-all duration-200">
  Enter your Sanctuary ➡️ 
</button>
  </motion.div>
)}
      </AnimatePresence>
</div>
  );
} 


