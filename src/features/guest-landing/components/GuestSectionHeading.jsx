const GuestSectionHeading = ({ eyebrow, title, description, align = 'center', light = false }) => {
    const isCenter = align === 'center';

    return (
        <div className={`${isCenter ? 'mx-auto text-center' : 'text-right'} max-w-3xl`}>
            <div className={`flex items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
                <span className="gold-line" />
                <span className="section-kicker">{eyebrow}</span>
            </div>
            <h2 className={`section-heading ${light ? '!text-white' : ''}`}>{title}</h2>
            {description && (
                <p className={`section-subtitle ${isCenter ? 'mx-auto' : ''} ${light ? '!text-white/70' : ''}`}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default GuestSectionHeading;
