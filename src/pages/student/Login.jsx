import { useState, createContext } from 'react';

const AuthContext = createContext();

// مكونات الأيقونات البسيطة
const Icons = {
  Upload: () => <span className="text-lg">📁</span>,
  Trash: () => <span className="text-lg">🗑️</span>,
  Spinner: () => <span className="animate-spin text-lg">⏳</span>,
  Eye: () => <span className="text-lg">👁️</span>,
  Edit: () => <span className="text-lg">✏️</span>,
  Save: () => <span className="text-lg">💾</span>,
  Cancel: () => <span className="text-lg">❌</span>,
  Logout: () => <span className="text-lg">🚪</span>,
};

const API_BASE_URL = 'http://127.0.0.1:8000';

const Navbar = ({ user, onLogout }) => (
  <nav className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold text-orange-600">نظام الطلاب</h1>
    <div className="flex items-center gap-4">
      <span className="text-gray-700">مرحباً، {user?.first_name}</span>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-800"
      >
        <Icons.Logout /> تسجيل خروج
      </button>
    </div>
  </nav>
);

const Sidebar = () => (
  <aside className="bg-gray-100 w-64 p-4 hidden lg:block">
    <div className="space-y-2">
      <div className="bg-orange-500 text-white p-3 rounded">الملف الشخصي</div>
      <div className="p-3 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">
        المقررات
      </div>
      <div className="p-3 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">
        الدرجات
      </div>
      <div className="p-3 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">
        الأنشطة
      </div>
    </div>
  </aside>
);

const Footer = () => (
  <div className="text-center text-gray-500">
    © 2025 نظام إدارة الطلاب. جميع الحقوق محفوظة.
  </div>
);

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (data && data.data && data.data.access_token && data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.data.access_token);
        onLogin(data.data.user);
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icons.Spinner /> جاري تسجيل الدخول...
              </span>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
