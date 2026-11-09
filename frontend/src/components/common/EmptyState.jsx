import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-navy" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      {description && <p className="text-grey max-w-md mb-6">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
