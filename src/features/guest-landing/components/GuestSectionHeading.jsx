const GuestSectionHeading = ({
    eyebrow,
    title,
    description,
    align = 'center',
    light = false,
}) => {
    const isCenter = align === 'center';

    return (
        <div className={`${isCenter ? 'mx-auto text-center' : 'text-right'} max-w-3xl`}>
            <div className={`mb-4 flex items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
                <span className="h-px w-10 bg-gold/60" />
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                    {eyebrow}
                </span>
                <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className={`text-2xl font-black leading-tight sm:text-3xl lg:text-5xl ${light ? 'text-white' : 'text-primary-dark'}`}>
                {title}
            </h2>
            {description && (
                <p className={`mt-5 text-sm leading-8 sm:text-base ${light ? 'text-white/70' : 'text-brand-muted'}`}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default GuestSectionHeading;
