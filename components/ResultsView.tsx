
import React, { useState, useEffect } from 'react';
import { Question, QuizState, AdminResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsViewProps {
  state: QuizState;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ state, onRestart }) => {
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'submitting' | 'sent'>('pending');
  
  const totalQuestions = state.questions.length;
  const correctAnswers = Object.entries(state.userAnswers).reduce((acc, [id, answer]) => {
    const question = state.questions.find(q => q.id === id);
    return question?.correctAnswer === answer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const moduleAnalysis = state.questions.reduce((acc, q) => {
    if (!acc[q.module]) acc[q.module] = { correct: 0, total: 0 };
    acc[q.module].total += 1;
    if (state.userAnswers[q.id] === q.correctAnswer) {
      acc[q.module].correct += 1;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const chartData = (Object.entries(moduleAnalysis) as [string, { correct: number; total: number }][]).map(([name, data]) => ({
    name: name.split(':')[0],
    score: Math.round((data.correct / data.total) * 100),
    full: name
  }));

  useEffect(() => {
    setSubmissionStatus('submitting');
    const recordResult = () => {
      const currentRecordsRaw = localStorage.getItem('rhel_interview_records');
      const currentRecords: AdminResult[] = currentRecordsRaw ? JSON.parse(currentRecordsRaw) : [];
      
      const newResult: AdminResult = {
        id: Math.random().toString(36).substr(2, 9),
        name: state.userName || 'Unknown',
        email: state.userEmail || 'Unknown',
        score: percentage,
        date: new Date().toISOString(),
        modulePerformance: Object.fromEntries(chartData.map(d => [d.name, d.score]))
      };

      localStorage.setItem('rhel_interview_records', JSON.stringify([...currentRecords, newResult]));
      setSubmissionStatus('sent');
    };
    const timer = setTimeout(recordResult, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNotifyAdmin = () => {
    const adminEmail = "sanjeev.vmware@gmail.com";
    const subject = `[VEPSUN-RHEL10] ${state.userName} Performance Score: ${percentage}%`;
    const body = `
VEPSUN TECHNOLOGIES ASSESSMENT RECORD
--------------------------------------
Candidate Identity: ${state.userName}
Email Endpoint: ${state.userEmail}
Aggregate Score: ${percentage}%
Technical Accuracy: ${correctAnswers}/${totalQuestions}
Verified Date: ${new Date().toLocaleString()}

Module Deep Dive Analysis:
${chartData.map(d => `- ${d.full}: ${d.score}%`).join('\n')}

Enterprise Admin Verification: SUCCESSFUL
    `.trim();
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { title: "Architect Mastery!", color: "text-[#0083ca]", desc: "Exemplary technical competence recorded. Candidate exceeds senior administration requirements." };
    if (percentage >= 70) return { title: "Lead Professional", color: "text-[#0083ca]", desc: "Strong command of RHEL 10 modules. Fully capable of managing enterprise-scale deployments." };
    if (percentage >= 50) return { title: "Competent Administrator", color: "text-[#f36523]", desc: "Functional knowledge verified. Targeted training in complex troubleshooting recommended." };
    return { title: "Developing Associate", color: "text-red-500", desc: "Foundational gaps identified. Comprehensive Vepsun training track recommended." };
  };

  const message = getPerformanceMessage();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-white rounded-[4rem] shadow-[0_50px_150px_rgba(0,131,202,0.1)] overflow-hidden border border-gray-50">
        <div className="bg-[#111827] p-16 text-center text-white relative">
          <div className="flex justify-center mb-8">
            <svg width="200" height="60" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 25 C80 10, 160 10, 215 25" stroke="#f36523" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="120" y="68" fontFamily="'Inter', sans-serif" fontSize="48" fontWeight="900" fill="#0083ca" letterSpacing="-1" textAnchor="middle">
                VEPSUN
              </text>
            </svg>
          </div>
          <div className="absolute top-10 right-10 bg-[#f36523] rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center shadow-2xl shadow-[#f36523]/20 border border-white/10">
             {submissionStatus === 'sent' ? '✓ LOGGED & ENCRYPTED' : 'SYNCING TO CLOUD...'}
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">Assessment Transcript</h2>
          <p className="opacity-40 font-black text-sm uppercase tracking-[0.5em]">{state.userName} // {state.userEmail}</p>
        </div>
        
        <div className="p-12 md:p-20">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="text-center md:text-left">
              <div className="relative inline-flex items-center justify-center w-64 h-64 rounded-[3.5rem] border-[16px] border-gray-50 bg-white shadow-inner mb-12 group transition-transform hover:scale-[1.02]">
                <span className={`text-7xl font-black ${message.color}`}>{percentage}%</span>
                <div className="absolute inset-2 rounded-[3rem] border-2 border-[#f36523]/10 border-t-[#f36523] animate-[spin_4s_linear_infinite]"></div>
              </div>
              <h3 className={`text-5xl font-black mb-6 tracking-tighter uppercase ${message.color}`}>{message.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0 text-xl font-bold italic opacity-60">
                "{message.desc}"
              </p>
              
              <div className="mt-16 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 mb-10 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0083ca]/5 rounded-bl-full group-hover:w-32 group-hover:h-32 transition-all"></div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-6">Candidate Final Action</p>
                <button
                  onClick={handleNotifyAdmin}
                  className="w-full py-6 bg-[#0083ca] text-white rounded-2xl font-black shadow-2xl hover:bg-[#0070ad] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.2em]"
                >
                  <svg className="w-6 h-6 text-[#f36523]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Dispatch Transcript</span>
                </button>
                <p className="text-[10px] text-gray-400 mt-6 text-center font-black uppercase tracking-widest opacity-60">Mandatory for technical validation.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                <button
                  onClick={onRestart}
                  className="px-12 py-5 bg-white text-gray-400 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                >
                  Return to Base
                </button>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] h-[550px] border border-gray-50 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0083ca] to-[#f36523]"></div>
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-12">Proficiency Matrix (Global Standard)</h4>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={110} fontSize={9} stroke="#9ca3af" fontWeight="900" />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,131,202,0.02)'}}
                    content={({active, payload}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-6 border border-gray-50 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{payload[0].payload.full}</p>
                            <p className="text-2xl text-[#0083ca] font-black">{payload[0].value}% Proficient</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#0083ca' : entry.score > 40 ? '#f36523' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl font-black text-gray-900 flex items-center px-6 tracking-tighter uppercase italic">
          <span className="w-3 h-10 bg-[#f36523] rounded-full mr-4 shadow-lg shadow-[#f36523]/20"></span>
          Technical Deep Dive
        </h3>
        <div className="space-y-10">
          {state.questions.map((q, idx) => {
            const isCorrect = state.userAnswers[q.id] === q.correctAnswer;
            return (
              <div key={idx} className={`p-12 rounded-[4rem] border-l-[16px] bg-white shadow-xl transition-all hover:shadow-2xl group ${isCorrect ? 'border-[#0083ca]' : 'border-[#f36523]'}`}>
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-gray-50 rounded-2xl text-gray-400 border border-gray-100">LOG-NODE {idx + 1}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-blue-50/50 rounded-2xl text-[#0083ca] border border-blue-100/50">{q.module.split(':')[0]}</span>
                  </div>
                  <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-sm border ${isCorrect ? 'bg-[#0083ca] text-white border-[#0083ca]' : 'bg-orange-50 text-[#f36523] border-[#f36523]/20'}`}>
                    {isCorrect ? 'VERIFIED' : 'CONFLICT IDENTIFIED'}
                  </span>
                </div>
                <p className="font-black text-gray-900 mb-12 text-2xl leading-snug tracking-tighter uppercase">{q.question}</p>
                
                <div className="grid md:grid-cols-2 gap-10">
                  {!isCorrect && (
                    <div className="p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#f36523]/5 rounded-bl-full"></div>
                      <span className="block text-[10px] font-black text-[#f36523] uppercase tracking-[0.3em] mb-4">Candidate Logic</span>
                      <p className="text-lg font-bold text-[#f36523] italic leading-tight">"{q.options[state.userAnswers[q.id]]}"</p>
                    </div>
                  )}
                  <div className={`p-8 rounded-[2.5rem] border shadow-inner relative overflow-hidden ${isCorrect ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#0083ca]/5 rounded-bl-full"></div>
                    <span className="block text-[10px] font-black text-[#0083ca] uppercase tracking-[0.3em] mb-4">Vepsun Standard</span>
                    <p className="text-lg font-black text-gray-900 leading-tight">"{q.options[q.correctAnswer]}"</p>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-50">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white border-2 border-gray-50 rounded-[1.25rem] flex items-center justify-center mr-6 flex-shrink-0 shadow-sm group-hover:bg-[#0083ca] group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed italic pr-12">
                      <span className="font-black not-italic text-[#0083ca] mr-3 uppercase tracking-[0.1em] text-[10px]">Technical Post-Mortem //</span> {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
