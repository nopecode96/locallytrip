'use client';

import { useLayoutEffect } from 'react';

/**
 * NoSSRWrapper - Component to suppress hydration warnings from browser extensions
 * This component specifically handles attributes added by browser extensions like:
 * - bis_skin_checked (Bing/Microsoft Edge extension)
 * - bis_id, bis_size, bis_register (Bing extensions)
 * - Other extension-added attributes
 */
export function BrowserExtensionSuppressor({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const cleanBrowserExtensionAttributes = () => {
      // Common browser extension attributes that cause hydration warnings
      const extensionAttributes = [
        'bis_skin_checked',
        'bis_id', 
        'bis_size',
        'bis_register',
        'data-new-gr-c-s-check-loaded', // Grammarly
        'data-gr-ext-installed', // Grammarly
        'spellcheck-count', // Various spell checkers
        'data-darkreader-inline-bgcolor', // Dark Reader
        'data-darkreader-inline-color',   // Dark Reader
      ];

      extensionAttributes.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach(element => {
          element.removeAttribute(attr);
        });
      });

      // Clean dynamic processed attributes (like __processed_uuid__)
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        // Get all attributes
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
          // Remove attributes that match extension patterns
          if (
            attr.name.startsWith('__processed_') ||
            attr.name.startsWith('bis_') ||
            attr.name.startsWith('data-gr-') ||
            attr.name.startsWith('data-darkreader-') ||
            attr.name.includes('spellcheck') ||
            attr.name.includes('extension-')
          ) {
            element.removeAttribute(attr.name);
          }
        });
      });
    };

    // Clean immediately on mount
    cleanBrowserExtensionAttributes();
    
    // Clean after a short delay (extensions may inject after mount)
    const timeoutId = setTimeout(cleanBrowserExtensionAttributes, 100);

    // Set up observer to clean dynamically added attributes
    const observer = new MutationObserver((mutations) => {
      let needsCleaning = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          if (attrName && (
            attrName.startsWith('__processed_') ||
            attrName.startsWith('bis_') ||
            attrName.startsWith('data-gr-') ||
            attrName.startsWith('data-darkreader-') ||
            attrName.includes('spellcheck') ||
            attrName.includes('extension-')
          )) {
            needsCleaning = true;
          }
        }
      });
      
      if (needsCleaning) {
        // Debounce to avoid excessive cleaning
        clearTimeout(observer.timeout);
        observer.timeout = setTimeout(cleanBrowserExtensionAttributes, 100);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observer.timeout);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

// Type augmentation for timeout property
declare global {
  interface MutationObserver {
    timeout?: NodeJS.Timeout;
  }
}
