// components/map/MapComponent.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sample data based on the image - you can replace with your actual data
const mapData = [
  // North America
  { lat: 40.7128, lng: -74.0060, value: 848, label: "New York" },
  { lat: 34.0522, lng: -118.2437, value: 4100, label: "Los Angeles" },
  { lat: 41.8781, lng: -87.6298, value: 1700, label: "Chicago" },
  { lat: 29.7604, lng: -95.3698, value: 3000, label: "Houston" },
  { lat: 25.7617, lng: -80.1918, value: 2200, label: "Miami" },
  
  // South America
  { lat: -23.5505, lng: -46.6333, value: 3900, label: "São Paulo" },
  { lat: -34.6037, lng: -58.3816, value: 533, label: "Buenos Aires" },
  { lat: -12.0464, lng: -77.0428, value: 519, label: "Lima" },
  { lat: 4.7110, lng: -74.0721, value: 883, label: "Bogotá" },
  { lat: -16.2902, lng: -63.5887, value: 82, label: "Bolivia" },
  { lat: -22.9068, lng: -43.1729, value: 594, label: "Rio de Janeiro" },
  { lat: -33.4489, lng: -70.6693, value: 665, label: "Santiago" },
  { lat: -34.9011, lng: -56.1645, value: 73, label: "Montevideo" },
  
  // Europe
  { lat: 51.5074, lng: -0.1278, value: 106, label: "London" },
  { lat: 48.8566, lng: 2.3522, value: 1300, label: "Paris" },
  { lat: 52.5200, lng: 13.4050, value: 15000, label: "Berlin" },
  { lat: 55.7558, lng: 37.6176, value: 2500, label: "Moscow" },
  { lat: 41.9028, lng: 12.4964, value: 4600, label: "Rome" },
  { lat: 40.4168, lng: -3.7038, value: 4600, label: "Madrid" },
  { lat: 59.9139, lng: 10.7522, value: 2, label: "Oslo" },
  { lat: 60.1699, lng: 24.9384, value: 1700, label: "Helsinki" },
  
  // Africa
  { lat: 30.0444, lng: 31.2357, value: 787, label: "Cairo" },
  { lat: -26.2041, lng: 28.0473, value: 781, label: "Johannesburg" },
  { lat: 6.5244, lng: 3.3792, value: 417, label: "Lagos" },
  { lat: -1.2921, lng: 36.8219, value: 756, label: "Nairobi" },
  { lat: 33.8869, lng: 9.5375, value: 103, label: "Tunisia" },
  { lat: -18.8792, lng: 47.5079, value: 133, label: "Madagascar" },
  { lat: -15.3875, lng: 28.3228, value: 20, label: "Zambia" },
  { lat: 0.3476, lng: 32.5825, value: 55, label: "Uganda" },
  { lat: -6.7924, lng: 39.2083, value: 12, label: "Tanzania" },
  
  // Asia
  { lat: 35.6762, lng: 139.6503, value: 1000, label: "Tokyo" },
  { lat: 39.9042, lng: 116.4074, value: 41, label: "Beijing" },
  { lat: 31.2304, lng: 121.4737, value: 29, label: "Shanghai" },
  { lat: 28.7041, lng: 77.1025, value: 8700, label: "New Delhi" },
  { lat: 19.0760, lng: 72.8777, value: 1400, label: "Mumbai" },
  { lat: 13.0827, lng: 80.2707, value: 4700, label: "Chennai" },
  { lat: 1.3521, lng: 103.8198, value: 341, label: "Singapore" },
  { lat: 14.5995, lng: 120.9842, value: 6, label: "Manila" },
  { lat: -6.2088, lng: 106.8456, value: 1700, label: "Jakarta" },
  { lat: 3.1390, lng: 101.6869, value: 4800, label: "Kuala Lumpur" },
  { lat: 37.5665, lng: 126.9780, value: 1000, label: "Seoul" },
  { lat: 25.2048, lng: 55.2708, value: 1800, label: "Dubai" },
  { lat: 29.3117, lng: 47.4818, value: 6, label: "Kuwait" },
  { lat: 23.8859, lng: 45.0792, value: 205, label: "Riyadh" },
  { lat: 32.0853, lng: 34.7818, value: 23, label: "Tel Aviv" },
  { lat: 33.3152, lng: 44.3661, value: 240, label: "Baghdad" },
  { lat: 35.6892, lng: 51.3890, value: 240, label: "Tehran" },
  { lat: 41.0082, lng: 28.9784, value: 3900, label: "Istanbul" },
  { lat: 43.2381, lng: 76.8512, value: 53, label: "Kazakhstan" },
  
  // Oceania
  { lat: -33.8688, lng: 151.2093, value: 195, label: "Sydney" },
  { lat: -37.8136, lng: 144.9631, value: 2, label: "Melbourne" },
  { lat: -27.4698, lng: 153.0251, value: 1700, label: "Brisbane" },
  { lat: -41.2865, lng: 174.7762, value: 15, label: "Wellington" },
  { lat: -36.8485, lng: 174.7633, value: 5, label: "Auckland" },
];

// Custom icon creation function
const createCustomIcon = (value: number) => {
  const size = Math.min(Math.max(20, Math.log(value + 1) * 8), 60);
  const fontSize = Math.min(Math.max(10, size * 0.3), 16);
  
  // Format the display value
  const displayValue = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex items-center justify-center w-full h-full bg-black text-white rounded-full border-2 border-white shadow-lg font-semibold" 
           style="width: ${size}px; height: ${size}px; font-size: ${fontSize}px;">
        ${displayValue}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface GlobalDataMapProps {
  className?: string;
}

const GlobalDataMap: React.FC<GlobalDataMapProps> = ({ className = '' }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Force height on the container
    mapContainerRef.current.style.height = '100%';
    mapContainerRef.current.style.width = '100%';

    // Initialize the map
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      worldCopyJump: true,
      maxBounds: [[-90, -180], [90, 180]],
    });

    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      noWrap: false,
    }).addTo(map);

    // Force map to resize after initialization
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Add markers
    mapData.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(point.value),
      }).addTo(map);

      // Add popup with information
      marker.bindPopup(`
        <div class="text-center p-2">
          <h3 class="font-bold text-lg">${point.label}</h3>
          <p class="text-gray-600">Value: ${point.value.toLocaleString()}</p>
        </div>
      `);
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ height: '100%', width: '100%' }}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '400px' // Fallback minimum height
        }}
      />
      
      {/* Privacy notice */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-md text-sm z-[1000]">
        <div className="flex items-center gap-2">
          <span>Pins are off by 10+ miles for privacy</span>
          <button 
            className="text-white hover:text-gray-300"
            onClick={(e) => {
              const notice = e.currentTarget.parentElement?.parentElement;
              if (notice) notice.remove();
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalDataMap;