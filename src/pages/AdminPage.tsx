import { useState, useEffect } from 'react';
import { Lock, Settings, Package, Store } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { getSettings } from '../utils/settings';
import { SettingsMaintenance } from '../components/admin/SettingsMaintenance';
import { ProductsMaintenance } from '../components/admin/ProductsMaintenance';

interface AdminPageProps {
  t: any;
}

export function AdminPage({ t }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'products'>('settings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const settings = await getSettings();
      const isValid = await bcrypt.compare(password, settings.onlinePassword);
      
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setError(t.admin.invalidPassword);
      }
    } catch (err) {
      setError(t.admin.authFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t.admin.title}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                {t.admin.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t.admin.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? t.admin.authenticating : t.admin.signIn}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.admin.dashboard}</h1>
          
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  {t.admin.settings}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'products'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  {t.admin.products}
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'settings' && <SettingsMaintenance t={t} />}
              {activeTab === 'products' && <ProductsMaintenance t={t} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}