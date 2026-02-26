// ...existing code...
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Validation schema with file checks
const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const schema = yup.object().shape({
    fullName: yup.string().required('الاسم الكامل مطلوب'),
email: yup.string().email('بريد غير صحيح').required('البريد مطلوب'),
password: yup.string().min(6, 'كلمة المرور ضعيفة').required('كلمة المرور مطلوبة'),
phone: yup.string().required('رقم الهاتف مطلوب'),
licenseNo: yup.string().required('رقم الكارنيه مطلوب'),
specialization: yup.string().required('اختر التخصص'),
syndicateCard: yup
    .mixed()
    .required('صورة كارنيه النقابة مطلوبة')
    .test('fileSize', 'حجم الملف أكبر من 5 ميغابايت', (value) => {
    return value && value.length && value[0].size <= FILE_SIZE;
    })
    .test('fileType', 'نوع الملف غير مدعوم', (value) => {
    return value && value.length && SUPPORTED_TYPES.includes(value[0].type);
    }),
});

const LawyerRegister = () => {
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
});

const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('licenseNo', data.licenseNo);
    formData.append('specialization', data.specialization);
    // data.syndicateCard is a FileList
    formData.append('syndicateCard', data.syndicateCard[0]);
    
    try 
    {
    await axios.post('/api/lawyer/auth/register', formData);
    alert('تم التسجيل بنجاح!');
    //window.location.href = '/verification-pending';
    } 
    catch (err) 
    {
    alert('خطأ في الاتصال بالسيرفر' + err);
    }
};

return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
    <div style={{ flex: 1, backgroundColor: '#001529', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>المستشار - نظام المحامين</h2>
    </div>

    <div style={{ flex: 1, padding: '2rem' }} dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <h2>إنشاء حساب محامي</h2>

        <input {...register('fullName')} placeholder="الاسم الكامل" />
        <p style={{ color: 'red' }}>{errors.fullName?.message}</p>

        <input {...register('email')} placeholder="البريد الإلكتروني" />
        <p style={{ color: 'red' }}>{errors.email?.message}</p>

        <input type="password" {...register('password')} placeholder="كلمة المرور" />
        <p style={{ color: 'red' }}>{errors.password?.message}</p>

        <input {...register('phone')} placeholder="رقم الهاتف" />
        <p style={{ color: 'red' }}>{errors.phone?.message}</p>

        <input {...register('licenseNo')} placeholder="رقم الكارنيه" />
        <p style={{ color: 'red' }}>{errors.licenseNo?.message}</p>

        <select {...register('specialization')}>
            <option value="">اختر التخصص</option>
            <option value="criminal">جنائي</option>
            <option value="civil">مدني</option>
        </select>
        <p style={{ color: 'red' }}>{errors.specialization?.message}</p>

        <div style={{ border: '2px dashed #ccc', padding: '12px', marginTop: '10px' }}>
            <p>ارفع صورة كارنيه النقابة (JPEG, PNG, PDF) - حتى 5MB</p>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('syndicateCard')} />
            <p style={{ color: 'red' }}>{errors.syndicateCard?.message}</p>
        </div>

        <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '10px' }} disabled={isSubmitting}>
            {isSubmitting ? 'جارٍ الإرسال...' : 'تسجيل البيانات'}
        </button>
        </form>
    </div>
    </div>
);
};

export default LawyerRegister;
// ...existing code...

