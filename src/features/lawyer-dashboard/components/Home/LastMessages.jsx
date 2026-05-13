import React from 'react';

// Dummy messages data
const dummyMessages = [
    {
        id: 1,
        name: 'أحمد السيد',
        avatar: 'https://i.pravatar.cc/150?u=ahmed_sayed',
        lastMessage: 'شكراً جزيلاً يا مستر بارك ربنا يكرمك على المجهود...',
        time: 'م 10:38',
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: 2,
        name: 'مى فاروق',
        avatar: 'https://i.pravatar.cc/150?u=mai_farouk',
        lastMessage: 'هل ممكن تأجيل ميعاد الجلسة للأسبوع القادم؟',
        time: 'م 8:39',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: 3,
        name: 'محمود عمر',
        avatar: 'https://i.pravatar.cc/150?u=mahmoud_omar',
        lastMessage: 'أنا جهزت الأوراق اللي حضرتك طلبتها...',
        time: 'أمس',
        unreadCount: 1,
        isOnline: false,
    },
    {
        id: 4,
        name: 'حمدي الوزير',
        avatar: 'https://i.pravatar.cc/150?u=hamdi_wazir',
        lastMessage: 'مساء الخير أستاذ أحمد، حبيت أستفسر عن...',
        time: 'أمس',
        unreadCount: 3,
        isOnline: false,
    },
];

const LastMessages = () => {
    return (
        <section dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">الرسائل</h2>
                    <p className="text-sm text-gray-400">لآخر الرسائل الواردة</p>
                </div>
                <button className="text-sm text-gold hover:text-gold-dark font-medium transition-colors whitespace-nowrap">
                    عرض الكل
                </button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {dummyMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className="p-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                            {/* Avatar with online indicator */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={msg.avatar}
                                    alt={msg.name}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
                                />
                                {msg.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="font-semibold text-sm text-gray-900 truncate">{msg.name}</h4>
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap mr-2">{msg.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{msg.lastMessage}</p>
                            </div>

                            {/* Unread badge */}
                            {msg.unreadCount > 0 && (
                                <span className="min-w-[20px] h-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1 flex-shrink-0">
                                    {msg.unreadCount}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LastMessages;
