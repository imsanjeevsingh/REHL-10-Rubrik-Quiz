
import React, { useState, useEffect } from 'react';
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

  // Simulated System Stats
  const [cpuLoad, setCpuLoad] = useState(12);
  const [memUsage, setMemUsage] = useState(4.2);

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
    }, 15);
    return () => clearInterval(interval);
  }, [question.id]);

  useEffect(() => {
    const statInterval = setInterval(() => {
      setCpuLoad(prev => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
      setMemUsage(prev => Math.max(2, Math.min(16, prev + (Math.random() * 0.4 - 0.2))));
    }, 3000);
    return () => clearInterval(statInterval);
  }, []);

  const difficultyColors = {
    [Difficulty.EASY]: 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20',
    [Difficulty.MEDIUM]: 'text-amber-400 border-amber-900/30 bg-amber-950/20',
    [Difficulty.HARD]: 'text-rose-400 border-rose-900/30 bg-rose-950/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in zoom-in duration-700">
      {/* Sidebar Telemetry */}
      <div className="w-full lg:w-72 space-y-4 hidden lg:block">
        <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6 shadow-2xl">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Environment Monitor</div>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">CPU Load <span className={cpuLoad > 80 ? 'text-red-500' : 'text-emerald-400'}>{cpuLoad.toFixed(1)}%</span></div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${cpuLoad > 80 ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${cpuLoad}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">Kernel RAM <span className="text-blue-400">{memUsage.toFixed(2)} GB</span></div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${(memUsage / 16) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="flex items-center space-x-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Instance: vepsun-rhel10-01</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 w-full bg-[#020617] rounded-[3rem] shadow-[0_80px_180px_rgba(0,0,0,0.5)] border border-slate-800/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        <div className="bg-[#1e293b]/30 px-10 py-5 border-b border-slate-800 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="flex space-x-1.5">
               <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">tty1 — {question.module}</span>
           </div>
           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${difficultyColors[question.difficulty]}`}>
             Level: {question.difficulty}
           </span>
        </div>

        <div className="p-10 md:p-14 space-y-10">
          {/* Terminal Output */}
          <div className="font-mono text-lg leading-relaxed min-h-[250px] relative">
            <div className="flex items-center text-slate-500 mb-6">
               <span className="text-emerald-500 mr-2">[root@vepsun-lab ~]#</span>
               <span className="text-slate-400">cat /var/log/scenarios/latest.log</span>
            </div>
            
            <div className="text-slate-100 whitespace-pre-wrap">
              {displayedText}
              {isTyping && <span className="inline-block w-2.5 h-6 bg-emerald-500 ml-1 animate-pulse align-middle"></span>}
            </div>

            {selectedAnswer !== undefined && !isTyping && (
              <div className="mt-10 pt-10 border-t border-slate-800/50 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center text-emerald-500 mb-4">
                  <span className="mr-2"># exec --choice {String.fromCharCode(65 + selectedAnswer)}</span>
                  <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-black ml-4 animate-pulse">Running Simulation...</span>
                </div>
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 text-emerald-400/80 italic text-base">
                  {question.optionSimulations[selectedAnswer]}
                </div>
              </div>
            )}
          </div>

          {/* Interaction Zone */}
          <div className="pt-10 border-t border-slate-800/50">
            <h2 className="text-2xl font-black text-white mb-10 tracking-tight uppercase italic border-l-4 border-[#f36523] pl-6">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onSelectAnswer(index)}
                  className={`group relative text-left p-6 rounded-2xl border transition-all overflow-hidden ${
                    selectedAnswer === index
                      ? 'border-[#0083ca] bg-[#0083ca]/10 text-white shadow-[0_0_30px_rgba(0,131,202,0.2)]'
                      : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity ${selectedAnswer === index ? 'opacity-100' : ''}`}>
                    <svg className="w-5 h-5 text-[#0083ca]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 mr-5 transition-all ${
                      selectedAnswer === index ? 'bg-[#0083ca] border-[#0083ca] text-white' : 'border-slate-800 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-bold text-sm tracking-tight leading-snug">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-800/50">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center transition-all px-8 py-4 rounded-xl ${
                isFirst ? 'text-slate-700 opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              Roll Back
            </button>
            <button
              onClick={onNext}
              disabled={selectedAnswer === undefined}
              className={`w-full sm:w-auto px-16 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl flex items-center justify-center border-b-4 border-orange-950 ${
                selectedAnswer === undefined
                  ? 'bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-[#f36523] text-white hover:bg-[#e25412] hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isLast ? 'Complete Assessment' : 'Commit Configuration'}
              <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
