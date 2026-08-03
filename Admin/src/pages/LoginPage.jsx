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
import { ShieldCheck, Lock, Mail, Eye, EyeOff, RefreshCw, KeyRound, X, CheckCircle2, Sparkles } from 'lucide-react';

const generateLocalCaptcha = () => {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const width = 180;
  const height = 54;
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;">`;
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#704F38" stroke-width="1.5" opacity="0.25"/>`;
  }
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const fontSize = 26;
    const angle = Math.floor((Math.random() - 0.5) * 22);
    const x = 20 + i * 32;
    const y = 36;
    svg += `<text x="${x}" y="${y}" font-family="monospace" font-size="${fontSize}" font-weight="900" fill="#704F38" transform="rotate(${angle} ${x} ${y})">${char}</text>`;
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

  const { data: captchaData, refetch: refetchCaptcha } = useGetCaptchaQuery();
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
      setError('Please enter the 5-character CAPTCHA code');
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
      if (res.devOtp) {
        setOtpCode(res.devOtp);
      }
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
    <div className="min-h-screen bg-[#191A24] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#704F38] selection:text-white">
      {/* Container Box */}
      <div className="w-full max-w-5xl bg-[#191A24] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl border border-white/10">
        
        {/* Left Side: Mobile App Hero Showcase */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EAE0D5] p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Graphic Ornaments */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#704F38]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#704F38]/15 rounded-full blur-3xl" />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2619] text-[#E8B84E] flex items-center justify-center font-serif font-black text-xl shadow-md">
                f
              </div>
              <span className="text-xl font-black text-[#1F2029] tracking-tight">fashion.</span>
            </div>
            <div className="mt-8">
              <h1 className="text-3xl font-black text-[#1F2029] tracking-tight leading-tight">
                Clothes Store <br />
                <span className="text-[#704F38]">Mobile App & Enterprise</span> Portal
              </h1>
              <p className="text-xs text-[#6B7280] font-bold mt-2 max-w-sm">
                Manage products, inventory, orders, customer feedback, and live analytics seamlessly across your e-commerce ecosystem.
              </p>
            </div>
          </div>

          {/* Floating Mobile Screens Graphic */}
          <div className="relative z-10 my-6 py-6 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
              {/* Card 1 Back */}
              <div className="absolute top-0 left-2 w-48 p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/60 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#704F38] text-white flex items-center justify-center text-[10px] font-bold">f</div>
                  <span className="text-[10px] font-black text-[#1F2029]">New Collection</span>
                </div>
                <div className="h-16 bg-[#F5F2EF] rounded-xl flex items-center justify-center text-[10px] font-bold text-[#704F38]">
                  🧥 50% Off Flash Sale
                </div>
              </div>

              {/* Card 2 Main Front */}
              <div className="absolute top-6 right-2 w-56 p-4 rounded-3xl bg-[#704F38] text-white shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black tracking-wider uppercase opacity-80">FashionStore App</span>
                  <Sparkles className="w-4 h-4 text-[#E8B84E]" />
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span>Earthy Slim Fit Blazer</span>
                    <span className="text-[#E8B84E]">₹83.97</span>
                  </div>
                  <div className="text-[10px] text-white/70">⭐ 4.8 (124 reviews)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-[#6B7280] border-t border-[#704F38]/15 pt-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#059669]" /> Enterprise SSL 256-bit Secured
            </span>
            <span>v2.5.0</span>
          </div>
        </div>

        {/* Right Side: Exact Admin Login Card */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex items-center justify-center bg-[#191A24]">
          <div className="w-full max-w-md bg-white p-7 sm:p-9 rounded-[28px] shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#3D2619] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="font-serif font-black text-xl text-[#E8B84E]">f</span>
              </div>
              <h2 className="text-2xl font-black text-[#1F2029] tracking-tight">FashionStore</h2>
              <span className="text-[10px] font-black text-[#704F38] tracking-[0.2em] uppercase mt-1 block">
                ENTERPRISE ADMIN PORTAL
              </span>
            </div>

            {error && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] px-4 py-3 rounded-2xl text-xs font-extrabold mb-5 text-center shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin Email */}
              <div>
                <label className="block text-[11px] font-black text-[#1F2029] uppercase tracking-wider mb-1.5">
                  ADMIN EMAIL
                </label>
                <div className="flex items-center bg-[#EFF4FF] border border-[#DCE6FF] focus-within:border-[#704F38] focus-within:bg-white rounded-2xl px-3.5 py-1 transition-all">
                  <Mail className="w-4 h-4 text-[#6B7280] mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="admin@fashionstore.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-none outline-none text-xs font-bold text-[#1F2029] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-black text-[#1F2029] uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotStep(1);
                      setForgotErr('');
                      setForgotMsg('');
                      setForgotModalVisible(true);
                    }}
                    className="text-[11px] font-black text-[#704F38] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="flex items-center bg-[#EFF4FF] border border-[#DCE6FF] focus-within:border-[#704F38] focus-within:bg-white rounded-2xl px-3.5 py-1 transition-all">
                  <Lock className="w-4 h-4 text-[#6B7280] mr-2 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-none outline-none text-xs font-bold text-[#1F2029] placeholder-[#9CA3AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-[#6B7280] hover:text-[#704F38] focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Verification (CAPTCHA) */}
              <div>
                <label className="block text-[11px] font-black text-[#1F2029] uppercase tracking-wider mb-1.5">
                  SECURITY VERIFICATION (CAPTCHA)
                </label>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex-1 flex items-center justify-center min-h-[50px] bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: activeSvg }} />
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    title="Reload CAPTCHA"
                    className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#704F38] rounded-2xl text-[#1F2029] transition-colors shadow-2xs"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#704F38] transition-transform duration-300 ${isSpinning ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="ENTER 5-CHARACTER CAPTCHA"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] focus:border-[#704F38] rounded-2xl outline-none text-xs font-black text-[#1F2029] tracking-widest uppercase placeholder-[#9CA3AF]"
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#704F38] hover:bg-[#5A3F2C] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#704F38]/30 transition-all duration-150 disabled:opacity-50 mt-3"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalVisible && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
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
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] p-3 rounded-2xl text-xs font-bold mb-4 text-center">
                {forgotErr}
              </div>
            )}
            {forgotMsg && (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] p-3 rounded-2xl text-xs font-bold mb-4 text-center flex items-center justify-center gap-2">
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
