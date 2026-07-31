import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  useAdminLoginMutation, 
  useGetCaptchaQuery, 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useResetPasswordMutation 
} from '../services/adminAuthApi';
import { setCredentials } from '../app/authSlice';
import brandIcon from '../assets/icon.png';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, RefreshCw, KeyRound, X, CheckCircle2 } from 'lucide-react';

const generateLocalCaptcha = () => {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const width = 150;
  const height = 50;
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:#FDFBF9;border:1px solid #EDEDED;border-radius:10px;">`;
  for (let i = 0; i < 3; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#704F38" stroke-width="1.5" opacity="0.3"/>`;
  }
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const fontSize = 24;
    const angle = Math.floor((Math.random() - 0.5) * 20);
    const x = 16 + i * 26;
    const y = 33;
    svg += `<text x="${x}" y="${y}" font-family="monospace" font-size="${fontSize}" font-weight="bold" fill="#704F38" transform="rotate(${angle} ${x} ${y})">${char}</text>`;
  }
  svg += `</svg>`;
  return { code, svg };
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Instant CAPTCHA State (0ms delay)
  const [localCaptcha, setLocalCaptcha] = useState(() => generateLocalCaptcha());

  // Forgot Password Modal State
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  const { data: captchaData, refetch: refetchCaptcha, isFetching: isCaptchaLoading } = useGetCaptchaQuery();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const dispatch = useDispatch();

  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefreshCaptcha = () => {
    setIsSpinning(true);
    setLocalCaptcha(generateLocalCaptcha());
    refetchCaptcha();
    setTimeout(() => setIsSpinning(false), 300);
  };

  const activeSvg = captchaData?.svg || localCaptcha.svg;
  const activeToken = captchaData?.captchaToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaAnswer) {
      setError('Please enter the CAPTCHA code shown below');
      return;
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    try {
      const res = await adminLogin({
        email: cleanEmail,
        password: cleanPassword,
        captchaAnswer: captchaAnswer.trim(),
        captchaToken: activeToken
      }).unwrap();

      if (res.token && res.user) {
        if (res.user.role === 'user') {
          setError('Access Denied: Standard user accounts cannot log in to Admin Portal.');
          handleRefreshCaptcha();
          return;
        }
        dispatch(setCredentials({ user: res.user, token: res.token }));
      }
    } catch (err) {
      const serverErrMsg = typeof err.data === 'string' 
        ? err.data 
        : (err.data?.message || err.message || 'Invalid admin credentials or CAPTCHA');
      setError(serverErrMsg);
      setCaptchaAnswer('');
      handleRefreshCaptcha();
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');
    try {
      const res = await forgotPassword({ email: forgotEmail.trim() }).unwrap();
      setForgotMsg(res.message || 'OTP sent to your email address.');
      setForgotStep(2);
    } catch (err) {
      setForgotErr(err.data?.message || 'Failed to send OTP email.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');
    try {
      const res = await verifyOtp({ email: forgotEmail.trim(), code: otpCode.trim() }).unwrap();
      setResetToken(res.token);
      setForgotMsg('OTP verified successfully! Please enter your new password.');
      setForgotStep(3);
    } catch (err) {
      setForgotErr(err.data?.message || 'Invalid or expired OTP code.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');
    try {
      await resetPassword({
        email: forgotEmail.trim(),
        password: newPassword.trim(),
        resetToken
      }).unwrap();
      setForgotMsg('Password updated successfully! You can now log in.');
      setTimeout(() => {
        setForgotModalVisible(false);
        setForgotStep(1);
        setEmail(forgotEmail);
      }, 1500);
    } catch (err) {
      setForgotErr(err.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1F2029] p-5">
      <div className="bg-white p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl border border-[#D4C4B7]/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-3 p-2 rounded-2xl border border-[#EDEDED] shadow-sm">
            <img src={brandIcon} alt="FashionStore Admin Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-[#1F2029] tracking-tight">FashionStore</h2>
          <span className="text-[11px] font-black text-[#704F38] tracking-widest uppercase mt-1 block">
            ENTERPRISE ADMIN PORTAL
          </span>
        </div>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] px-4 py-3 rounded-xl text-xs font-bold mb-6 text-center shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Admin Email</label>
            <div className="flex items-center bg-[#FDFBF9] border border-[#EDEDED] focus-within:border-[#704F38] rounded-xl px-3.5 py-1 transition-colors">
              <Mail className="w-4 h-4 text-[#797979] mr-2" />
              <input
                type="email"
                required
                placeholder="admin@fashionstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029] font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep(1);
                  setForgotErr('');
                  setForgotMsg('');
                  setForgotModalVisible(true);
                }}
                className="text-xs font-extrabold text-[#704F38] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="flex items-center bg-[#FDFBF9] border border-[#EDEDED] focus-within:border-[#704F38] rounded-xl px-3.5 py-1 transition-colors">
              <Lock className="w-4 h-4 text-[#797979] mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029] font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#797979] hover:text-[#704F38] focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instant Visual CAPTCHA Challenge (0ms) */}
          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Security Verification (CAPTCHA)</label>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 flex items-center justify-center min-h-[50px] bg-[#FDFBF9] border border-[#EDEDED] rounded-xl overflow-hidden shadow-inner">
                <div dangerouslySetInnerHTML={{ __html: activeSvg }} />
              </div>
              <button
                type="button"
                onClick={handleRefreshCaptcha}
                title="Reload CAPTCHA"
                className="p-3 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl text-[#1F2029] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${isSpinning ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="Enter 5-character CAPTCHA"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] focus:border-[#704F38] rounded-xl outline-none text-sm font-bold text-[#1F2029] tracking-wider uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#704F38] hover:bg-[#8C6244] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#704F38]/30 transition-all duration-150 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#704F38]" />
                <h3 className="text-base font-black text-[#1F2029]">Password Reset Verification</h3>
              </div>
              <button onClick={() => setForgotModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotErr && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] p-3 rounded-xl text-xs font-bold mb-4 text-center">
                {forgotErr}
              </div>
            )}
            {forgotMsg && (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] p-3 rounded-xl text-xs font-bold mb-4 text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {forgotMsg}
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs text-[#797979] font-medium">Enter your admin email address to receive a 6-digit verification code.</p>
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@fashionstore.com"
                    className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 bg-[#704F38] text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSendingOtp ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs text-[#797979] font-medium">Enter the 6-digit OTP code sent to <b>{forgotEmail}</b>.</p>
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-center text-lg font-black tracking-widest text-[#1F2029]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold rounded-xl text-[#797979]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="flex-1 py-2.5 bg-[#704F38] text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-50"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <p className="text-xs text-[#797979] font-medium">Create a new secure password for your account.</p>
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="w-full py-3 bg-[#704F38] text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {isResettingPassword ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
