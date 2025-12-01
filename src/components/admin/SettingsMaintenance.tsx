import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSettings, BusinessSettings } from '../../utils/settings';
import bcrypt from 'bcryptjs';

interface SettingsMaintenanceProps {
  t: any;
}

export function SettingsMaintenance({ t }: SettingsMaintenanceProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await getSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      const originalEmail = (await getSettings()).email;

      let updateData: any = {
        Email: settings.email,
        Phone: settings.phone,
        Address: settings.address,
        BusinessName: settings.name,
        MapLocation: `${settings.latitude},${settings.longitude}`
      };

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage(t.settings.passwordsNoMatch);
          setSaving(false);
          return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.OnlinePassword = hashedPassword;
      }

      const { error } = await supabase
        .from('Settings')
        .update(updateData)
        .eq('Id', settings.id);

      if (error) throw error;

      // Update Products BusinessEmail if email changed
      if (settings.email !== originalEmail) {
        await supabase
          .from('Products')
          .update({ BusinessEmail: settings.email })
          .eq('IdBusiness', settings.id);
      }

      setMessage(t.settings.settingsSaved);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(t.settings.errorSaving);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t.settings.loadingSettings}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{t.settings.title}</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.businessName}
            </label>
            <input
              type="text"
              value={settings?.name || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.email}
            </label>
            <input
              type="email"
              value={settings?.email || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.phone}
            </label>
            <input
              type="text"
              value={settings?.phone || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, phone: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.address}
            </label>
            <input
              type="text"
              value={settings?.address || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, address: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.latitude}
            </label>
            <input
              type="number"
              step="any"
              value={settings?.latitude || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, latitude: parseFloat(e.target.value) } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.longitude}
            </label>
            <input
              type="number"
              step="any"
              value={settings?.longitude || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, longitude: parseFloat(e.target.value) } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t.settings.updatePassword}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.settings.newPassword}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder={t.settings.newPasswordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.settings.confirmPassword}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.settings.confirmPasswordPlaceholder}
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t.settings.saving : t.settings.saveSettings}
          </button>
        </div>
      </form>
    </div>
  );
}