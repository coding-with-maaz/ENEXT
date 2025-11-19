'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Save, Plus, Trash2, Link as LinkIcon, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  companyName: string;
  companyLogo: string;
  companyDescription: string;
  copyrightText: string;
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  socialLinks: SocialLink[];
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

const defaultSettings: FooterSettings = {
  companyName: 'ENEXT',
  companyLogo: 'E',
  companyDescription: 'Your trusted destination for quality products. We\'re committed to providing the best shopping experience.',
  copyrightText: `© ${new Date().getFullYear()} ENEXT. All rights reserved.`,
  quickLinks: [
    { id: '1', label: 'Shop', href: '/shop' },
    { id: '2', label: 'About Us', href: '/about' },
    { id: '3', label: 'Contact', href: '/contact' },
    { id: '4', label: 'Shopping Cart', href: '/cart' },
  ],
  customerServiceLinks: [
    { id: '1', label: 'Shipping Info', href: '#' },
    { id: '2', label: 'Returns', href: '#' },
    { id: '3', label: 'FAQ', href: '#' },
    { id: '4', label: 'Privacy Policy', href: '#' },
  ],
  socialLinks: [
    { id: '1', platform: 'Facebook', url: '#', icon: 'facebook' },
    { id: '2', platform: 'Twitter', url: '#', icon: 'twitter' },
    { id: '3', platform: 'Instagram', url: '#', icon: 'instagram' },
  ],
  newsletterEnabled: true,
  newsletterTitle: 'Newsletter',
  newsletterDescription: 'Subscribe to get special offers and updates',
  contactInfo: {
    email: 'support@enext.com',
    phone: '+1 (555) 123-4567',
    address: '123 Commerce Street, Business City, BC 12345, United States',
  },
};

export default function AdminFooterPage() {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('footerSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('footerSettings', JSON.stringify(settings));
      // In production, save to database via API
      alert('Footer settings saved successfully!');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Failed to save footer settings');
    } finally {
      setSaving(false);
    }
  };

  const addLink = (type: 'quickLinks' | 'customerServiceLinks') => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      label: '',
      href: '',
    };
    setSettings({
      ...settings,
      [type]: [...settings[type], newLink],
    });
  };

  const removeLink = (type: 'quickLinks' | 'customerServiceLinks', id: string) => {
    setSettings({
      ...settings,
      [type]: settings[type].filter((link) => link.id !== id),
    });
  };

  const updateLink = (type: 'quickLinks' | 'customerServiceLinks', id: string, field: 'label' | 'href', value: string) => {
    setSettings({
      ...settings,
      [type]: settings[type].map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const addSocialLink = () => {
    const newSocial: SocialLink = {
      id: Date.now().toString(),
      platform: 'Facebook',
      url: '#',
      icon: 'facebook',
    };
    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, newSocial],
    });
  };

  const removeSocialLink = (id: string) => {
    setSettings({
      ...settings,
      socialLinks: settings.socialLinks.filter((link) => link.id !== id),
    });
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url' | 'icon', value: string) => {
    setSettings({
      ...settings,
      socialLinks: settings.socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading footer settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Footer Management
          </h1>
          <p className="text-gray-600">Customize your website footer content and links</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Logo (Single Character)
            </label>
            <input
              type="text"
              value={settings.companyLogo}
              onChange={(e) => setSettings({ ...settings, companyLogo: e.target.value })}
              maxLength={1}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-center text-2xl font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              value={settings.companyDescription}
              onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Copyright Text
            </label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={settings.contactInfo.email}
              onChange={(e) => setSettings({
                ...settings,
                contactInfo: { ...settings.contactInfo, email: e.target.value },
              })}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            <input
              type="tel"
              value={settings.contactInfo.phone}
              onChange={(e) => setSettings({
                ...settings,
                contactInfo: { ...settings.contactInfo, phone: e.target.value },
              })}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <input
              type="text"
              value={settings.contactInfo.address}
              onChange={(e) => setSettings({
                ...settings,
                contactInfo: { ...settings.contactInfo, address: e.target.value },
              })}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
          <Button
            onClick={() => addLink('quickLinks')}
            variant="secondary"
            size="sm"
            className="bg-white border-2 border-gray-200 hover:border-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
        <div className="space-y-3">
          {settings.quickLinks.map((link) => (
            <div key={link.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Link Label"
                  value={link.label}
                  onChange={(e) => updateLink('quickLinks', link.id, 'label', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.href}
                  onChange={(e) => updateLink('quickLinks', link.id, 'href', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => removeLink('quickLinks', link.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Service Links */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Customer Service Links</h2>
          <Button
            onClick={() => addLink('customerServiceLinks')}
            variant="secondary"
            size="sm"
            className="bg-white border-2 border-gray-200 hover:border-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
        <div className="space-y-3">
          {settings.customerServiceLinks.map((link) => (
            <div key={link.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Link Label"
                  value={link.label}
                  onChange={(e) => updateLink('customerServiceLinks', link.id, 'label', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.href}
                  onChange={(e) => updateLink('customerServiceLinks', link.id, 'href', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => removeLink('customerServiceLinks', link.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Social Media Links</h2>
          <Button
            onClick={addSocialLink}
            variant="secondary"
            size="sm"
            className="bg-white border-2 border-gray-200 hover:border-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>
        <div className="space-y-3">
          {settings.socialLinks.map((link) => (
            <div key={link.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Icon name"
                  value={link.icon}
                  onChange={(e) => updateSocialLink(link.id, 'icon', e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => removeSocialLink(link.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Newsletter Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Enable Newsletter</p>
              <p className="text-sm text-gray-600">Show newsletter subscription form in footer</p>
            </div>
            <input
              type="checkbox"
              checked={settings.newsletterEnabled}
              onChange={(e) => setSettings({ ...settings, newsletterEnabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>
          {settings.newsletterEnabled && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Newsletter Title
                </label>
                <input
                  type="text"
                  value={settings.newsletterTitle}
                  onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Newsletter Description
                </label>
                <textarea
                  value={settings.newsletterDescription}
                  onChange={(e) => setSettings({ ...settings, newsletterDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
        <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {settings.companyLogo}
              </div>
              <span className="text-xl font-bold text-white">{settings.companyName}</span>
            </div>
            <p className="text-sm text-gray-400">{settings.companyDescription}</p>
          </div>
          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-700">
            {settings.copyrightText}
          </div>
        </div>
      </div>
    </div>
  );
}

