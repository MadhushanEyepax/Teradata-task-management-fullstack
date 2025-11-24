const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = "",
  padding = "default",
  shadow = "default",
  hover = false,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  };

  const shadowClasses = {
    none: "",
    small: "shadow-sm",
    default: "shadow-md",
    large: "shadow-lg",
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200
        ${shadowClasses[shadow]}
        ${hover ? "hover:shadow-xl transition-shadow duration-200" : ""}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {headerAction && <div className="ml-4">{headerAction}</div>}
          </div>
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div
          className={`border-t border-gray-200 bg-gray-50 rounded-b-lg ${paddingClasses[padding]}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
