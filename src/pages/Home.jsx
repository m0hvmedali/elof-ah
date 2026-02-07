import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleDashed, Info, Heart, Smile, Paperclip, Github, Facebook, Instagram, Mail } from 'lucide-react';
import Header from '../components/header';
export default function HomePage() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-purple-900 dark:to-pink-800 dark:text-gray-100">

      {/* الهيدر */}
      <Header />

      {/* المنطقة الرئيسية */}
      <main className="flex flex-col flex-1 justify-center items-center px-6 space-y-8 text-center">


        <p className="pt-20 text-xl text-rose-700 tracking-tightpt-20 dark:text-pink-300 animate-fadeIn">
          اوقاتنا وذكرياتنا ولحظتنا سوا صورنا و كل لحظه كنافيها مع بعض محفوظه هنا عشان مفيش حاجه منهم ينفع تضيع        </p>
        {/* بطاقات الميزات */}
        <div className="grid grid-cols-1 gap-6 mt-6 w-full max-w-4xl md:grid-cols-3">
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg dark:bg-gray-800">
            <Heart size={32} className="mb-2 text-rose-500" />
            <h3 className="mb-1 text-lg font-semibold"> always together </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Our best times together were all our times together.            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg dark:bg-gray-800">
            <Paperclip size={32} className="mb-2 text-blue-500" />
            <h3 className="mb-1 text-lg font-semibold"> save forever  </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Preserving our memories together            </p>
          </div>
        </div>

        <Link
          to="/memories"
          className="gap-2 px-8 text-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-2xl transition transform hover:scale-105 hover:shadow-pink-400/50"
        >
          Discover your lovingly made site
        </Link>
      </main>

      {/* الفوتر */}
      <footer role="contentinfo" className="text-gray-200 bg-gradient-to-tr from-gray-900 to-gray-800">
        <div className="px-6 mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Brand / copyright */}


            {/* Links */}



          </div>

          {/* Divider */}
          <div className="py-5 pt-6 mt-6 text-center border-t border-white/6 md:text-left">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <p className="text-xs text-gray-400">
                © {year} all rights reserved to and develope by mohamed aly
                <br />

              </p>

              <p className="text-xs text-gray-400">
                Our special site is powered by React, Next.js, and Tailwind support backend with supabase .
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
