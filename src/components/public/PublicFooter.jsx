import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://media.base44.com/images/public/6a1d00c12929ea8d18f9682c/18bf23381_272142171_135339558948283_9205934589195432511_n.jpg"
                alt="Barangay San Vicente Logo"
                className="w-10 h-10 object-contain brightness-0 invert"
              />
              <div>
                <p className="font-heading font-bold text-sm">Barangay San Vicente</p>
                <p className="text-[10px] opacity-80">Olango Island, Lapu-Lapu City</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Serving the community of San Vicente with integrity, transparency, and commitment to public service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/about" className="hover:opacity-100 hover:underline">About Us</Link></li>
              <li><Link to="/services" className="hover:opacity-100 hover:underline">Services</Link></li>
              <li><Link to="/officials" className="hover:opacity-100 hover:underline">Officials</Link></li>
              <li><Link to="/transparency" className="hover:opacity-100 hover:underline">Transparency</Link></li>
              <li><Link to="/downloads" className="hover:opacity-100 hover:underline">Downloads</Link></li>
              <li><Link to="/verify" className="hover:opacity-100 hover:underline">Verify Document</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Barangay Clearance</li>
              <li>Certificate of Residency</li>
              <li>Certificate of Indigency</li>
              <li>Business Clearance</li>
              <li>Senior Citizen ID</li>
              <li><Link to="/resident-portal" className="hover:opacity-100 hover:underline">Resident Portal →</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Barangay Hall, San Vicente, Olango Island, Lapu-Lapu City, Cebu 6015</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>0917-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>brgy.sanvicente@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Mon–Fri: 8:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs opacity-60">
          <p>© {new Date().getFullYear()} Barangay San Vicente. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Republic of the Philippines</p>
        </div>
      </div>
    </footer>
  );
}