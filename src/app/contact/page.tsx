'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contactData } from './contact-data';

const imageCache = new Map<string, string>();

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
      className="relative w-[250px] h-[300px] cursor-pointer group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border border-yellow-500/20 bg-black/40 backdrop-blur-sm transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? '0 0 30px rgba(250, 204, 21, 0.2), inset 0 0 20px rgba(250, 204, 21, 0.1)'
            : '0 0 15px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Border Glow Effect */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 ${isHovered ? 'border-yellow-500/60' : 'border-transparent'}`}
        />

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-xl z-20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-xl z-20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-xl z-20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/30 rounded-br-xl z-20" />

        {imageLoading && (
          <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <img
          src={cachedImageUrl}
          alt={contact.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            filter: isHovered ? 'grayscale(0%)' : 'grayscale(20%)',
            opacity: imageLoading ? 0 : 1,
          }}
          onLoad={() => setImageLoading(false)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <h3
            style={{ fontFamily: 'Metal Mania' }}
            className="text-white font-bold text-2xl mb-1 tracking-wider drop-shadow-md group-hover:text-yellow-400 transition-colors"
          >
            {contact.name}
          </h3>
          <p className="text-yellow-500/80 text-sm font-bold uppercase tracking-widest mb-3 border-b border-yellow-500/30 pb-2 inline-block">
            {contact.role}
          </p>

          <div
            className={`space-y-2 overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/link"
            >
              <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover/link:bg-yellow-500/20">
                <Phone className="w-3 h-3 text-yellow-500" />
              </div>
              <span className="font-mono text-sm">{contact.phone}</span>
            </a>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/link"
              >
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover/link:bg-yellow-500/20">
                  <Mail className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="font-mono text-sm truncate">
                  {contact.email}
                </span>
              </a>
            )}
          </div>
        </div>
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
    <div className="w-full mb-20 relative">
      <div className="mb-10 flex items-center justify-center gap-4">
        <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
        <h2
          style={{ fontFamily: 'Metal Mania' }}
          className="text-3xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]"
        >
          {title}
        </h2>
        <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
      </div>

      <div className="flex flex-wrap gap-8 justify-center px-4 max-w-7xl mx-auto">
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
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
      subName: 'The Main Arena',
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4"
    >
      <div className="mb-12 text-center">
        <h2
          style={{ fontFamily: 'Metal Mania' }}
          className="text-4xl md:text-5xl font-bold tracking-wider mb-2"
        >
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
            LOCATIONS
          </span>
        </h2>
        <p className="text-gray-400 tracking-widest text-sm uppercase">
          Find your way to the battlefield
        </p>
      </div>

      <div className="space-y-16">
        {venues.map((venue, index) => (
          <motion.div
            key={index}
            className="relative lg:grid lg:grid-cols-12 rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md"
            style={{
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Tech Decoration Lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

            <div className="lg:col-span-5 p-8 flex flex-col justify-center relative z-10">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('/profile/grid-pattern.png')] opacity-5 pointer-events-none" />

              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 w-fit">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">
                  {venue.subName}
                </span>
              </div>

              <h3
                style={{ fontFamily: 'Metal Mania' }}
                className="text-4xl font-bold text-white mb-8 tracking-wide drop-shadow-md"
              >
                {venue.name}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-yellow-500/30 transition-colors">
                    <MapPin className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                      Address
                    </p>
                    <p className="text-white leading-relaxed">
                      {venue.address}
                    </p>
                    <p className="text-xs text-yellow-500/70 mt-1 flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {venue.landmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-yellow-500/30 transition-colors">
                    <Globe className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                      Transport
                    </p>
                    <p className="text-white leading-relaxed">
                      {venue.transport}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                    Events Hosted Here
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {venue.events.map((event, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:text-yellow-200 transition-all duration-300"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 h-[400px] lg:h-full min-h-[400px] relative border-t lg:border-t-0 lg:border-l border-white/10">
              <iframe
                src={venue.mapSrc}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(100%) invert(90%) contrast(1.2)',
                }}
                allowFullScreen
                loading="lazy"
                title={`Map of ${venue.name}`}
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 hover:filter-none transition-all duration-700"
              ></iframe>

              {/* Overlay Gradient on Map */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none lg:via-black/20" />
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
    <div className="min-h-screen relative overflow-x-hidden bg-black text-white">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
      />

      {/* Dark Overlay with Blur */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-0" />

      {/* Animated Gradient Pulse similar to Profile page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.05) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      {/* Floating Elements / Easter Eggs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
              opacity: 0,
            }}
            animate={{
              x: [
                Math.random() * 1000,
                Math.random() * 1000,
                Math.random() * 1000,
              ],
              y: [
                Math.random() * 1000,
                Math.random() * 1000,
                Math.random() * 1000,
              ],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {!imagesPreloaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p
              className="text-yellow-500 tracking-widest uppercase text-sm"
              style={{ fontFamily: 'Metal Mania' }}
            >
              Establishing Connection...
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-24">
        <div className="mb-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{ fontFamily: 'Metal Mania' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-white tracking-wider drop-shadow-[0_0_25px_rgba(250,204,21,0.3)]"
            >
              CONTACT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400">
                US
              </span>
            </h1>

            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-yellow-500/50" />
              <div className="w-2 h-2 rotate-45 bg-yellow-500" />
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-yellow-500/50" />
            </div>

            <p
              style={{ fontFamily: 'Maname' }}
              className="text-gray-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed"
            >
              Initiate communication with the{' '}
              <span className="text-yellow-400 font-semibold">
                Techtrix High Council
              </span>
              . Whether for alliances, inquiries, or strategic information, our
              channels are open.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mb-16 relative z-20">
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md relative">
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-lg shadow-yellow-500/20"
              initial={false}
              animate={{
                left: activeTab === 'contacts' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
                x: activeTab === 'contacts' ? 0 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            <button
              onClick={() => setActiveTab('contacts')}
              className={`relative z-10 px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase transition-colors duration-300 ${
                activeTab === 'contacts'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team Contacts
            </button>

            <button
              onClick={() => setActiveTab('venue')}
              className={`relative z-10 px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase transition-colors duration-300 ${
                activeTab === 'venue'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Venues & Map
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
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
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
            >
              <VenueSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Spacer if needed */}
      <div className="h-24" />
    </div>
  );
}
