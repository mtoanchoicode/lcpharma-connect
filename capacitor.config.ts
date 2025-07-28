import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6b893cbb51f744e090493755404b1da9',
  appName: 'Long Châu PMS',
  webDir: 'dist',
  server: {
    url: 'https://6b893cbb-51f7-44e0-9049-3755404b1da9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;