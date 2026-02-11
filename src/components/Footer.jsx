import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Smartphone, Instagram, X } from 'lucide-react';

/**
 * Footer + Privacy modal + Header persistent link
 * - أيقونات: Mail = أزرق، WhatsApp (Smartphone) = أخضر، Instagram = بِنَفسَجي/وردي (كما كان)
 * - أسماء الحسابات لها نبضة (scale) مع لونها
 * - "ASCII" badge ينبض باللون الأبيض
 * - زر Privacy & Terms ثابت في الهيدر يفتح modal يحتوي على نص الخصوصية والشروط
 *
 * عدّل الألوان أو النصوص حسب رغبتك.
 */

export function PrivacyAndTermsContent() {
    return (
        <div id="privacy-terms" className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4">Privacy & Terms</h2>

            <p>
                نحن نستخدم بيانات المحادثات والصور المرفوعة لتدريب الذكاء الاصطناعي بغرض راحة المستخدم والتطوير المستمر.
                كما تُستخدم المعلومات الموقع الجغرافي لأغراض أمنية وحماية الحسابات.
            </p>

            <p>
                في حال تم اكتشاف زائر غير مرغوب فيه فسيتم حظره تلقائياً من التطبيق. وفي حال رُصِدت أي محاولة لاستخراج المعلومات من الصور أو الفيديوهات
                أو أي مواد أخرى سيتم اتخاذ الإجراءات القانونية لحماية الملكية الشخصية والحفاظ على سرية البيانات وفقاً للقوانين والاتفاقيات الدولية.
            </p>

            <h3 className="mt-4 font-semibold">المنظمات والقوانين ذات الصلة</h3>
            <ul>
                <li>قانون حماية البيانات الشخصية - جمهورية مصر العربية: <strong>قانون رقم 151 لسنة 2020</strong>.</li>
                <li>اللوائح العامة لحماية البيانات - الاتحاد الأوروبي: <strong>Regulation (EU) 2016/679 (GDPR)</strong>.</li>
                <li>قانون خصوصية المستهلك بولاية كاليفورنيا - الولايات المتحدة: <strong>California Consumer Privacy Act (CCPA)</strong> (مثال: Cal. Civ. Code § 1798.100 وما بعدها).</li>
                <li>قانون حماية حقوق النشر الرقمي - الولايات المتحدة: <strong>DMCA (17 U.S.C. § 512)</strong> وإجراء إخطار الإزالة.</li>
                <li>اتفاقيات وحقوق الملكية الفكرية الدولية: مثل اتفاقية <strong>Berne Convention</strong> والجهات الدولية ذات الصلة (WIPO).</li>
            </ul>

            <h3 className="mt-4 font-semibold">Development</h3>
            <p>
                تم تطوير هذا الموقع من قبل <strong>Mohamed Aly</strong>، وتعود ملكية البناء وقواعد البيانات وحقوق النشر على الاستضافات إليه.
                للتواصل انظر أسفل الموقع لرؤية الطرق المتاحة.
            </p>

            <h3 className="mt-3 font-semibold">للتبليغ والاقتراحات</h3>
            <p>
                للإبلاغ عن أي مشكلة أو تقديم اقتراحات الرجاء مراسلة <strong>01558741136</strong> على واتساب — حيث نتمنى دائماً رضا العميل والإتقان التام.
            </p>

            <h3 className="mt-3 font-semibold">التشفير وخصوصية البيانات</h3>
            <p>
                يعتمد Mohamed Aly في استخدام الخصوصية والبيانات على تقنيات تشفير حيث تُحفظ البيانات على هيئة أكواد مشفّرة لضمان راحة العميل من جميع أنواع البيانات.
                للتأكد من أمان بياناتكم الرجاء التواصل على: <a href="mailto:mohamedalyx546@gmail.com">mohamedalyx546@gmail.com</a>
            </p>

            <p className="mt-3">
                للحصول على خدمات المطور زوروا: <a href="https://protofilio-flame.vercel.app/" target="_blank" rel="noreferrer">https://protofilio-flame.vercel.app/</a>
            </p>

            <p className="mt-6 text-sm opacity-80">
                نشكر تفهمكم ونتمنى لكم السعادة دائماً.
            </p>
        </div>
    );
}

