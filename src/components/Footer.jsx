import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Smartphone, Instagram, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 text-gray-300 text-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

                {/* ================= Privacy & Terms ================= */}
                <section>
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Privacy & Terms
                    </h3>

                    <p className="leading-relaxed text-gray-400">
                        نحن نستخدم بيانات المحادثات والصور المرفوعة لتدريب أنظمة الذكاء الاصطناعي
                        بهدف تحسين تجربة المستخدم والتطوير المستمر للخدمات.
                        كما يتم استخدام بيانات الموقع الجغرافي لأغراض أمنية فقط.
                    </p>

                    <p className="mt-3 leading-relaxed text-gray-400">
                        في حال تم اكتشاف زائر غير مرغوب به أو نشاط مشبوه،
                        سيتم حظر الوصول تلقائيًا. وفي حال رصد أي محاولة لاستخلاص
                        بيانات من الصور أو الفيديوهات أو أي محتوى خاص،
                        سيتم اتخاذ الإجراءات القانونية اللازمة لحماية الملكية الشخصية
                        والحفاظ على سرية البيانات.
                    </p>
                </section>

                {/* ================= Laws & Regulations ================= */}
                <section>
                    <h4 className="text-md font-semibold text-white mb-3">
                        Applied Laws & Regulations
                    </h4>

                    <ul className="space-y-2 text-gray-400 list-disc list-inside">
                        <li>
                            قانون حماية البيانات الشخصية – جمهورية مصر العربية (قانون رقم 151 لسنة 2020) —
                            <a
                                href="https://www.acc.com/sites/default/files/program-materials/upload/Data%20Protection%20Law%20-%20Egypt%20-%20EN%20-%20MBH.PDF"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline ml-1"
                            >
                                Official Document
                            </a>
                        </li>

                        <li>
                            General Data Protection Regulation (GDPR) – EU Regulation 2016/679 —
                            <a
                                href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline ml-1"
                            >
                                EUR-Lex
                            </a>
                        </li>

                        <li>
                            California Consumer Privacy Act (CCPA) – Cal. Civ. Code §1798 —
                            <a
                                href="https://law.justia.com/codes/california/2018/code-civ/division-3/part-4/title-1.81.5/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline ml-1"
                            >
                                Legal Reference
                            </a>
                        </li>

                        <li>
                            Digital Millennium Copyright Act (DMCA) – 17 U.S.C. §512 —
                            <a
                                href="https://www.law.cornell.edu/uscode/text/17/512"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline ml-1"
                            >
                                Cornell Law
                            </a>
                        </li>

                        <li>
                            International Intellectual Property Protection – WIPO / Berne Convention —
                            <a
                                href="https://www.wipo.int/wipolex/en/text/283698"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline ml-1"
                            >
                                WIPO
                            </a>
                        </li>
                    </ul>
                </section>

                {/* ================= Data Security ================= */}
                <section>
                    <h4 className="text-md font-semibold text-white mb-3">
                        Data Security & Encryption
                    </h4>

                    <p className="text-gray-400 leading-relaxed">
                        يعتمد Mohamed Aly على تقنيات تشفير متقدمة،
                        حيث يتم حفظ البيانات في صورة أكواد مشفرة لضمان
                        أعلى مستويات الأمان والخصوصية.
                        لأي استفسار يخص حماية البيانات يمكن التواصل عبر:
                        <a
                            href="mailto:mohamedalyx546@gmail.com"
                            className="text-blue-400 underline ml-1"
                        >
                            mohamedalyx546@gmail.com
                        </a>
                    </p>
                </section>

                {/* ================= Development ================= */}
                <section>
                    <h4 className="text-md font-semibold text-white mb-3">
                        Development
                    </h4>

                    <p className="text-gray-400 leading-relaxed">
                        تم تطوير هذا الموقع بواسطة <strong className="text-white">Mohamed Aly</strong>.
                        تعود ملكية التصميم والبنية البرمجية وقواعد البيانات وحقوق النشر
                        إلى المطور.
                    </p>

                    <p className="mt-2 text-gray-400">
                        للحصول على خدمات المطور:
                        <a
                            href="https://protofilio-flame.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 underline ml-1"
                        >
                            Mohamed Aly Labs:for services
                        </a>
                    </p>
                </section>

                {/* ================= Contact ================= */}
                <section className="flex flex-wrap gap-6 items-center border-t border-white/10 pt-6">
                    <a
                        href="mailto:mohamedalix546@gmail.com"
                        className="flex items-center gap-2"
                    >
                        <Mail className="text-blue-400" size={18} />
                        <motion.span
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-blue-400 font-medium"
                        >
                            Email
                        </motion.span>
                    </a>

                    <a
                        href="https://wa.me/201281320192"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <Smartphone className="text-green-400" size={18} />
                        <motion.span
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-green-400 font-medium"
                        >
                            WhatsApp
                        </motion.span>
                    </a>

                    <a
                        href="https://instagram.com/m0hvmed_ali"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <Instagram className="text-pink-500" size={18} />
                        <motion.span
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-pink-500 font-medium"
                        >
                            Instagram
                        </motion.span>
                    </a>
                </section>

                {/* ================= Copyright ================= */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4">
                    <span>© {new Date().getFullYear()} Mohamed Aly. All Rights Reserved.</span>
                    <span className="flex items-center gap-1">
                        Built with <Heart size={12} className="text-rose-500 fill-rose-500" /> precision
                    </span>
                </div>
            </div>
        </footer>
    );
}
