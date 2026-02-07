import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  { id: 1, src: '/bb.jpeg' },
  { id: 2, src: 'h.jpeg' },
  { id: 3, src: '/k.jpeg' },
  { id: 4, src: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg' },
  { id: 5, src: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg' },
  { id: 6, src: '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg' },
  { id: 7, src: '/WhatsApp Image 2026-02-07 at 5.35.32 PM.jpeg' },
  { id: 8, src: '/WhatsApp Image 2026-02-07 at 5.37.0 PM.jpeg' },
  { id: 9, src: '/WhatsApp Image 2026-02-07 at 5.37.08 PM.jpeg' },

  { id: 10, src: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg' },

  { id: 11, src: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg' },

  { id: 12, src: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg' },

  { id: 13, src: '/WhatsApp Image 2026-02-07 at 5.54.22 PM.jpeg' },

  { id: 14, src: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg' },
  { id: 15, src: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg' },

  { id: 16, src: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg' },

  { id: 17, src: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg' },
];


export default function PhotoGallery() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filteredPhotos = filter === 'all'
    ? photos
    : photos.filter(photo => photo.date.includes(filter));

  return (
    <div className="p-4">


      {/* شبكة الصور */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredPhotos.map(photo => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03 }}
            className="overflow-hidden relative rounded-xl shadow-lg cursor-pointer group"
            onClick={() => setSelected(photo)}
          >
            {/* الصورة نفسها */}
            <img
              src={photo.src}
              alt={photo.caption}
              className="object-cover w-full h-full rounded-xl aspect-square"
            />

            {/* Overlay للنصوص */}
            <div className="flex absolute inset-0 flex-col justify-end p-3 bg-gradient-to-t to-transparent from-black/30">
              <h3 className="font-bold text-white">{photo.caption}</h3>
              <p className="text-sm text-rose-200">{photo.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zoom / Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected.src}
              alt={selected.caption}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
