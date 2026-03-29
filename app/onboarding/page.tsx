"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";

//Gentle Onboarding - What brings you comfort?
const comfortOptions =[
  {id: "spiritual", label: "Spiritual Thoughts", icon:"☯️", description:"Guided by faith and reflection"},
  {id: "nature", label: "Nature & Calm" , icon:"🌿", description:"Grounded in the natural world" },
  {id: "practical", label: "Practical Advice" , icon:"💡", description:"Clear steps and solution" },
  {id: "community", label: " Just Someone to Talk To", icon:"🤝", description:"Human Connection above all"},
]; 

//Language Selection
const languages = [ 
  {id: "en", label:"English", native:"EN", greeting: "\"Welcome - you are safe here.\""},
  {id: "hi", label:"Hindi", native:"हिं", greeting: "\"आपका स्वागत है — आप यहाँ सुरक्षित हैं\""},
  {id: "ne", label:"Nepali", native: "ने",  greeting: "\"तपाईंलाई स्वागत छ — तपाईं यहाँ सुरक्षित हुनुहुन्छ\"" },
  {id: "es", label:"Spanish", native: "ES",  greeting: "\"Bienvenido — estás seguro aquí.\""},
]; 

//Types
type Mode = "anonymous" | "save" | null;
type Step = "mode" | "comfort" | "language" | "done";

//Animation
const slide = {
  hidden: {opacity: 0 ,y :28},
  show: {opacity:1, y:0, transition: { duration: 0.45, ease: "easeOut" as const}},
  exit: {opacity:0 , y:-28, transition: {duration:0.3, ease:"easeIn" as const}},
};

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

  const steps: Step[] = ["mode", "comfort", "language"];
  const currentIndex = steps.indexOf(step); 

  const handleModeSelect = (Selected: Mode) => {
    setMode(Selected);
    setTimeout(() => setStep("comfort"),300);
  }; 

  const handleComfortSelect = (id: string) => {
    setComfort(id);
    setTimeout(() => setStep("language"),300);
  }; 

  const handleFinish = () => {
    // Save preferences to localStorage so the home page can read them
    localStorage.setItem("sanctuary_comfort", comfort || "practical");
    localStorage.setItem("sanctuary_language", language);
    localStorage.setItem("sanctuary_mode", mode || "anonymous");
    
    router.push("/dashboard");
  };
//Styling 
const shellStyle: React.CSSProperties = { 
  minHeight: "100vh",
  backgroundColor: "#1a1f2e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 20px",
  position: "relative",
  overflow: "hidden",
}; 

