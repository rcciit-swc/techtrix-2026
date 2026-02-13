'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { contactData } from './contact-data';

const imageCache = new Map<string, string>();

const clearImageCache = () => {
  imageCache.forEach((blobUrl) => {
    if (blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
  });
  imageCache.clear();
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('img_cache_')) {
      localStorage.removeItem(key);
    }
  });
};

const cacheImage = async (url: string): Promise<string> => {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  const cachedData = localStorage.getItem(`img_cache_${url}`);
  if (cachedData) {
    if (cachedData.startsWith('data:')) {
      imageCache.set(url, cachedData);
      return cachedData;
    }
  }

  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'force-cache',
    });
    const blob = await response.blob();
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        try {
          if (dataUrl.length < 5 * 1024 * 1024) {
            localStorage.setItem(`img_cache_${url}`, dataUrl);
          }
        } catch (e) {
          console.warn('LocalStorage full, using memory cache only');
        }
        resolve(dataUrl);
      };
    });
    reader.readAsDataURL(blob);

    const dataUrl = await dataUrlPromise;
    imageCache.set(url, dataUrl);

    return dataUrl;
  } catch (error) {
    console.error('Failed to cache image:', url, error);
    return url;
  }
};

const ContactCard = ({ contact }: { contact: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cachedImageUrl, setCachedImageUrl] = useState<string>(contact.image);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    cacheImage(contact.image).then((url) => {
      setCachedImageUrl(url);
      setImageLoading(false);
    });
  }, [contact.image]);

  return (
    <motion.div
      className="relative w-full max-w-sm h-[450px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-red-600/40 shadow-xl"
        style={{
          boxShadow: isHovered
            ? '0 20px 60px rgba(220, 38, 38, 0.5), 0 0 40px rgba(30, 64, 175, 0.3)'
            : '0 10px 30px rgba(220, 38, 38, 0.3), 0 0 20px rgba(30, 64, 175, 0.2)',
        }}
      >
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] to-[#000d21] animate-pulse" />
        )}

        <img
          src={cachedImageUrl}
          alt={contact.name}
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? 'brightness(1.1) saturate(1.2)'
              : 'brightness(1)',
            transition: 'filter 0.5s ease',
            opacity: imageLoading ? 0 : 1,
          }}
          onLoad={() => setImageLoading(false)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div
          className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ${
            isHovered ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}
        >
          <h3
            style={{ fontFamily: 'Metal Mania' }}
            className="text-white font-bold text-3xl text-center mb-2 drop-shadow-lg"
          >
            {contact.name}
          </h3>
          <p className="text-red-500 text-xl text-center mb-3 font-semibold">
            {contact.role}
          </p>
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center justify-center gap-2 text-gray-200 text-lg"
          >
            <Phone className="w-4 h-4" />
            <span className="font-mono">{contact.phone}</span>
          </a>
        </div>

        {isHovered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black/90 via-red-900/80 to-blue-900/90 backdrop-blur-sm">
            <div className="text-center">
              <h3
                style={{ fontFamily: 'Metal Mania' }}
                className="text-white font-bold text-2xl mb-3"
              >
                {contact.name}
              </h3>
              <p className="text-red-400 text-base mb-4 font-semibold">
                {contact.role}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <p className="text-white text-base tracking-wide font-mono">
                    {contact.phone}
                  </p>
                </div>

                {contact.email && (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-red-400" />
                    <p className="text-white text-sm">{contact.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-red-500 opacity-70 rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-red-500 opacity-70 rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-red-500 opacity-70 rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-red-500 opacity-70 rounded-br-lg"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ContactSection = ({
  title,
  contacts,
}: {
  title: string;
  contacts: any[];
}) => {
  return (
    <div className="w-full mb-16">
      <div className="mb-10">
        <h2
          style={{ fontFamily: 'Metal Mania' }}
          className="text-3xl md:text-4xl font-bold text-center relative"
        >
          <span className="text-red-500 inline-block">{title}</span>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-3 rounded-full" />
        </h2>
      </div>

      <div className="flex flex-wrap gap-8 justify-center px-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ContactCard contact={contact} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VenueSection = () => {
  const venues = [
    {
      name: 'RCCIIT Campus',
      subName: 'The Fortress of Strategy',
      address: 'Canal South Road, Beliaghata, Kolkata - 700015',
      landmark: 'Near Paribesh Bhavan / Narkeldanga Police Station',
      transport: 'Nearest Metro: Sealdah / Phoolbagan',
      events: [
        'Table Tennis',
        'Chess',
        'Carrom',
        'Esports (BGMI/Valo)',
        'Badminton',
      ],
      mapSrc:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.6383827402633!2d88.39673931495925!3d22.56012898518931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02743203255595%3A0x9c37b30c00660fab!2sRCC%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl mx-auto px-4"
    >
      <div className="mb-12 text-center">
        <h2
          style={{ fontFamily: 'Metal Mania' }}
          className="text-4xl md:text-5xl font-bold relative tracking-wider"
        >
          <span className="text-red-500 inline-block uppercase">
            Realms of Battle
          </span>
          <div className="text-blue-400 text-lg md:text-xl mt-2 tracking-[0.2em] uppercase font-semibold">
            Venues & Locations
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-4 rounded-full" />
        </h2>
      </div>

      <div className="space-y-16">
        {venues.map((venue, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch ${
              index % 2 !== 0 ? 'lg:direction-rtl' : ''
            }`}
          >
            <div
              className={`lg:col-span-5 rounded-xl overflow-hidden border border-red-600/50 relative group bg-[#001a3d]/80 backdrop-blur-md flex flex-col`}
              style={{
                boxShadow:
                  '0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(220, 38, 38, 0.1)',
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-blue-700 to-red-600" />

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="mb-2 text-red-500 font-bold tracking-widest text-sm uppercase">
                  {venue.subName}
                </div>

                <h3
                  style={{ fontFamily: 'Metal Mania' }}
                  className="text-3xl font-bold text-white mb-6 tracking-wide"
                >
                  {venue.name}
                </h3>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Address</p>
                      <p className="text-sm opacity-80">{venue.address}</p>
                      <p className="text-xs text-red-400 mt-1 italic">
                        Landmark: {venue.landmark}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Transport</p>
                      <p className="text-sm opacity-80">{venue.transport}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-white/10 mt-4">
                    <div className="w-5 h-5 text-blue-500 mt-1 shrink-0">
                      🏆
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-2">
                        Events Hosted
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {venue.events.map((event, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-red-900/30 border border-red-600/30 text-gray-200"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-7 rounded-xl overflow-hidden border-2 border-red-500/30 shadow-2xl h-80 lg:h-auto min-h-[350px] relative`}
            >
              <div className="absolute inset-0 bg-red-900/10 z-10 pointer-events-none mix-blend-overlay" />
              <iframe
                src={venue.mapSrc}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(30%) contrast(1.2) hue-rotate(-15deg)',
                }}
                allowFullScreen
                loading="lazy"
                title={`Map of ${venue.name}`}
                referrerPolicy="no-referrer-when-downgrade"
                className="hover:filter-none transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'venue'>('contacts');
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    const preloadAllImages = async () => {
      const allImageUrls = contactData.flatMap((section) =>
        section.contacts.map((contact) => contact.image)
      );
      const cachePromises = allImageUrls.map((url) => cacheImage(url));

      try {
        await Promise.all(cachePromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesPreloaded(true);
      }
    };

    preloadAllImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#450a0a] to-[#1e3a8a]">
      {!imagesPreloaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <p
              className="mt-4 text-red-500"
              style={{ fontFamily: 'Metal Mania' }}
            >
              Loading Images...
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-16 text-center">
            <h1
              style={{ fontFamily: 'Metal Mania' }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            >
              CONTACT US
            </h1>
            <p
              style={{ fontFamily: 'Maname' }}
              className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Need information about GOT'26? Contact our team members below for
              any queries regarding events, sponsorships, or general
              information.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div
              className="flex gap-3 bg-black/40 rounded-xl p-2 border-2 border-red-600/40 backdrop-blur-md"
              style={{
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              <motion.button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-2.5 rounded-lg font-bold text-base transition-all ${
                  activeTab === 'contacts'
                    ? 'bg-red-600 text-white'
                    : 'text-red-400 hover:text-red-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={
                  activeTab === 'contacts'
                    ? {
                        boxShadow: '0 0 25px rgba(220, 38, 38, 0.6)',
                      }
                    : {}
                }
              >
                Team Contacts
              </motion.button>

              <motion.button
                onClick={() => setActiveTab('venue')}
                className={`px-6 py-2.5 rounded-lg font-bold text-base transition-all ${
                  activeTab === 'venue'
                    ? 'bg-red-600 text-white'
                    : 'text-red-400 hover:text-red-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={
                  activeTab === 'venue'
                    ? {
                        boxShadow: '0 0 25px rgba(220, 38, 38, 0.6)',
                      }
                    : {}
                }
              >
                Venues & Location
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'contacts' && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
                {contactData.map((section, index) => (
                  <ContactSection
                    key={index}
                    title={section.name}
                    contacts={section.contacts}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'venue' && (
              <motion.div
                key="venue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VenueSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
