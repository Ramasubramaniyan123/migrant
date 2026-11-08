export default function AdminFooter() {
  const resetDemoData = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('admin_portal'));
    keys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };
  return <footer className="border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
      <div className="flex items-center justify-center gap-2">
        <span>MigrantConnect Admin · Prototype mode — data is simulated and stored locally</span>
        <button
          type="button"
          onClick={resetDemoData}
          className="text-slate-500 underline hover:text-blue-600"
        >
          Reset Demo Data
        </button>
      </div>
    </footer>;
}
