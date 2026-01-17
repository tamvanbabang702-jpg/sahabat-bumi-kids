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
    allowMixedContent: true,
    backgroundColor: '#4ADE80'
  },
  ios: {
    backgroundColor: '#4ADE80'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#4ADE80',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: false
    }
  }
};

export default config;
