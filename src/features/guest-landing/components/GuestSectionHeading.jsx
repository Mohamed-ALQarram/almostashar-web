const GuestSectionHeading = ({ eyebrow, title, description, align = 'center', light = false }) => {
    const isCenter = align === 'center';

    return (
        <div className={`${isCenter ? 'mx-auto text-center' : 'text-right'} max-w-2xl`}>
            <span className="section-kicker">{eyebrow}</span>
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
