"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, FileText, ArrowDown, LogIn, Award, Handshake, AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";
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
    useRef<HTMLDivElement>(null), // FAQ section
    useRef<HTMLDivElement>(null), // Footer/Enter section
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

  const templates = [
    { name: "Modern", desc: "Clean and contemporary, optimized for ATS and tech roles." },
    { name: "Executive", desc: "Timeless professional layout for leadership and traditional industries." },
    { name: "Creative", desc: "Bold and expressive design for marketing and creative professionals." },
    { name: "Minimal", desc: "Elegant simplicity that lets your achievements speak for themselves." }
  ];

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-slate-50 text-slate-900 scroll-smooth selection:bg-blue-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-sm border border-slate-200 pointer-events-auto flex flex-col items-center"
        >
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Dream CV
          </h1>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Build a Recruiter-Ready Future</p>
        </motion.div>
      </div>

      {/* Section 1: Upload CV */}
      <section 
        ref={sectionRefs[0]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6 pt-20"
      >
        <motion.div 
          animate={shakeSection === 0 ? shakeAnimation : (showPrompt === 0 ? pulseAnimation : {})}
          className={`max-w-2xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border transition-all duration-500 flex flex-col items-center text-center gap-10
            ${showPrompt === 0 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              Privacy Guaranteed
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Import Your Professional History</h2>
            <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">
              Securely upload your current CV. Our AI will parse your data into a structured format, keeping your information encrypted and private.
            </p>
          </div>
          
          <label className="w-full group cursor-pointer">
            <div className={`
              w-full p-10 rounded-3xl border-3 border-dashed transition-all duration-300 flex flex-col items-center gap-4
              ${cvFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 group-hover:border-blue-400 bg-slate-50/50 group-hover:bg-blue-50/30'}
            `}>
              {cvFile ? (
                <>
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                  <span className="text-emerald-900 font-bold text-lg">{cvFile.name}</span>
                  <span className="text-emerald-600 text-sm">Document processed successfully</span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  <span className="text-slate-600 font-bold text-lg">Select CV to Upload</span>
                  <span className="text-slate-400 text-sm">PDF, DOCX supported • Max 5MB</span>
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

      {/* Section 2: Skill Verification */}
      <section 
        ref={sectionRefs[1]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <motion.div 
          animate={shakeSection === 1 ? shakeAnimation : (showPrompt === 1 ? pulseAnimation : {})}
          className={`max-w-4xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border transition-all duration-500 flex flex-col items-center text-center gap-12
            ${showPrompt === 1 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight">Validate Your Expertise</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Boost your profile's credibility by choosing how you want to present your skills to potential recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <button
              onClick={() => setSkillsMethod("test")}
              className={`
                group p-10 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 relative
                ${skillsMethod === "test" ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50/50'}
              `}
            >
              <Award className={`w-12 h-12 ${skillsMethod === "test" ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Verified Assessments</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Complete short, skill-specific tests to earn verification badges. Proven skills increase recruiter engagement by up to 40%.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSkillsMethod("trust")}
              className={`
                group p-10 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 relative
                ${skillsMethod === "trust" ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
              `}
            >
              <Handshake className={`w-12 h-12 ${skillsMethod === "trust" ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Standard Declaration</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Self-declare your skills now. You can provide additional context, portfolios, or verification later during the interview phase.
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Template Choice */}
      <section 
        ref={sectionRefs[2]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <motion.div 
          animate={shakeSection === 2 ? shakeAnimation : (showPrompt === 2 ? pulseAnimation : {})}
          className={`max-w-5xl w-full p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border transition-all duration-500 flex flex-col items-center text-center gap-12
            ${showPrompt === 2 ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}
          `}
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight">Select a Recruiter-Ready Design</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Your data will be instantly formatted into your chosen layout. Switch designs at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => setSelectedTemplate(template.name)}
                className={`
                  group rounded-3xl border-2 transition-all flex flex-col p-6 gap-4 relative
                  ${selectedTemplate === template.name ? 'border-blue-500 bg-blue-50/30 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'}
                `}
              >
                <div className="aspect-[3/4] rounded-xl bg-slate-200 shadow-inner flex items-center justify-center text-slate-400">
                  <FileText className="w-12 h-12 opacity-20" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{template.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{template.desc}</p>
                </div>
                {selectedTemplate === template.name && (
                  <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 4: Trust & FAQ */}
      <section 
        ref={sectionRefs[3]}
        className="h-screen w-full flex flex-col items-center justify-center snap-start px-6"
      >
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Trust & Security</h2>
              <p className="text-slate-500 text-lg">We prioritize your data privacy as much as your career success.</p>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "AES-256 Encryption", text: "Your CV and personal data are encrypted at rest and in transit." },
                { icon: CheckCircle, title: "Verified Credentials", text: "Recruiters trust Dream CV for our rigorous assessment standards." },
                { icon: HelpCircle, title: "Human-Centric Design", text: "Built for jobseekers, by HR experts who understand the hiring process." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><item.icon className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <h3 className="text-2xl font-bold">Common Questions</h3>
            <div className="space-y-6">
              {[
                { q: "Is it really free?", a: "Dream CV offers a robust free tier for all essential features." },
                { q: "Can I download as PDF?", a: "Yes, all templates are optimized for high-quality PDF exports." },
                { q: "Is my data shared?", a: "We never sell your data. You control exactly who sees your CV." }
              ].map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-bold text-slate-800">Q: {faq.q}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA & Footer */}
      <section 
        ref={sectionRefs[4]}
        className="h-screen w-full flex flex-col items-center justify-between snap-start px-6 py-20"
      >
        <div /> {/* Spacer */}

        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
              Ready to land your <br /> 
              <span className="text-blue-600 italic">dream role?</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">Join thousands of professionals building recruiter-ready profiles today.</p>
          </div>

          <button
            onClick={handleEnterClick}
            className="group relative flex items-center gap-4 px-16 py-8 bg-slate-900 text-white rounded-[2rem] text-2xl font-black transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Launch Your Builder</span>
            {getFirstUnfilledSection() === -1 ? (
              <LogIn className="w-8 h-8" />
            ) : (
              <ArrowDown className="w-8 h-8 animate-bounce" />
            )}
          </button>
        </div>

        <footer className="w-full max-w-4xl border-t border-slate-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <div className="flex gap-8 font-bold">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
          </div>
          <p>© 2026 Dream CV. Empowering careers everywhere.</p>
        </footer>
      </section>

      {/* Floating Navigation (Desktop) */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-40">
        {['Upload', 'Verify', 'Template', 'FAQ', 'Finish'].map((label, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className="group flex items-center gap-4"
          >
            <div className={`w-2 transition-all duration-500 rounded-full ${
              activeSection === i ? 'h-10 bg-blue-600' : 'h-2 bg-slate-300 group-hover:bg-slate-400'
            }`} />
            <span className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeSection === i ? 'text-blue-600 translate-x-0' : 'text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Indicator */}
      <AnimatePresence>
        {activeSection < 4 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleEnterClick}
            className="fixed bottom-10 right-10 z-50 lg:hidden flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold shadow-lg border border-slate-200"
          >
            Next <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
