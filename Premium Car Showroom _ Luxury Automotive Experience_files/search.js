// Mock & Initial database of premium cars (fallback & immediate render)
window.CARS_DATA = [
  {
    id: "bmw-m4",
    brand: "BMW",
    model: "M4 Coupe",
    year: 2024,
    price: 78100,
    mileage: 1200,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 503,
    seats: 4,
    bodyType: "Coupe",
    engine: "3.0L Twin-Turbo",
    driveType: "AWD",
    color: "Frozen Portimao Blue",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mercedes-amg",
    brand: "Mercedes",
    model: "AMG GT R",
    year: 2023,
    price: 189000,
    mileage: 3400,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 577,
    seats: 2,
    bodyType: "Supercar",
    engine: "4.0L V8 Twin-Turbo",
    driveType: "RWD",
    color: "Green Hell Magno",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "audi-r8",
    brand: "Audi",
    model: "R8 V10 Performance",
    year: 2024,
    price: 209900,
    mileage: 500,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 602,
    seats: 2,
    bodyType: "Supercar",
    engine: "5.2L V10",
    driveType: "AWD",
    color: "Kemora Gray",
    availability: "Limited",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "porsche-911",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    price: 223800,
    mileage: 150,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 518,
    seats: 2,
    bodyType: "Coupe",
    engine: "4.0L Flat-6",
    driveType: "RWD",
    color: "GT3 RS Lime Green",
    availability: "Limited",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "tesla-s",
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    price: 89990,
    mileage: 8000,
    fuel: "Electric",
    transmission: "Automatic",
    horsepower: 1020,
    seats: 5,
    bodyType: "Sedan",
    engine: "Tri-Motor Electric",
    driveType: "AWD",
    color: "Solid Black",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ferrari-f8",
    brand: "Ferrari",
    model: "F8 Tributo",
    year: 2023,
    price: 276000,
    mileage: 2100,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 710,
    seats: 2,
    bodyType: "Supercar",
    engine: "3.9L Twin-Turbo V8",
    driveType: "RWD",
    color: "Rosso Corsa",
    availability: "Limited",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "lamborghini-huracan",
    brand: "Lamborghini",
    model: "Huracan Evo",
    year: 2024,
    price: 268000,
    mileage: 800,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 631,
    seats: 2,
    bodyType: "Supercar",
    engine: "5.2L V10",
    driveType: "AWD",
    color: "Giallo Inti",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "rolls-royce",
    brand: "Rolls Royce",
    model: "Ghost",
    year: 2023,
    price: 348500,
    mileage: 1800,
    fuel: "Petrol",
    transmission: "Automatic",
    horsepower: 563,
    seats: 5,
    bodyType: "Sedan",
    engine: "6.75L V12 Twin-Turbo",
    driveType: "AWD",
    color: "English White",
    availability: "Special Order",
    image: "https://images.unsplash.com/photo-1632245889027-e406faaa19cc?auto=format&fit=crop&w=800&q=80"
  }
];

// Async fetch from Backend REST API
async function fetchCarsFromAPI() {
  try {
    const res = await fetch('/api/cars');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        window.CARS_DATA = json.data;
        // Notify any active filters
        window.dispatchEvent(new CustomEvent('cars-data-updated'));
      }
    }
  } catch (err) {
    console.log('Serving offline cached cars database.');
  }
}

// Live Search Suggestions Action
document.addEventListener('DOMContentLoaded', () => {
  fetchCarsFromAPI();

  const searchInputs = document.querySelectorAll('.live-search-input');

  searchInputs.forEach(input => {
    // Create suggestion container
    const suggestBox = document.createElement('div');
    suggestBox.className = 'absolute left-0 right-0 mt-2 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 max-h-60 overflow-y-auto hidden';
    input.parentNode.appendChild(suggestBox);

    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      if (!val) {
        suggestBox.classList.add('hidden');
        suggestBox.innerHTML = '';
        return;
      }

      const matches = window.CARS_DATA.filter(car => 
        car.brand.toLowerCase().includes(val) || 
        car.model.toLowerCase().includes(val) ||
        car.bodyType.toLowerCase().includes(val)
      );

      if (matches.length === 0) {
        suggestBox.innerHTML = '<div class="p-3 text-zinc-500 text-sm">No cars found...</div>';
      } else {
        const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('/pages/');
        const prefix = isRoot ? 'pages/' : '';
        suggestBox.innerHTML = matches.map(car => `
          <div class="flex items-center gap-3 p-3 hover:bg-zinc-900 cursor-pointer transition-colors duration-200 border-b border-zinc-900" 
               onclick="window.location.href='${prefix}car-details.html?id=${car.id}'">
            <img src="${car.image}" class="w-12 h-8 object-cover rounded" alt="${car.brand}">
            <div>
              <div class="font-bold text-sm text-white">${car.brand} ${car.model}</div>
              <div class="text-xs text-zinc-400">${car.year} • ${car.engine} • $${car.price.toLocaleString()}</div>
            </div>
          </div>
        `).join('');
      }
      suggestBox.classList.remove('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !suggestBox.contains(e.target)) {
        suggestBox.classList.add('hidden');
      }
    });
  });
});
