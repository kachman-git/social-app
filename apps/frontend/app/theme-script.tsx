import Script from 'next/script'

export function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
    >{`
      (function() {
        function getThemePreference() {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
          }
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const theme = getThemePreference();
        document.documentElement.classList.add(theme);
      })();
    `}</Script>
  )
}