export function HeaderPrivacyLink() {
    // زر ثابت في الهيدر — سيظل ظاهر حتى لو القوائم الأخرى مغلقة
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Fixed link — ضع هذا المكوّن داخل الـ layout/header لديك أو استورد واستخدمه في الهيدر */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={() => setOpen(true)}
                    className="bg-white/6 backdrop-blur-sm text-white px-3 py-2 rounded-2xl border border-white/10 shadow-sm hover:scale-105 transition-transform"
                >
                    Privacy & Terms
                </button>
            </div>

            {/* Modal بسيط يفتح المحتوى */}
            {open && (
                <div className="fixed inset-0 z-60 flex items-start justify-center p-6 bg-black/60">
                    <div className="bg-slate-900 text-slate-100 max-w-3xl w-full rounded-2xl p-6 relative shadow-2xl overflow-auto" style={{ maxHeight: '85vh' }}>
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 bg-white/5 p-1 rounded"
                            aria-label="Close privacy modal"
                        >
                            <X size={18} />
                        </button>

                        <PrivacyAndTermsContent />
                    </div>
                </div>
            )}
        </>
    );
}

export default function Footer() {
    // contact items with their colors
    const contacts = [
        {
            id: 'email',
            label: 'Email',
            href: 'mailto:mohamedalyx546@gmail.com',
            Icon: Mail,
            colorClass: 'text-blue-400',
            colorHex: '#3b82f6',
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            href: 'https://wa.me/2015558741136',
            Icon: Smartphone,
            colorClass: 'text-green-400',
            colorHex: '#25D366',
        },
        {
            id: 'instagram',
            label: 'Instagram',
            href: 'https://instagram.com/m0hvmed_ali',
            Icon: Instagram,
            colorClass: 'text-pink-500',
            colorHex: '#ec4899',
        },
    ];

    return (
        <footer className="w-full py-8 mt-auto backdrop-blur-md bg-black/80 border-t border-white/10 text-gray-300 text-sm z-30">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Copyright */}
                <div className="flex items-center gap-1 opacity-90">
                    <span>© {new Date().getFullYear()} Mohamed Aly. All Rights Reserved.</span>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2">
                    <span>Site</span>
                    <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                    <span>..<span className="font-bold text-pink-400">Ducky</span></span>
                </div>

                {/* Contact Links */}
                <div className="flex gap-6 items-center">
                    {contacts.map((c) => (
                        <a
                            key={c.id}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 hover:opacity-90 transition-colors duration-300 group`}
                        >
                            <c.Icon size={18} className={`group-hover:scale-110 transition-transform ${c.colorClass}`} />
                            {/* اسم الحساب بينبض بلونه */}
                            <motion.span
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.4 }}
                                style={{ color: c.colorHex, fontWeight: 600 }}
                            >
                                {c.label}
                            </motion.span>
                        </a>
                    ))}

                    {/* ASCII badge — ينبض باللون الأبيض */}
                    <div className="flex items-center gap-2 ml-2">
                        <motion.span
                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.06, 1] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                            className="px-2 py-1 rounded text-xs font-medium border border-white/10 bg-white/6 text-white"
                        >
                            Mohamed Aly
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Development section داخل الفوتر */}
            <div className="max-w-7xl mx-auto px-6 mt-6 text-xs text-gray-400">
                <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                        <div className="font-semibold">Development</div>
                        <div className="mt-1">
                            تم تطوير هذا الموقع من قبل <strong>Mohamed Aly</strong>. ملكية البناء وقواعد البيانات وحقوق النشر تعود إليه.
                        </div>
                        <div className="mt-1">
                            للتواصل أو التحقق من أمان البيانات راسلنا: <a href="mailto:mohamedalyx546@gmail.com" className="underline">mohamedalyx546@gmail.com</a>
                        </div>
                        <div className="mt-1">
                            للابلاغ أو الاقتراح: <a href="https://wa.me/2015558741136" target="_blank" rel="noreferrer" className="underline">01558741136 (WhatsApp)</a>
                        </div>
                        <div className="mt-1">
                            بورتفوليو المطور: <a href="https://protofilio-flame.vercel.app/" target="_blank" rel="noreferrer" className="underline">protofilio-flame.vercel.app</a>
                        </div>
                    </div>

                    <div className="text-right opacity-90">
                        <div>يعتمد Mohamed Aly على تقنيات تشفير لحفظ البيانات على هيئة أكواد مشفّرة.</div>
                        <div className="mt-2">نشكر تفهمكم ونتمنى لكم السعادة دائماً.</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
