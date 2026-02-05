
import React from 'react';
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
  const difficultyColors = {
    [Difficulty.EASY]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    [Difficulty.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-100',
    [Difficulty.HARD]: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,131,202,0.1)] border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="p-1.5 bg-gradient-to-r from-[#0083ca] via-[#f36523] to-[#0083ca]"></div>
      <div className="p-12 md:p-20">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-8 bg-[#f36523] rounded-full shadow-lg shadow-orange-500/20"></div>
            <span className="px-6 py-2.5 bg-gray-50 text-[#0083ca] text-[11px] font-black rounded-2xl uppercase tracking-[0.2em] border border-gray-100 shadow-sm">
              {question.module}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complexity</span>
            <span className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border shadow-sm ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        <div className="mb-14 group">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] flex items-center">
              <svg className="w-5 h-5 mr-3 text-[#f36523]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Cloud Terminal Instance
            </h3>
            <div className="flex space-x-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
            </div>
          </div>
          <div className="p-10 bg-[#0f172a] rounded-[3rem] font-mono text-base text-emerald-400 leading-relaxed whitespace-pre-wrap shadow-2xl border border-slate-800 relative group-hover:shadow-[#0083ca]/10 transition-all duration-500 overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#0083ca]/5 rounded-bl-full blur-3xl"></div>
             <div className="flex items-center text-slate-500 mb-4 select-none border-b border-slate-800 pb-3">
               <span className="text-[#0083ca] mr-2">➜</span>
               <span className="text-slate-400 font-black text-xs tracking-widest uppercase">vepsun-rhel10-lab</span>
               <span className="mx-3 opacity-20">|</span>
               <span className="text-slate-600 italic text-xs">root@assessment</span>
             </div>
            <span className="text-slate-500 block mb-4 select-none opacity-50">$ cat /opt/vepsun/current_scenario.md</span>
            <div className="pl-4 border-l-2 border-slate-800 py-2">
              {question.scenario}
            </div>
            <div className="mt-8 flex items-center text-emerald-400/30 animate-pulse">
               <span className="w-2 h-5 bg-emerald-400 mr-2"></span>
               <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Solution Input...</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-14 leading-tight tracking-tighter uppercase italic border-l-8 border-[#0083ca] pl-8">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 gap-6 mb-16">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`w-full text-left p-8 rounded-[2rem] border-2 transition-all flex items-center group relative overflow-hidden shadow-sm ${
                selectedAnswer === index
                  ? 'border-[#0083ca] bg-blue-50/30 text-[#0083ca] shadow-xl translate-x-2'
                  : 'border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white text-gray-600 hover:shadow-md'
              }`}
            >
              {selectedAnswer === index && (
                <div className="absolute right-8 opacity-10">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-8 text-lg font-black border-2 transition-all ${
                selectedAnswer === index
                  ? 'bg-[#0083ca] border-[#0083ca] text-white shadow-lg'
                  : 'bg-white border-gray-100 text-gray-200 group-hover:border-[#0083ca]/20'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 font-black text-xl tracking-tight leading-tight">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-14 border-t border-gray-100">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center ${
              isFirst ? 'text-gray-200 cursor-not-allowed opacity-50' : 'text-gray-400 hover:text-[#0083ca] hover:bg-blue-50 active:scale-95'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Roll Back
          </button>
          <button
            onClick={onNext}
            disabled={selectedAnswer === undefined}
            className={`px-20 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl flex items-center border-b-4 ${
              selectedAnswer === undefined
                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                : 'bg-[#f36523] text-white border-orange-800 hover:bg-[#e25412] hover:-translate-y-1.5 active:transform active:scale-95 shadow-[#f36523]/30'
            }`}
          >
            {isLast ? 'Execute Final Log' : 'Commit Logic'}
            <svg className="w-5 h-5 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
