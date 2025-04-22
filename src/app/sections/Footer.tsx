import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <h3 className="text-black font-semibold mb-4">Event & Bootcamp</h3>
          <div className="flex flex-col  md:flex-row gap-8">
          <ul className="space-y-2">
            <li>Web Development</li>
            <li>Mobile Development</li>
            <li>UI Design</li>
            <li>UI Research</li>
            <li>Presentation</li>
            
          </ul>
          <ul className="space-y-2 ">
          <li>Comunication</li>
            <li>Video Production</li>
            <li>Digital Marketing</li>
            <li>Branding</li>
          </ul>
        </div>
          </div>
         

        {/* Column 2 */}
        <div>
          <h3 className="text-black font-semibold mb-4">About VL Academy</h3>
          <ul className="space-y-2">
            <li>Adminission Info</li>
            <li>Article</li>
            <li>Group & Referral Program</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-black font-semibold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:contact@voltislabs.com" className="text-blue-600 hover:underline">
                contact@voltislabs.com
              </a>
            </li>
            <li>
              <a href="tel:+6285923935983" className="text-blue-600 hover:underline">
                (+62) 85923935983
              </a>
            </li>
            <li>Follow us on social media</li>
            <li className="flex space-x-4 mt-2 text-blue-600">
              <a href="https://instagram.com/voltislabs" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com/voltislabs" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/voltislabs" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com/@voltislabs" target="_blank" rel="noopener noreferrer">
                <Youtube size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-black text-white text-center text-xs py-4">
        Copyright © 2025 Voltis Labs. All Rights Reserved.
      </div>
    </footer>
  );
}
