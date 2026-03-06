import { Link } from 'react-router-dom';

/**
 * Reusable error/status page layout.
 *
 * Props:
 *  - code:        HTTP status code (e.g. "404")
 *  - title:       short heading
 *  - description: explanation text
 *  - icon:        SVG icon JSX
 *  - errorMessage: optional server error detail to display
 *  - actions:     array of { label, to, variant } for buttons
 */
const ErrorPage = ({ code, title, description, icon, errorMessage, actions = [] }) => {
    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-brand-page p-6"
            dir="rtl"
        >
            <div className="flex flex-col items-center text-center max-w-md">
                {/* Icon */}
                <div className="w-28 h-28 rounded-full bg-primary-dark/5 flex items-center justify-center mb-6">
                    {icon}
                </div>

                {/* Status Code */}
                <span className="text-7xl font-extrabold text-primary/10 mb-2 select-none tracking-wider">
                    {code}
                </span>

                {/* Title */}
                <h1 className="text-2xl font-bold text-primary mb-3">{title}</h1>

                {/* Description */}
                <p className="text-brand-muted text-[15px] leading-relaxed mb-4 max-w-sm">
                    {description}
                </p>

                {/* Error Detail (optional) */}
                {errorMessage && (
                    <div className="w-full max-w-sm mb-6 px-4 py-3 bg-error/5 border border-error/15 rounded-xl">
                        <p className="text-error/80 text-xs font-mono text-center break-words leading-relaxed" dir="ltr">
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {actions.map((action, i) => (
                        <Link
                            key={i}
                            to={action.to}
                            className={`
                                inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                                ${action.variant === 'primary'
                                    ? 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg'
                                    : 'bg-white text-primary border border-gray-200 hover:border-primary/30 hover:bg-gray-50 shadow-sm'
                                }
                            `}
                        >
                            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                            {action.label}
                        </Link>
                    ))}
                </div>

                {/* Decorative bottom line */}
                <div className="mt-12 w-16 h-1 rounded-full bg-gold/40" />
            </div>
        </main>
    );
};

export default ErrorPage;
