const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-grey hover:text-charcoal hover:border-gray-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-5 h-5 inline-block mr-2" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
