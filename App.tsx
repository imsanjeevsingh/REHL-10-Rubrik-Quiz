
import React, { useState } from 'react';
import Layout from './components/Layout';
import { QuizState } from './types';
import { generateQuiz } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import ResultsView from './components/ResultsView';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    status: 'idle',
    score: 0,
    startTime: null,
    endTime: null,
    userName: '',
    userEmail: '',
  });

  const [loadingMessage, setLoadingMessage] = useState('Initializing Vepsun Assessment Engine...');

  const goToRegistration = () => setState(prev => ({ ...prev, status: 'register' }));
  const goToAdmin = () => setState(prev => ({ ...prev, status: 'admin' }));

  const startTest = async (name: string, email: string) => {
    setState(prev => ({ ...prev, status: 'generating', userName: name, userEmail: email }));
    
    const messages = [
      'Mounting RHEL 10 Scenario ISO...',
      'Allocating Virtual Context Resources...',
      'Pulling Module 1-15 Telemetry...',
      'Configuring Systemd Lab Targets...',
      'Finalizing Enterprise Integrity Check...'
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 1800);

    try {
      const questions = await generateQuiz(10);
      setState(prev => ({
        ...prev,
        questions,
        status: 'active',
        startTime: Date.now(),
        currentQuestionIndex: 0,
        userAnswers: {}
      }));
    } catch (error) {
      alert("System Fault: Check network parameters and API connectivity.");
      setState(prev => ({ ...prev, status: 'idle' }));
    } finally {
      clearInterval(interval);
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    if (name && email) startTest(name, email);
  };

  const VepsunLogo = ({ size = "normal", glow = true }: { size?: "normal" | "large", glow?: boolean }) => (
    <div className={`relative ${glow ? 'drop-shadow-[0_0_20px_rgba(0,131,202,0.3)]' : ''}`}>
      <svg 
        width={size === "large" ? "320" : "180"} 
        height={size === "large" ? "100" : "55"} 
        viewBox="0 0 240 80" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M25 25 C80 10, 160 10, 215 25" stroke="#f36523" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="120" y="68" fontFamily="'Inter', sans-serif" fontSize="54" fontWeight="900" fill="#0083ca" letterSpacing="-2" textAnchor="middle">
          VEPSUN
        </text>
      </svg>
    </div>
  );

  return (
    <Layout>
      {state.status === 'idle' && (
        <div className="max-w-4xl mx-auto text-center py-20 space-y-16 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center"><VepsunLogo size="large" /></div>
          
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 glass rounded-full text-[10px] font-black text-[#0083ca] uppercase tracking-[0.4em] mb-4">
              Enterprise Lab Access v2.0
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              RHEL 10 <span className="text-[#0083ca]">Core Admin</span><br/>
              <span className="text-[#f36523]/80">Interview Hypervisor</span>
            </h1>
            <p className="text-slate-500 font-medium uppercase tracking-[0.2em] max-w-lg mx-auto text-sm">
              Professional benchmarking for Red Hat administrators. High-fidelity scenario simulation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button
              onClick={goToRegistration}
              className="w-full sm:w-auto px-16 py-6 bg-[#0083ca] text-white font-black rounded-2xl shadow-2xl hover:scale-105 transition-all text-lg uppercase tracking-[0.2em] border-b-4 border-blue-950"
            >
              Launch Assessment
            </button>
            <button
              onClick={goToAdmin}
              className="w-full sm:w-auto px-10 py-6 glass text-slate-400 font-black rounded-2xl hover:text-white transition-all text-sm uppercase tracking-widest"
            >
              Management Vault
            </button>
          </div>
        </div>
      )}

      {state.status === 'register' && (
        <div className="max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-12 text-center border-b border-white/5">
              <VepsunLogo size="normal" glow={false} />
            </div>
            <div className="bg-white/5 p-8 flex items-center justify-between">
              <div className="font-mono">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Login Protocol</p>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Identity Verification</h2>
              </div>
              <div className="w-12 h-12 bg-[#0083ca] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-12-10 10.003 10.003 0 0110-10M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
              </div>
            </div>
            <form onSubmit={handleRegister} className="p-12 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Full Legal Name</label>
                <input required name="name" type="text" className="w-full px-8 py-5 rounded-2xl bg-black/40 border-2 border-white/5 focus:border-[#0083ca] focus:outline-none transition-all font-bold text-white placeholder:text-slate-700" placeholder="e.g. CLI_MASTER_99" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Enterprise Contact Node</label>
                <input required name="email" type="email" className="w-full px-8 py-5 rounded-2xl bg-black/40 border-2 border-white/5 focus:border-[#0083ca] focus:outline-none transition-all font-bold text-white placeholder:text-slate-700" placeholder="admin@enterprise.com" />
              </div>
              <button type="submit" className="w-full py-6 bg-[#f36523] text-white font-black rounded-2xl shadow-xl hover:bg-[#e25412] transition-all text-lg uppercase tracking-[0.3em] border-b-4 border-orange-950">
                Authorize Shell
              </button>
            </form>
          </div>
        </div>
      )}

      {state.status === 'generating' && (
        <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-40 h-40 border-[16px] border-white/5 border-t-[#0083ca] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-[#0083ca] text-4xl">V</div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{loadingMessage}</h2>
            <p className="text-slate-600 font-mono text-[9px] uppercase tracking-[0.6em]">Encrypted Session Handshake in Progress</p>
          </div>
        </div>
      )}

      {state.status === 'active' && (
        <div className="max-w-6xl mx-auto space-y-10 py-6">
          <div className="glass px-10 py-6 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center space-x-8 flex-1 mr-12">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">Session Life</span>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0083ca] to-[#f36523] transition-all duration-1000 shadow-[0_0_10px_rgba(0,131,202,0.5)]" 
                  style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-500 glass px-6 py-2 rounded-xl">
              <span className="opacity-30 mr-2">SYS_NODE</span> {state.currentQuestionIndex + 1} / {state.questions.length}
            </div>
          </div>
          
          <QuestionCard
            question={state.questions[state.currentQuestionIndex]}
            selectedAnswer={state.userAnswers[state.questions[state.currentQuestionIndex].id]}
            onSelectAnswer={(idx) => setState(prev => ({ ...prev, userAnswers: { ...prev.userAnswers, [state.questions[state.currentQuestionIndex].id]: idx } }))}
            onNext={() => {
              if (state.currentQuestionIndex < state.questions.length - 1) {
                setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
              } else {
                setState(prev => ({ ...prev, status: 'completed', endTime: Date.now() }));
              }
            }}
            onPrevious={() => setState(prev => ({ ...prev, currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1) }))}
            isFirst={state.currentQuestionIndex === 0}
            isLast={state.currentQuestionIndex === state.questions.length - 1}
          />
        </div>
      )}

      {state.status === 'completed' && <ResultsView state={state} onRestart={() => window.location.reload()} />}
      {state.status === 'admin' && <AdminDashboard onBack={() => window.location.reload()} />}
    </Layout>
  );
};

export default App;
