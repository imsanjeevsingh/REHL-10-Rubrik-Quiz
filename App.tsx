
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

  const goToRegistration = () => {
    setState(prev => ({ ...prev, status: 'register' }));
  };

  const goToAdmin = () => {
    setState(prev => ({ ...prev, status: 'admin' }));
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) return;

    setState(prev => ({
      ...prev,
      userName: name,
      userEmail: email,
    }));
    
    startTest();
  };

  const startTest = async () => {
    setState(prev => ({ ...prev, status: 'generating' }));
    
    const messages = [
      'Synchronizing Vepsun Training Modules...',
      'Architecting RHEL 10 Technical Scenarios...',
      'Establishing Secure Lab Parameters...',
      'Connecting to Enterprise Admin Vault...',
      'Finalizing Global Assessment Standards...'
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 2000);

    try {
      const questions = await generateQuiz(12);
      setState(prev => ({
        ...prev,
        questions,
        status: 'active',
        startTime: Date.now(),
        currentQuestionIndex: 0,
        userAnswers: {}
      }));
    } catch (error) {
      alert("Technical error: Assessment engine failed to initialize. Please check network connectivity.");
      setState(prev => ({ ...prev, status: 'idle' }));
    } finally {
      clearInterval(interval);
    }
  };

  const handleSelectAnswer = (index: number) => {
    const currentQ = state.questions[state.currentQuestionIndex];
    setState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQ.id]: index
      }
    }));
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      setState(prev => ({
        ...prev,
        status: 'completed',
        endTime: Date.now()
      }));
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleRestart = () => {
    setState({
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
  };

  const VepsunLogo = ({ size = "normal" }: { size?: "normal" | "large" }) => (
    <svg 
      width={size === "large" ? "320" : "180"} 
      height={size === "large" ? "100" : "55"} 
      viewBox="0 0 240 80" 
      xmlns="http://www.w3.org/2000/svg"
      className="filter drop-shadow-md"
    >
      <path d="M25 25 C80 10, 160 10, 215 25" stroke="#f36523" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="120" y="68" fontFamily="'Inter', sans-serif" fontSize="54" fontWeight="900" fill="#0083ca" letterSpacing="-2" textAnchor="middle">
        VEPSUN
      </text>
    </svg>
  );

  return (
    <Layout>
      {state.status === 'idle' && (
        <div className="max-w-5xl mx-auto text-center space-y-16 py-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center transform transition-transform hover:scale-105 duration-500">
            <VepsunLogo size="large" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight sm:text-7xl leading-none uppercase">
              RHEL 10 <span className="text-[#0083ca]">ADMIN</span><br/>
              <span className="text-[#f36523]">EXPERT</span> ASSESSMENT
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium uppercase tracking-[0.1em]">
              Professional Enterprise Linux Evaluation <span className="text-[#0083ca]/30 mx-2">|</span> Powered by Vepsun Labs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {[
              { title: 'Technical Scenarios', desc: 'Real-world problem solving for RHEL 10 environments.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
              { title: 'Global Benchmarking', desc: 'Score metrics aligned with industry senior admin roles.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { title: 'Module Breakdown', desc: 'Detailed analytics across all 15 core training modules.', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
              { title: 'Direct Admin Reporting', desc: 'Immediate dispatch of verified results to Sanjeev.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,131,202,0.05)] border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                <div className="w-12 h-12 bg-gray-50 text-[#0083ca] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0083ca] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                  </svg>
                </div>
                <h4 className="font-black text-gray-900 text-lg mb-2 uppercase tracking-tight">{item.title}</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button
              onClick={goToRegistration}
              className="w-full sm:w-auto px-20 py-7 bg-[#0083ca] text-white font-black rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,131,202,0.4)] hover:bg-[#0070ad] hover:-translate-y-1.5 transition-all active:scale-95 text-xl uppercase tracking-[0.2em] border-b-4 border-blue-950"
            >
              Start Session
            </button>
            <button
              onClick={goToAdmin}
              className="w-full sm:w-auto px-12 py-7 bg-white text-gray-400 font-black rounded-[2.5rem] border-2 border-gray-100 hover:bg-gray-50 hover:text-[#0083ca] transition-all text-lg uppercase tracking-widest shadow-sm"
            >
              Admin Vault
            </button>
          </div>
        </div>
      )}

      {state.status === 'admin' && (
        <AdminDashboard onBack={handleRestart} />
      )}

      {state.status === 'register' && (
        <div className="max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="bg-white rounded-[4rem] shadow-[0_50px_150px_rgba(0,131,202,0.12)] overflow-hidden border border-gray-50">
            <div className="bg-white border-b border-gray-100 p-12 flex justify-center">
              <VepsunLogo size="normal" />
            </div>
            <div className="bg-[#111827] p-10 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Identity Check</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black italic">Vepsun Verification Protocol</p>
              </div>
              <div className="w-12 h-12 bg-[#f36523] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(243,101,35,0.3)]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-12-10 10.003 10.003 0 0110-10M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
              </div>
            </div>
            <form onSubmit={handleRegister} className="p-14 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#0083ca] rounded-full mr-2"></span> Full Technical Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g. Robert Hood"
                  className="w-full px-8 py-6 rounded-[2rem] border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#0083ca] focus:ring-8 focus:ring-[#0083ca]/5 focus:outline-none transition-all placeholder:text-gray-200 font-black text-lg"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#0083ca] rounded-full mr-2"></span> Corporate Endpoint
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="robert.linux@enterprise.com"
                  className="w-full px-8 py-6 rounded-[2rem] border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#0083ca] focus:ring-8 focus:ring-[#0083ca]/5 focus:outline-none transition-all placeholder:text-gray-200 font-black text-lg"
                />
              </div>
              <div className="p-8 bg-blue-50 rounded-[2.5rem] text-[11px] text-[#0083ca] leading-relaxed font-black border border-blue-100 flex items-start shadow-inner italic">
                <svg className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 text-[#f36523]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>DATA INTEGRITY NOTICE: Assessment telemetry is encrypted and dispatched to Vepsun Admin (sanjeev.vmware@gmail.com) upon finalization.</span>
              </div>
              <button
                type="submit"
                className="w-full py-7 bg-[#0083ca] text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-[#0070ad] transition-all active:scale-[0.98] text-xl uppercase tracking-[0.3em] border-b-4 border-blue-950"
              >
                Authenticate Lab
              </button>
            </form>
          </div>
        </div>
      )}

      {state.status === 'generating' && (
        <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-52 h-52 border-[24px] border-gray-50 border-t-[#0083ca] border-r-[#f36523]/30 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white p-6 rounded-full shadow-2xl text-center">
                 <div className="text-[#0083ca] font-black text-3xl">V</div>
               </div>
            </div>
          </div>
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{loadingMessage}</h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="w-3 h-3 bg-[#f36523] rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-[#0083ca] rounded-full animate-bounce delay-150"></span>
              <span className="w-3 h-3 bg-[#f36523] rounded-full animate-bounce delay-300"></span>
            </div>
            <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-[10px] pt-4">Securing Cloud Environment for {state.userName}</p>
          </div>
        </div>
      )}

      {state.status === 'active' && (
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center justify-between bg-white px-12 py-8 rounded-[3rem] shadow-[0_25px_80px_rgba(0,0,0,0.04)] border border-gray-50">
            <div className="flex items-center space-x-10 flex-1 mr-16">
               <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] whitespace-nowrap">Session Health</div>
              <div className="h-5 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-[#0083ca] via-[#00aaff] to-[#f36523] transition-all duration-1000 ease-out rounded-full shadow-lg" 
                  style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-md font-black text-[#0083ca] bg-blue-50 px-8 py-3 rounded-[1.5rem] border border-blue-100 shadow-sm font-mono flex items-center">
              <span className="opacity-30 text-xs mr-3">MOD</span> {state.currentQuestionIndex + 1} <span className="text-[#f36523] opacity-40 mx-3">/</span> {state.questions.length}
            </div>
          </div>
          
          <QuestionCard
            question={state.questions[state.currentQuestionIndex]}
            selectedAnswer={state.userAnswers[state.questions[state.currentQuestionIndex].id]}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={state.currentQuestionIndex === 0}
            isLast={state.currentQuestionIndex === state.questions.length - 1}
          />
        </div>
      )}

      {state.status === 'completed' && (
        <ResultsView state={state} onRestart={handleRestart} />
      )}
    </Layout>
  );
};

export default App;
