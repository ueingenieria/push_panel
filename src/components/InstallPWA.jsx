import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            setSupportsPWA(false);
        }
    });
  };

  if (!supportsPWA || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
        <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 relative pr-10">
            <div className="bg-blue-600 p-2 rounded-full">
                <Download className="h-5 w-5 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-sm">Instalar Panel</h3>
                <p className="text-xs text-gray-300">Acceso rápido</p>
            </div>
            <button 
                onClick={onClick}
                className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
                Instalar
            </button>
            <button onClick={() => setSupportsPWA(false)} className="absolute top-1 right-1 text-gray-500 hover:text-white">
                <X className="h-4 w-4" />
            </button>
        </div>
    </div>
  );
}