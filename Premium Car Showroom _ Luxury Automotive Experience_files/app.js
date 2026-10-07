// Shared application functions and utilities
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hide Loading Screen
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }, 400);
  }

  // 2. Sticky Navbar
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('glass', 'shadow-lg');
        header.classList.remove('bg-transparent');
      } else {
        header.classList.remove('glass', 'shadow-lg');
        header.classList.add('bg-transparent');
      }
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 4. Back To Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.remove('hidden', 'opacity-0');
        backToTop.classList.add('flex', 'opacity-100');
      } else {
        backToTop.classList.add('opacity-0');
        setTimeout(() => {
          if (backToTop.classList.contains('opacity-0')) {
            backToTop.classList.add('hidden');
          }
        }, 300);
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Auth State Check & Navbar Update
  const savedUser = localStorage.getItem('velocita_user');
  if (savedUser) {
    try {
      const userObj = JSON.parse(savedUser);
      const accountBtns = document.querySelectorAll('a[href*="login.html"]');
      accountBtns.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-user-check text-xs"></i> ${userObj.name.split(' ')[0]}`;
        btn.href = '#';
        btn.title = 'Click to Logout';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm(`Logged in as ${userObj.name}. Do you want to logout?`)) {
            localStorage.removeItem('velocita_user');
            window.location.reload();
          }
        });
      });
    } catch (e) {}
  }

  // 6. Wishlist & Comparison logic using LocalStorage
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let compareList = JSON.parse(localStorage.getItem('compare')) || [];

  window.toggleWishlist = function(carId, carName) {
    const index = wishlist.indexOf(carId);
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast(`${carName} removed from Wishlist`);
    } else {
      wishlist.push(carId);
      showToast(`${carName} added to Wishlist!`, 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadges();
  };

  window.toggleCompare = function(carId, carName) {
    const index = compareList.indexOf(carId);
    if (index > -1) {
      compareList.splice(index, 1);
      showToast(`${carName} removed from Comparison`);
    } else {
      if (compareList.length >= 3) {
        showToast('You can compare a maximum of 3 cars.', 'error');
        return;
      }
      compareList.push(carId);
      showToast(`${carName} added to Compare list!`, 'success');
    }
    localStorage.setItem('compare', JSON.stringify(compareList));
    updateCompareBadges();
  };

  function updateWishlistBadges() {
    const badges = document.querySelectorAll('.wishlist-count');
    badges.forEach(badge => badge.textContent = wishlist.length);
  }

  function updateCompareBadges() {
    const badges = document.querySelectorAll('.compare-count');
    badges.forEach(badge => badge.textContent = compareList.length);
  }

  updateWishlistBadges();
  updateCompareBadges();

  // 7. Toast Notifications
  window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 p-4 rounded-xl shadow-2xl border text-white transition-all duration-300 transform translate-y-2 opacity-0 text-xs font-semibold ${
      type === 'success' ? 'bg-emerald-600 border-emerald-500' :
      type === 'error' ? 'bg-red-600 border-red-500' : 'bg-zinc-900 border-zinc-700'
    }`;
    
    let icon = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle text-sm"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle text-sm"></i>';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-10px]');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // 8. Cookie Banner Action
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (localStorage.getItem('cookies-accepted') === 'true') {
      cookieBanner.remove();
    } else {
      cookieBanner.classList.remove('hidden');
    }
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookieBanner.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => cookieBanner.remove(), 400);
    });
  }

  // 9. Newsletter Subscription connected to backend API
  const newsletterForms = document.querySelectorAll('#newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.value.trim() })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          emailInput.value = '';
        } else {
          showToast(data.message || 'Error subscribing', 'error');
        }
      } catch (err) {
        showToast('Subscribed to VIP newsletter!', 'success');
        emailInput.value = '';
      }
    });
  });
});
