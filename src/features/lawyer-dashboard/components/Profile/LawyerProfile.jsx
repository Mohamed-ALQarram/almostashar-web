import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../auth';
import { useLawyerProfile, useSpecializations, useEditProfile } from '../../hooks/useLawyerProfile';
import usePresignedUrl from '../../hooks/usePresignedUrl';
import { uploadChatDocument } from '../../api/documentUploadApi';
import {
    Pencil, Camera, User, Briefcase, ShieldCheck,
    Check, AlertCircle, Loader2, X
} from 'lucide-react';

const EMPTY_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// ─── Helpers ────────────────────────────────────────────────────────
const unwrap = (res) => res?.data ?? res ?? null;

const buildForm = (p) => {
    const names = p?.fullName?.trim().split(' ') ?? [];
    return {
        firstName: p?.firstName || names[0] || '',
        lastName: p?.lastName || names.slice(1).join(' ') || '',
        bio: p?.bio || '',
        about: p?.about || '',
        yearsOfExperience: p?.yearsOfExperience || 0,
        specializationIds: p?.specializations?.map(s => s.id) || [],
        profileImage: p?.profileImage || '',
    };
};

// ─── Component ──────────────────────────────────────────────────────
const LawyerProfile = () => {
    const { user, updateUser } = useAuthStore();
    const lawyerId = user?.id || user?.lawyerId;

    const { data: rawProfile, isLoading: isProfileLoading } = useLawyerProfile(lawyerId);
    const { data: rawSpecs } = useSpecializations();
    const { mutate: updateProfile, isPending } = useEditProfile();

    const profile = unwrap(rawProfile) || {};
    const specializations = (() => {
        const d = unwrap(rawSpecs);
        return Array.isArray(d) ? d : [];
    })();

    // ── Local state ─────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState(buildForm(null));
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imagePath, setImagePath] = useState('');
    const previewRef = useRef(null);

    const { url: resolvedImageUrl } = usePresignedUrl(imagePath);
    const profileImageSrc = previewUrl || resolvedImageUrl || EMPTY_IMAGE;

    // Sync imagePath when profile data loads (for view mode)
    useEffect(() => {
        if (profile.profileImage && !isEditing) {
            setImagePath(profile.profileImage);
        }
    }, [profile.profileImage, isEditing]);

    // ── Helpers ─────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const clearPreview = () => {
        if (previewRef.current) {
            URL.revokeObjectURL(previewRef.current);
            previewRef.current = null;
        }
        setPreviewUrl(null);
    };

    // ── Handlers ────────────────────────────────────────────────────
    const handleEditToggle = () => {
        if (!isEditing) {
            const next = buildForm(profile);
            setFormData(next);
            setImagePath(next.profileImage);
            setIsEditing(true);
        } else {
            clearPreview();
            const next = buildForm(profile);
            setFormData(next);
            setImagePath(next.profileImage);
            setIsEditing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'yearsOfExperience' ? (parseInt(value, 10) || 0) : value,
        }));
    };

    const handleSpecToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            specializationIds: prev.specializationIds.includes(id)
                ? prev.specializationIds.filter(s => s !== id)
                : [...prev.specializationIds, id],
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        clearPreview();
        const localUrl = URL.createObjectURL(file);
        previewRef.current = localUrl;
        setPreviewUrl(localUrl);

        try {
            const res = await uploadChatDocument(file);
            const url = typeof res === 'string' ? res : (res?.fileUrl || res?.url || '');
            if (!url) throw new Error('No URL in upload response');
            setFormData(prev => ({ ...prev, profileImage: url }));
            setImagePath(url);
        } catch (err) {
            console.error('Image upload failed:', err);
            clearPreview();
        } finally {
            e.target.value = '';
        }
    };

    const handleSubmit = () => {
        if (isPending) return;
        setToast(null);

        updateProfile(formData, {
            onSuccess: (res) => {
                const updated = unwrap(res) || {};
                const nextImage = updated.profileImage || formData.profileImage;

                setIsEditing(false);
                clearPreview();

                if (nextImage) {
                    setFormData(prev => ({ ...prev, profileImage: nextImage }));
                    setImagePath(nextImage);
                    updateUser({ profileImage: nextImage });
                }

                showToast('success', 'تم حفظ التغييرات بنجاح');
            },
            onError: () => {
                showToast('error', 'حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.');
            },
        });
    };

    // ── Loading ─────────────────────────────────────────────────────
    if (isProfileLoading || !lawyerId) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────
    return (
        <div className="space-y-6" dir="rtl">
            {/* Toast */}
            {toast && (
                <div className={`p-3 rounded-xl text-sm font-medium text-center animate-fadeIn flex items-center justify-center gap-2 ${toast.type === 'success'
                    ? 'bg-success/10 border border-success/20 text-success'
                    : 'bg-error/10 border border-error/20 text-error'
                    }`}>
                    {toast.type === 'success'
                        ? <Check className="w-5 h-5" />
                        : <AlertCircle className="w-5 h-5" />}
                    {toast.message}
                </div>
            )}

            {/* ── Header Card ──────────────────────────────────────── */}
            <div className="bg-primary text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-50 pointer-events-none" />

                {/* Edit Toggle — z-20 to sit above the z-10 content area */}
                <button
                    type="button"
                    onClick={handleEditToggle}
                    aria-label={isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
                    className="absolute top-4 left-4 z-20 bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                >
                    <Pencil className="w-5 h-5 text-white pointer-events-none" />
                </button>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={profileImageSrc}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-gold object-cover"
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-gold hover:bg-gold-dark p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                                <Camera className="w-4 h-4 text-white pointer-events-none" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <div className="text-center md:text-right flex-1">
                        {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="bg-white/10 border border-white/20 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-gold"
                                    placeholder="الاسم الأول"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="bg-white/10 border border-white/20 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-gold"
                                    placeholder="اسم العائلة"
                                />
                            </div>
                        ) : (
                            <h1 className="text-2xl font-bold text-white mb-1">
                                {profile.fullName || `${formData.firstName} ${formData.lastName}`.trim()}
                            </h1>
                        )}

                        {isEditing ? (
                            <input
                                type="text"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-gold"
                                placeholder="الوصف القصير (مثال: محامي نقض | مستشار قانوني)"
                            />
                        ) : (
                            <p className="text-gold-light text-sm mb-2">{profile.bio || 'محامي ومستشار قانوني'}</p>
                        )}

                        <div className="mt-2 inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                            <ShieldCheck className="w-4 h-4 text-gold" />
                            <span>محامي معتمد من النقابة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Grid Layout ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                        <h2 className="font-bold text-lg text-primary flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gold" />
                            نبذة والمؤهلات
                        </h2>

                        {isEditing ? (
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows="5"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 text-sm focus:outline-none focus:border-gold"
                                placeholder="اكتب نبذة عنك وعن مؤهلاتك..."
                            />
                        ) : (
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {profile.about || 'لا توجد نبذة تعريفية.'}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center">
                            <p className="text-gold text-2xl font-bold">{profile.servedClientsCount || 0}</p>
                            <p className="text-gray-500 text-xs mt-1">عملاء تمت خدمتهم</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center">
                            <p className="text-gold text-2xl font-bold">{profile.completedCasesCount || 0}</p>
                            <p className="text-gray-500 text-xs mt-1">قضايا مكتملة</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center">
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    className="w-16 mx-auto bg-gray-50 border border-gray-200 rounded py-0.5 px-1 text-center text-gold font-bold text-lg"
                                />
                            ) : (
                                <p className="text-gold text-2xl font-bold">{profile.yearsOfExperience || 0}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">سنة خبرة</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar (1/3) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                        <h2 className="font-bold text-lg text-primary flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-gold" />
                            تخصصاتي الدقيقة
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                                specializations.map(spec => (
                                    <button
                                        type="button"
                                        key={spec.id}
                                        onClick={() => handleSpecToggle(spec.id)}
                                        className={`text-xs px-3 py-1.5 rounded-full transition-colors ${formData.specializationIds.includes(spec.id)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {spec.arabicTitle || spec.title}
                                    </button>
                                ))
                            ) : (
                                profile.specializations?.map(spec => (
                                    <span key={spec.id} className="text-xs bg-primary text-white px-3 py-1.5 rounded-full">
                                        {spec.arabicTitle || spec.title}
                                    </span>
                                )) || <p className="text-gray-400 text-sm">لم يتم تحديد تخصصات بعد.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleEditToggle}
                        disabled={isPending}
                        className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm border border-gray-200 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {isPending
                            ? <Loader2 className="w-5 h-5 animate-spin" />
                            : <Check className="w-5 h-5" />}
                        حفظ التغييرات
                    </button>
                </div>
            )}
        </div>
    );
};

export default LawyerProfile;