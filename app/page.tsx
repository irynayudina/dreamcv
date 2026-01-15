"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, FileText, ArrowDown, LogIn, Award, Handshake, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [skillsMethod, setSkillsMethod] = useState<"test" | "trust" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [shakeSection, setShakeSection] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState<number | null>(null);

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const router = useRouter();

  const scrollToSection = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(index);
  };

  const getFirstUnfilledSection = () => {
    if (!cvFile) return 0;
    if (!skillsMethod) return 1;
    if (!selectedTemplate) return 2;
    return -1;
  };

  const handleEnterClick = () => {
    const firstUnfilled = getFirstUnfilledSection();
    if (firstUnfilled !== -1) {
      setShakeSection(firstUnfilled);
      setShowPrompt(firstUnfilled);
      scrollToSection(firstUnfilled);
      setTimeout(() => {
        setShakeSection(null);
      }, 500);
      setTimeout(() => {
        setShowPrompt(null);
      }, 3000);
    } else {
      // All sections filled, go to login
      router.push("/login");
    }
  };

  // Auto-scroll logic when a section is completed
  useEffect(() => {
    if (cvFile && activeSection === 0) {
      const timer = setTimeout(() => scrollToSection(1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cvFile]);

  useEffect(() => {
    if (skillsMethod && activeSection === 1) {
      const timer = setTimeout(() => scrollToSection(2), 1000);
      return () => clearTimeout(timer);
    }
  }, [skillsMethod]);

  useEffect(() => {
    if (selectedTemplate && activeSection === 2) {
      const timer = setTimeout(() => scrollToSection(3), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate]);

  // Track active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.findIndex(ref => ref.current === entry.target);
          if (index !== -1) setActiveSection(index);
        }
      });
    }, observerOptions);

    sectionRefs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-[#f8fafc] text-[#0f172a] scroll-smooth selection:bg-blue-100">
      {/* Fixed Title */}
      <div className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-center">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl px-8 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20"
        >
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dream cv
          </h1>
        </motion.div>
      </div>

      {/* Section 1: Upload CV */}
      <section 
        ref={sectionRefs[0]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <motion.div 
          animate={shakeSection === 0 ? shakeAnimation : (showPrompt === 0 ? pulseAnimation : {})}
          className={`max-w-2xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border transition-colors duration-500 flex flex-col items-center text-center gap-10
            ${showPrompt === 0 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="relative">
            <div className="p-8 bg-blue-50 rounded-3xl">
              <Upload className="w-16 h-16 text-blue-600" />
            </div>
            {showPrompt === 0 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight">Upload ur CV</h2>
            <p className="text-slate-500 text-lg max-w-sm">We'll parse your existing data to get you started on your new journey.</p>
          </div>
          
          <label className="w-full group cursor-pointer">
            <div className={`
              w-full p-10 rounded-3xl border-3 border-dashed transition-all duration-300 flex flex-col items-center gap-4
              ${cvFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 group-hover:border-blue-400 bg-slate-50/50 group-hover:bg-blue-50/30'}
            `}>
              {cvFile ? (
                <>
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="text-emerald-900 font-bold text-lg">{cvFile.name}</span>
                  <span className="text-emerald-600 text-sm">File uploaded successfully!</span>
                </>
              ) : (
                <>
                  <div className="p-3 bg-slate-100 group-hover:bg-blue-100 transition-colors rounded-full text-slate-400 group-hover:text-blue-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className="text-slate-600 font-bold text-lg">Drop your file here or click to browse</span>
                  <span className="text-slate-400 text-sm italic">Supports PDF, DOC, DOCX</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </label>
        </motion.div>
      </section>

      {/* Section 2: Verify Skills */}
      <section 
        ref={sectionRefs[1]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <motion.div 
          animate={shakeSection === 1 ? shakeAnimation : (showPrompt === 1 ? pulseAnimation : {})}
          className={`max-w-4xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border transition-colors duration-500 flex flex-col items-center text-center gap-12
            ${showPrompt === 1 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight">Verify your skills</h2>
            <p className="text-slate-500 text-lg">Choose how you want to showcase your expertise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <button
              onClick={() => setSkillsMethod("test")}
              className={`
                group p-10 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 relative
                ${skillsMethod === "test" ? 'border-blue-500 bg-blue-50/50 shadow-inner' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-lg'}
              `}
            >
              <div className={`p-4 rounded-2xl w-fit transition-colors ${skillsMethod === "test" ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Take the test</h3>
                <p className="text-slate-500 leading-relaxed">Verify your skills through our interactive and gamified assessments.</p>
              </div>
              {skillsMethod === "test" && (
                <CheckCircle className="absolute top-6 right-6 w-8 h-8 text-blue-600" />
              )}
            </button>

            <button
              onClick={() => setSkillsMethod("trust")}
              className={`
                group p-10 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 relative
                ${skillsMethod === "trust" ? 'border-indigo-500 bg-indigo-50/50 shadow-inner' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50 hover:shadow-lg'}
              `}
            >
              <div className={`p-4 rounded-2xl w-fit transition-colors ${skillsMethod === "trust" ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                <Handshake className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Trust my word</h3>
                <p className="text-slate-500 leading-relaxed">Self-declare your skills now and provide verification when requested later.</p>
              </div>
              {skillsMethod === "trust" && (
                <CheckCircle className="absolute top-6 right-6 w-8 h-8 text-indigo-600" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Choose Template */}
      <section 
        ref={sectionRefs[2]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <motion.div 
          animate={shakeSection === 2 ? shakeAnimation : (showPrompt === 2 ? pulseAnimation : {})}
          className={`max-w-5xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border transition-colors duration-500 flex flex-col items-center text-center gap-12
            ${showPrompt === 2 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight">Choose any template</h2>
            <p className="text-slate-500 text-lg">Select a layout for your future CV building, where ur cv will be parsed into.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {["Modern", "Classic", "Creative", "Minimal"].map((template) => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template)}
                className={`
                  group aspect-[3/4.2] rounded-3xl border-2 transition-all flex flex-col p-6 gap-4 relative overflow-hidden
                  ${selectedTemplate === template ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-100 shadow-xl' : 'border-slate-100 hover:border-slate-300 hover:shadow-xl hover:scale-[1.02] bg-slate-50/30'}
                `}
              >
                <div className={`flex-1 rounded-xl shadow-inner transition-colors ${selectedTemplate === template ? 'bg-blue-100/50' : 'bg-slate-200 group-hover:bg-slate-300/50'}`} />
                <span className={`font-bold text-lg ${selectedTemplate === template ? 'text-blue-700' : 'text-slate-700'}`}>{template}</span>
                
                {selectedTemplate === template && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 4: Enter */}
      <section 
        ref={sectionRefs[3]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <div className="flex flex-col items-center gap-14 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="space-y-6"
          >
            <h2 className="text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Enter the <br /> 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">future of CVs</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium">Your professional journey starts here.</p>
          </motion.div>

          <div className="relative group">
            <button
              onClick={handleEnterClick}
              className="relative z-10 flex items-center gap-4 px-16 py-8 bg-slate-900 text-white rounded-[2rem] text-3xl font-black transition-all hover:bg-slate-800 hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <span>Enter</span>
              <AnimatePresence mode="wait">
                {getFirstUnfilledSection() === -1 ? (
                  <motion.div key="login" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }}>
                    <LogIn className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <motion.div key="scroll" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}>
                    <ArrowDown className="w-10 h-10 animate-bounce" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            
            {/* Completion dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {[cvFile, skillsMethod, selectedTemplate].map((filled, i) => (
                <motion.div 
                  key={i}
                  animate={filled ? { scale: [1, 1.2, 1], backgroundColor: '#10b981' } : {}}
                  className={`w-3 h-3 rounded-full transition-colors duration-500 ${filled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Enter Button (Visible when not at bottom) */}
      <AnimatePresence>
        {activeSection < 3 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterClick}
            className="fixed bottom-12 right-12 z-50 flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-xl text-slate-900 rounded-2xl font-black shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-200/50 hover:bg-white transition-all group"
          >
            Enter
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side Progress Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-40">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className="group relative flex items-center"
          >
            <div className={`w-1.5 transition-all duration-500 rounded-full ${
              activeSection === i ? 'h-10 bg-blue-600' : 'h-4 bg-slate-300 group-hover:bg-slate-400'
            }`} />
            <span className={`absolute left-6 text-sm font-bold transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 ${
              activeSection === i ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {['Upload CV', 'Skills', 'Template', 'Finish'][i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
