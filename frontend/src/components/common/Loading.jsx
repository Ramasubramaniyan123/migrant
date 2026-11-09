import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-terracotta animate-spin`} />
      {text && <p className="text-grey text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-offwhite z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