const cardStyle: React.CSSProperties ={
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  border: "1.5px solid #C6A868",
  padding: "36px 32px",
  width: "100%",
  maxWidth: "440px",
  position: "relative",
  zIndex: 2,
};


  return (
    <div style={shellStyle}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", zIndex: 2 }}>
        {steps.map((s, i) => (
          <div
            key={s}
            style={{
              height: "3px",
              borderRadius: "2px",
              transition: "all 0.5s ease",
              backgroundColor: i === currentIndex
                ? "#C6A868"                          // Current step → gold
                : i < currentIndex
                ? "rgba(198,168,104,0.5)"            // Done step → dim gold
                : "rgba(255,255,255,0.15)",          // Future step → barely visible
              width: i === currentIndex ? "28px" : "14px",
            }}
          />
        ))}
      </div>
 
      <div style={cardStyle}>
        <AnimatePresence mode="wait">
 
          // Step1: Choose Anonymous or Save Progress
          {step === "mode" && (
            <motion.div key="mode" variants={slide} initial="hidden" animate="show" exit="exit">
 
              {/* Small gold tag */}
              <p style={{ color: "#C6A868", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "10px" }}>
                Your space, your rules
              </p>
 
              <h1 style={{ fontSize: "22px", fontWeight: "normal", color: "#1a1a1a", lineHeight: 1.35, marginBottom: "8px" }}>
                How would you like to use this space?
              </h1>
 
              <p style={{ color: "#9a8a6a", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "24px" }}>
                No judgment. No pressure. What you share here stays here.
              </p>
 
              {/* Anonymous option */}
              <button
                onClick={() => handleModeSelect("anonymous")}
                style={{
                  width: "100%", background: "#F8F7F4", border: "1.5px solid #e0d5c0",
                  borderRadius: "12px", padding: "14px 16px", display: "flex",
                  alignItems: "center", gap: "14px", marginBottom: "10px", cursor: "pointer",
                  transition: "all 0.2s", textAlign: "left",
                }}
              >
                {/* Circle icon */}
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#252525", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "16px" }}>^_^</span>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, color: "#1a1a1a", marginBottom: "3px" }}>Stay Anonymous</p>
                  <p style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#aaa", lineHeight: 1.4 }}>Nothing saved. Fresh start every time.</p>
                </div>
              </button>
 
              {/* Save progress option */}
              <button
                onClick={() => handleModeSelect("save")}
                style={{
                  width: "100%", background: "#F8F7F4", border: "1.5px solid #e0d5c0",
                  borderRadius: "12px", padding: "14px 16px", display: "flex",
                  alignItems: "center", gap: "14px", marginBottom: "18px", cursor: "pointer",
                  transition: "all 0.2s", textAlign: "left",
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#C6A868", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "16px" }}>^_^</span>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, color: "#1a1a1a", marginBottom: "3px" }}>Save My Progress</p>
                  <p style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#aaa", lineHeight: 1.4 }}>Remember my journey and preferences.</p>
                </div>
              </button>
 
              {/* Privacy note — this is the "minor detail" that builds trust */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                background: "#fffdf7", border: "1px solid #e8d9b0",
                borderRadius: "10px", padding: "12px 14px",
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>🔒</span>
                <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#7a6a4a", lineHeight: 1.6 }}>
                  If you choose anonymous, we collect <strong>zero data</strong>. You are invisible here —
                  and that is a right, not a feature.
                </p>
              </div>
 
            </motion.div>
          )}
 
          {step === "comfort" && (
            <motion.div key="comfort" variants={slide} initial="hidden" animate="show" exit="exit">
 
              <p style={{ color: "#C6A868", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "10px" }}>
                Shape your sanctuary
              </p>
 
              <h1 style={{ fontSize: "22px", fontWeight: "normal", color: "#1a1a1a", lineHeight: 1.35, marginBottom: "8px" }}>
                What brings you comfort?
              </h1>
 
              <p style={{ color: "#9a8a6a", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "22px" }}>
                We'll wrap the whole experience around what feels right for you.
              </p>
 
              {/* 2x2 grid of comfort cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {comfortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleComfortSelect(option.id)}
                    style={{
                      background: comfort === option.id ? "#fffdf5" : "#F8F7F4",
                      // Gold border when selected, subtle border when not
                      border: comfort === option.id ? "2px solid #C6A868" : "1.5px solid #e8d5b0",
                      borderRadius: "14px",
                      padding: "16px 14px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Icon in a small rounded box */}
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "#fff", border: "1px solid #e8d5b0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "10px", fontSize: "18px",
                    }}>
                      {option.icon}
                    </div>
                    <p style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: 700, color: "#2a1f0e", marginBottom: "4px" }}>
                      {option.label}
                    </p>
                    <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#9a8a6a", lineHeight: 1.4 }}>
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
 
            </motion.div>
          )}
 
         //Choose your language 
          {step === "language" && (
            <motion.div key="language" variants={slide} initial="hidden" animate="show" exit="exit">
 
              <p style={{ color: "#C6A868", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "10px" }}>
                Almost there
              </p>
 
              <h1 style={{ fontSize: "22px", fontWeight: "normal", color: "#1a1a1a", lineHeight: 1.35, marginBottom: "8px" }}>
                Which language feels like home?
              </h1>
 
              <p style={{ color: "#9a8a6a", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "20px" }}>
                We'll greet you in your language from here on.
              </p>
 
              {/* Language buttons — each shows native script and greeting */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    style={{
                      width: "100%",
                      background: language === lang.id ? "#fffdf5" : "#F8F7F4",
                      border: language === lang.id ? "2px solid #C6A868" : "1.5px solid #e0d5c0",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "13px", fontFamily: "sans-serif", fontWeight: 600, color: "#2a1f0e", marginBottom: "3px" }}>
                        {lang.label}
                      </p>
                      {/* The greeting — this is the emotional hook */}
                      <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#9a8a6a", fontStyle: "italic" }}>
                        {lang.greeting}
                      </p>
                    </div>
                    {/* Native script label on the right */}
                    <span style={{ fontSize: "14px", color: language === lang.id ? "#C6A868" : "#ccc", fontFamily: "sans-serif", marginLeft: "12px", flexShrink: 0 }}>
                      {lang.native}
                    </span>
                  </button>
                ))}
              </div>
 
              {/* Final CTA — dark button with gold text */}
              <button
                onClick={handleFinish}
                style={{
                  width: "100%",
                  background: "#252525",
                  color: "#C6A868",
                  border: "none",
                  borderRadius: "12px",
                  padding: "15px",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Enter Your Sanctuary →
              </button>
 
            </motion.div>
          )}
 
        </AnimatePresence>
      </div>
    </div>
  );
}

