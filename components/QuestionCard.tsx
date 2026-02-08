
import React, { useState, useEffect, useRef } from 'react';
import { Question, Difficulty } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | undefined;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(question.scenario.substring(0, i));
      i++;
      if (i > question.scenario.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
    return () => clearInterval(interval);
  }, [question.id]);

  const handleChoice = (index: number) => {
    setIsSimulating(true);
    onSelectAnswer(index);
    // Simulate some "computation" lag
    setTimeout(() => setIsSimulating(false), 800);
  };

  const difficultyMeta = {
    [Difficulty.EASY]: { label: 'JNR-ADMIN', color: 'text-emerald-400', border: 'border-emerald-500/20' },
    [Difficulty.MEDIUM]: { label: 'INT-ADMIN', color: 'text-amber-400', border: 'border-amber-500/20' },
    [Difficulty.HARD]: { label: 'SNR-ARCH', color: 'text-rose-500', border: 'border-rose-500/20' },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Telemetry Pane */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="glass rounded-[2rem] p-8 border-l-4 border-l-[#0083ca]">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
            Node Telemetry
          </h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">Load Average <span className="text-emerald-400 font-mono">0.12 0.08 0.05</span></div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[12%] animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">Core Partition <span className="text-blue-400 font-mono">/dev/mapper/rhel-root</span></div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[64%]"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-600 uppercase">
                <span>SELinux Mode</span>
                <span className="text-emerald-500/80">Enforcing</span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-black text-slate-600 uppercase">
                <span>Kernel Ver</span>
                <span className="text-slate-400">6.11.0-rhel10</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-[2rem] p-8 border-l-4 border-l-[#f36523]">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Instance Log</h3>
          <div className="font-mono text-[9px] text-slate-500 space-y-2 leading-relaxed">
            <p className="flex items-start"><span className="text-emerald-500/50 mr-2">[OK]</span> systemd-journald initialized</p>
            <p className="flex items-start"><span className="text-blue-500/50 mr-2">[INFO]</span> mounting /sysroot...</p>
            <p className="flex items-start"><span className="text-amber-500/50 mr-2">[WARN]</span> local clock mismatch corrected</p>
            <p className="flex items-start text-emerald-500/80"><span className="mr-2">&gt;</span> SESSION STARTED {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Primary Console */}
      <div className="flex-1 flex flex-col glass rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-black/40 px-10 py-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">root@vepsun-lab:/var/log/scenarios</span>
          </div>
          <div className={`px-4 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${difficultyMeta[question.difficulty].color} ${difficultyMeta[question.difficulty].border}`}>
            {difficultyMeta[question.difficulty].label}
          </div>
        </div>

        {/* Scrollable Output Area */}
        <div 
          ref={terminalRef}
          className="flex-1 p-10 md:p-14 font-mono text-lg text-slate-300 leading-relaxed min-h-[400px] overflow-y-auto"
        >
          <div className="flex items-center text-emerald-500/50 mb-6 text-sm">
            <span className="mr-3"># access --module "{question.module.split(':')[0]}"</span>
            <span className="animate-pulse">_</span>
          </div>
          
          <div className="whitespace-pre-wrap">
            {displayedText}
            {isTyping && <span className="inline-block w-2.5 h-6 bg-emerald-500 ml-1 animate-pulse align-middle"></span>}
          </div>

          {selectedAnswer !== undefined && !isTyping && (
            <div className="mt-12 pt-12 border-t border-white/5 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center text-blue-400 mb-6 text-sm">
                <span className="mr-3"># exec_sim --choice {String.fromCharCode(65 + selectedAnswer)}</span>
                {isSimulating && <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded uppercase font-black animate-pulse">Computing...</span>}
              </div>
              <div className={`bg-black/50 p-8 rounded-2xl border border-white/5 font-mono text-base italic ${isSimulating ? 'opacity-30' : 'text-emerald-400/80 animate-in fade-in duration-500'}`}>
                {isSimulating ? 'Processing logic through RHEL 10 kernel...' : `[OUTPUT] ${question.optionSimulations[selectedAnswer]}`}
              </div>
            </div>
          )}
        </div>

        {/* Input Zone */}
        <div className="p-10 md:p-14 bg-black/20 border-t border-white/5">
          <h2 className="text-xl font-bold text-white mb-10 border-l-4 border-[#f36523] pl-6 uppercase tracking-tight italic">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                disabled={isTyping}
                className={`group relative text-left p-6 rounded-2xl border transition-all ${
                  selectedAnswer === index
                    ? 'border-[#0083ca] bg-[#0083ca]/10 text-white shadow-[0_0_40px_rgba(0,131,202,0.15)] scale-[1.02]'
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20 hover:bg-white/10 hover:text-slate-300'
                } ${isTyping ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 mr-5 transition-all ${
                    selectedAnswer === index ? 'bg-[#0083ca] border-[#0083ca] text-white' : 'border-slate-800 text-slate-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-bold text-sm leading-snug">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-10 border-t border-white/5">
            <button
              onClick={onPrevious}
              disabled={isFirst || isTyping}
              className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center px-8 py-4 rounded-xl transition-all ${
                isFirst || isTyping ? 'text-slate-800 opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              Previous State
            </button>
            <button
              onClick={onNext}
              disabled={selectedAnswer === undefined || isSimulating || isTyping}
              className={`w-full sm:w-auto px-16 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.6em] transition-all shadow-2xl flex items-center justify-center ${
                selectedAnswer === undefined || isSimulating || isTyping
                  ? 'bg-slate-800 text-slate-600 border-b-4 border-black cursor-not-allowed'
                  : 'bg-[#f36523] text-white hover:bg-[#e25412] hover:-translate-y-1 active:scale-95 border-b-4 border-orange-950'
              }`}
            >
              {isLast ? 'Terminate & Report' : 'Commit Choice'}
              <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
