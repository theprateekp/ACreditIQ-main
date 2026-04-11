import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoginError, clearLoginError, selectLoginError } from '@/store/authSlice';
import { MOCK_USERS } from '@/data/mockData';
import './LoginPage.css';

// ── Mic permission modal shown before login ───────────────────
function MicPermissionModal({ onGrant, onSkip }: { onGrant: () => void; onSkip: () => void }) {
  const [requesting, setRequesting] = useState(false);

  async function requestMic() {
    setRequesting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      localStorage.setItem('accreditiq_mic_granted', '1');
      onGrant();
    } catch {
      onSkip(); // denied — continue without voice
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        width:360, borderRadius:24, overflow:'hidden',
        background:'white',
        boxShadow:'0 20px 60px rgba(0,0,0,0.25)',
        animation:'geminiCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Rainbow top */}
        <div style={{ height:4, background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#f59e0b,#10b981,#3b82f6)', backgroundSize:'200% 100%', animation:'geminiBarSlide 2s linear infinite' }} />

        <div style={{ padding:'24px 24px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, textAlign:'center' }}>
          {/* Robot */}
          <div style={{ width:72, height:72, borderRadius:20, background:'linear-gradient(135deg,#4F46E5,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(79,70,229,0.4)', animation:'geminiRobotBob 2s ease-in-out infinite' }}>
            <img src="/chatbot-icon.png" alt="AccreditIQ" style={{ width:58, height:58, borderRadius:14, objectFit:'cover' }} />
          </div>

          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#1e1b4b', marginBottom:6 }}>Enable Voice Assistant</div>
            <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>
              AccreditIQ can listen for <strong style={{color:'#4F46E5'}}>"Hey AccreditIQ"</strong> while you work on the dashboard, so you can get instant AI help hands-free.
            </div>
          </div>

          <div style={{ display:'flex', gap:8, width:'100%' }}>
            <button onClick={onSkip}
              style={{ flex:1, padding:'10px 0', borderRadius:12, border:'1.5px solid rgba(99,102,241,0.25)', background:'transparent', color:'#6B7280', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Skip for now
            </button>
            <button onClick={requestMic} disabled={requesting}
              style={{ flex:2, padding:'10px 0', borderRadius:12, border:'none', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              {requesting
                ? <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
                : <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22" strokeWidth={2.5}/></svg>
              }
              Allow Microphone
            </button>
          </div>
          <div style={{ fontSize:10, color:'#9CA3AF' }}>Your voice is processed locally. No audio is stored.</div>
        </div>
      </div>

      <style>{`
        @keyframes geminiCardIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes geminiBarSlide { 0%{background-position:0% 0} 100%{background-position:200% 0} }
        @keyframes geminiRobotBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);
  const [lightLevel, setLightLevel] = useState('0');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Show mic permission modal if not yet decided
  const [showMicModal, setShowMicModal] = useState(
    !localStorage.getItem('accreditiq_mic_granted') && !localStorage.getItem('accreditiq_mic_skipped')
  );

  // Mirrors Auth.login() from dashboard-helpers.js:
  // find user by email (case-insensitive) + matching password
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearLoginError());

    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLoginError('Invalid email or password.'));
    }
  };

  return (
    <div className="login-page-wrapper" data-light={lightLevel}>
      {/* Mic permission modal — shown once before login */}
      {showMicModal && (
        <MicPermissionModal
          onGrant={() => setShowMicModal(false)}
          onSkip={() => { localStorage.setItem('accreditiq_mic_skipped', '1'); setShowMicModal(false); }}
        />
      )}
      {/* Slider form above lamp */}
      <form className="slider-form" onSubmit={(e) => e.preventDefault()}>
        <div className="icon sun">
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
        </div>
        <input
          type="range"
          value={lightLevel}
          min="0"
          max="10"
          onChange={(e) => setLightLevel(e.target.value)}
        />
      </form>

      {/* Lamp in the center */}
      <div className="lamp-wrapper">
        <div className="lamp-rope"></div>
        <div className="lamp">
          <div className="lamp-part -top">
            <div className="lamp-part -top-part"></div>
            <div className="lamp-part -top-part right"></div>
          </div>
          <div className="lamp-part -body"></div>
          <div className="lamp-part -body right"></div>
          <div className="lamp-part -bottom"></div>
          <div className="blub"></div>
        </div>
        <div className="wall-light-shadow"></div>
      </div>

      {/* Login form below lamp */}
      <div className="login-form">
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email:</label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="principal@tssm.edu.in"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && (
            <div className="login-error">{loginError}</div>
          )}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Demo credentials hint removed for security */}
      </div>
    </div>
  );
}
