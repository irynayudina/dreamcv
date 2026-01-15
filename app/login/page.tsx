export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-12 bg-white rounded-3xl shadow-xl border border-slate-100 text-center space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Login to Dream cv</h1>
        <p className="text-slate-500">Welcome back! Please sign in to continue.</p>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
