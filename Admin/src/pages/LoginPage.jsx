import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '../services/adminAuthApi';
import { setCredentials } from '../app/authSlice';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    try {
      const res = await adminLogin({ email: cleanEmail, password: cleanPassword }).unwrap();
      if (res.token && res.user) {
        if (res.user.role === 'user') {
          setError('Access Denied: Standard user accounts cannot log in to Admin Portal.');
          return;
        }
        dispatch(setCredentials({ user: res.user, token: res.token }));
      }
    } catch (err) {
      setError(err.data?.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1F2029] p-5">
      <div className="bg-white p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl border border-[#D4C4B7]/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#704F38] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#704F38]/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#1F2029] tracking-tight">FashionStore</h2>
          <span className="text-[11px] font-black text-[#704F38] tracking-widest uppercase mt-1 block">
            ENTERPRISE ADMIN PORTAL
          </span>
        </div>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] px-4 py-3 rounded-xl text-xs font-bold mb-6 text-center">
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
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Password</label>
            <div className="flex items-center bg-[#FDFBF9] border border-[#EDEDED] focus-within:border-[#704F38] rounded-xl px-3.5 py-1 transition-colors">
              <Lock className="w-4 h-4 text-[#797979] mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#704F38] hover:bg-[#8C6244] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#704F38]/30 transition-all duration-150 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#797979]">
          Default Super Admin: <span className="font-bold text-[#704F38]">admin@fashionstore.com</span> / <span className="font-bold text-[#704F38]">Admin@123</span>
        </div>
      </div>
    </div>
  );
};
