import React from 'react';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="relative w-full min-h-screen bg-black text-white px-8">
      <Image
        src="/Footer/Background.jpg"
        alt="Background"
        fill
        className="object-cover opacity-90"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        {/* Main content grid (shifted up) */}
        <div className="transform -translate-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-[250px]">
            {/* Left section - The Trials Map */}
            <div>
              <h3
                style={{ fontFamily: 'Metal Mania' }}
                className="text-yellow-400 text-xl font-bold mb-4 uppercase tracking-wide"
              >
                The Trials Map
              </h3>
              <div style={{ fontFamily: 'Maname' }} className="space-y-2">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  <span className="text-lg ">T</span>
                  <span>Legacy</span>
                </button>
                <div className="text-gray-300 hover:text-white cursor-pointer transition">
                  Events
                </div>
                <div className="text-gray-300 hover:text-white cursor-pointer transition">
                  Hall of Fame
                </div>
              </div>
            </div>

            {/* Middle section - Contacts */}
            <div>
              <h3
                style={{ fontFamily: 'Metal Mania' }}
                className="text-yellow-400 text-xl font-bold mb-4 uppercase tracking-wide"
              >
                Contacts
              </h3>
              <div style={{ fontFamily: 'Maname' }} className="space-y-6">
                <div>
                  <h4 className="text-white  mb-2">ABC KUMAR</h4>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">📞</span>
                      <span>+91 XXX XXX XXXX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">✉️</span>
                      <span>abc@eor2026.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">XYZ SHARMA</h4>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">📞</span>
                      <span>+91 XXX XXX XXXX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">✉️</span>
                      <span>xyz@eor2026.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section - The Iron Bank */}
            <div>
              <h3
                style={{ fontFamily: 'Metal Mania' }}
                className="text-yellow-400 text-xl font-bold mb-4 uppercase tracking-wide"
              >
                The Iron Bank
              </h3>
              <div
                style={{ fontFamily: 'Maname' }}
                className="space-y-4 text-sm"
              >
                <div>
                  <h4 className="text-white  mb-1">Funded By</h4>
                  <p className="text-gray-300 text-xs uppercase">
                    RCCIIIT Student Welfare
                    <br />
                    Committee
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Technical Credits
                  </h4>
                  <p className="text-gray-300 text-xs">
                    Techtrix Technical Team 2026
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Special Thanks
                  </h4>
                  <p className="text-gray-300 text-xs uppercase">
                    All participating colleges
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section (48px below the main content) */}
          <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-400">
              © 2026 TECHTRIX TECH FEST. All rights reserved.
            </div>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
