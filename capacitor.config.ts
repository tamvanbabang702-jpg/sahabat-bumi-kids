import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0454cb24e21f4486b10990f2db7d7d7c',
  appName: 'Sahabat Bumi',
  webDir: 'dist',
  server: {
    url: 'https://0454cb24-e21f-4486-b109-90f2db7d7d7c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4ADE80',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;
