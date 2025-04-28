import React from 'react';
import { Building, MapPin, Phone, Mail, FileText, Info, Clock, Calendar,  Users, Hammer, Handshake } from 'lucide-react';
import FacebookIcon from '@/components/common/icons/facebook-icon';
import FollowerIcons from './follower-icons';


export default function FacebookBusinessProfile() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Added Facebook Header Bar */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-500">Facebook Profil podjetja</h2>
        <FacebookIcon className="h-6 w-6" />
      </div>
      
      {/* Header with Cover Image and Logo */}
      <div className="relative h-32"> 
        <img 
          src="/gallery/diamantno-vrtanje-steno.jpeg" 
          alt="Slika pasice podjetja" 
          className="w-full h-full object-cover"
        />
        <div className="absolute z-20 -bottom-12 left-4 h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <img src="/logo.png" alt="Logotip podjetja" className="object-cover" />
          </div>
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="pt-14 px-4 pb-4">
        <h1 className="text-xl font-bold text-gray-800">Rezanje in vrtanje betona, Ziherl Iztok s.p.</h1>
        
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <Users size={16} className="mr-1 text-gray-500" />
          <span>6.2K sledilcev • 2.6K sledim</span>
        </div>
        
        {/* Add follower icons */}
        <FollowerIcons />
        
        {/* Company Info Section */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h2 className="font-medium text-gray-800 mb-2">Podatki o podjetju</h2>
          
          <div className="flex items-start mt-2">
            <Building size={18} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 font-medium">Rezanje in vrtanje betona, Ziherl Iztok s.p.</p>
              <p className="text-gray-600 text-sm">Davčna številka: 79765424</p>
              <p className="text-gray-600 text-sm">Matična številka: 6425321000</p>
            </div>
          </div>
          
          <div className="flex items-start mt-3">
            <Calendar size={18} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">Datum registracije: <span className="font-medium">16. 8. 2013</span></p>
            </div>
          </div>
          
          <div className="flex items-start mt-3">
            <MapPin size={18} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">Ocvirkova ulica 73A, 1000 Ljubljana</p>
            </div>
          </div>
          
          <div className="flex items-start mt-3">
            <Phone size={18} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">+386 70 653 910</p>
            </div>
          </div>
          
          <div className="flex items-start mt-3">
            <Mail size={18} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">rezanje.vrtanje.betona@gmail.com</p>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h2 className="font-medium text-gray-800 mb-2">Zakaj Izbrati Nas</h2>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex">
              <Hammer size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span>Z vami je mojster s 27 leti delovnih izkušenj na področju rezanja in vrtanja betona.</span>
            </li>
            <li className="flex">
              <Handshake size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span>Nudimo izreze za vrata, plošče, okna ter vrtanje za inštalacije, dimnike in prezračevanje.</span>
            </li>
            <li className="flex">
              <MapPin size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span>Delujemo po celi Sloveniji, razen na Štajerskem.</span>
            </li>
            <li className="flex">
              <Clock size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span>Držimo se dogovorov in rokov. Za povpraševanje in izvedbo komunicirate neposredno z mano.</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Update Action Buttons */}
      <div className="px-4 pb-4">
        <a 
          href="https://www.facebook.com/idealen.rez/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
          Obišči Facebook stran
        </a>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Iztok Ziherl, s.p. Vse Pravice pridržane.
        </p>
      </div>
    </div>
  );
}