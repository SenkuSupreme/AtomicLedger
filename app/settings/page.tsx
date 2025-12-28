
'use client';

import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700/50 space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">Email</label>
          <input disabled value={session?.user?.email || ''} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-500" />
        </div>
      </div>

       <div className="bg-gray-800 p-6 rounded-xl border border-gray-700/50 space-y-4">
        <h2 className="text-xl font-semibold">AI Configuration</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">OpenRouter API Key</label>
          <input type="password" placeholder="sk-..." className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none" />
           <p className="text-xs text-gray-500 mt-1">
             Enter your key here to enable AI features if not set in environment variables.
           </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}
