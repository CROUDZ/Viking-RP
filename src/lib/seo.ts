import { useEffect } from "react";

// Hook pour optimiser les performances et le SEO
export function useSEOOptimizations() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement("link");
      fontLink.rel = "preload";
      fontLink.as = "font";
      fontLink.type = "font/woff2";
      fontLink.crossOrigin = "anonymous";
      fontLink.href = "/fonts/inter-var.woff2";
      document.head.appendChild(fontLink);
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      // Lazy load images
      const images = document.querySelectorAll("img[data-src]");
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    };

    // Service Worker for caching
    const registerServiceWorker = () => {
      if (
        "serviceWorker" in navigator &&
        process.env.NODE_ENV === "production"
      ) {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
      }
    };

    // Performance optimizations
    const optimizePerformance = () => {
      // Remove unused CSS
      if (process.env.NODE_ENV === "production") {
        // This would be handled by PurgeCSS in production
      }

      // Optimize images loading
      const imgs = document.querySelectorAll("img");
      imgs.forEach((img) => {
        if (!img.loading) {
          img.loading = "lazy";
        }
      });
    };

    preloadCriticalResources();
    lazyLoadResources();
    registerServiceWorker();
    optimizePerformance();

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, []);
}
