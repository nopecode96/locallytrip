/**
 * Device Detection Utility for Audit Trail
 * Provides browser and device information for audit logging
 * Server-side rendering safe implementation
 */

interface DeviceInfo {
  deviceId: string;
  platform: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  screenResolution: string;
  userAgent: string;
  language: string;
  timezone: string;
}

interface DeviceHeaders {
  'X-Device-ID': string;
  'X-Platform': string;
  'X-Device-Type': string;
  'X-App-Version': string;
  'X-User-Agent': string;
  'X-Screen-Resolution': string;
  'X-Timezone': string;
}

class DeviceDetectionService {
  private deviceId: string | null = null;
  private static readonly APP_VERSION = '1.0.0';

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.deviceId = this.generateDeviceId();
    }
  }

  /**
   * Generate or retrieve persistent device ID
   */
  private generateDeviceId(): string {
    // Check if running on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return `web-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const stored = localStorage.getItem('device_id');
    if (stored) return stored;

    // Generate unique device ID based on browser fingerprint
    const fingerprint = this.generateFingerprint();
    const deviceId = `web-${fingerprint}-${Date.now()}`;
    
    localStorage.setItem('device_id', deviceId);
    return deviceId;
  }

  /**
   * Generate browser fingerprint
   */
  private generateFingerprint(): string {
    // Check if running on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Math.random().toString(36).substr(2, 9);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const canvasData = canvas.toDataURL();
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      canvasData.slice(-20) // Last 20 characters of canvas data
    ];

    // Simple hash function
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Detect platform
   */
  private detectPlatform(): string {
    if (typeof navigator === 'undefined') return 'server';
    
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('chrome') && !ua.includes('edg')) return 'chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    if (ua.includes('edg')) return 'edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'opera';
    
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('macintosh') || ua.includes('mac os')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    if (ua.includes('android')) return 'android';
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
    
    return 'unknown';
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    if (typeof navigator === 'undefined') return 'desktop';
    
    const ua = navigator.userAgent.toLowerCase();
    
    // Mobile detection
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    
    // Tablet detection
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    
    // Desktop by default
    return 'desktop';
  }

  /**
   * Detect browser name and version
   */
  private detectBrowser(): { name: string; version: string } {
    if (typeof navigator === 'undefined') {
      return { name: 'Server', version: '1.0' };
    }

    const ua = navigator.userAgent;
    
    // Firefox
    const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
    if (firefoxMatch) {
      return { name: 'Firefox', version: firefoxMatch[1] };
    }
    
    // Chrome
    const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
    if (chromeMatch && !ua.includes('Edg')) {
      return { name: 'Chrome', version: chromeMatch[1] };
    }
    
    // Edge
    const edgeMatch = ua.match(/Edg\/(\d+\.\d+)/);
    if (edgeMatch) {
      return { name: 'Edge', version: edgeMatch[1] };
    }
    
    // Safari
    const safariMatch = ua.match(/Version\/(\d+\.\d+).*Safari/);
    if (safariMatch) {
      return { name: 'Safari', version: safariMatch[1] };
    }
    
    return { name: 'Unknown', version: 'Unknown' };
  }

  /**
   * Detect operating system
   */
  private detectOS(): { name: string; version: string } {
    if (typeof navigator === 'undefined') {
      return { name: 'Server', version: '1.0' };
    }

    const ua = navigator.userAgent;
    
    // Windows
    if (ua.includes('Windows NT 10.0')) return { name: 'Windows', version: '10' };
    if (ua.includes('Windows NT 6.3')) return { name: 'Windows', version: '8.1' };
    if (ua.includes('Windows NT 6.2')) return { name: 'Windows', version: '8' };
    if (ua.includes('Windows NT 6.1')) return { name: 'Windows', version: '7' };
    
    // macOS
    const macMatch = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    if (macMatch) {
      return { name: 'macOS', version: macMatch[1].replace(/_/g, '.') };
    }
    
    // iOS
    const iosMatch = ua.match(/OS (\d+_\d+)/);
    if (iosMatch) {
      return { name: 'iOS', version: iosMatch[1].replace(/_/g, '.') };
    }
    
    // Android
    const androidMatch = ua.match(/Android (\d+\.\d+)/);
    if (androidMatch) {
      return { name: 'Android', version: androidMatch[1] };
    }
    
    // Linux
    if (ua.includes('Linux')) return { name: 'Linux', version: 'Unknown' };
    
    return { name: 'Unknown', version: 'Unknown' };
  }

  /**
   * Get comprehensive device information
   */
  getDeviceInfo(): DeviceInfo {
    // Return fallback data if not on client side
    if (typeof window === 'undefined') {
      return {
        deviceId: 'server-fallback',
        platform: 'server',
        deviceType: 'desktop',
        browserName: 'Server',
        browserVersion: '1.0',
        osName: 'Server',
        osVersion: '1.0',
        screenResolution: '1920x1080',
        userAgent: 'Server-Side-Rendering',
        language: 'en',
        timezone: 'UTC'
      };
    }

    const browser = this.detectBrowser();
    const os = this.detectOS();

    return {
      deviceId: this.deviceId || this.generateDeviceId(),
      platform: this.detectPlatform(),
      deviceType: this.detectDeviceType(),
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      screenResolution: `${screen.width}x${screen.height}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  /**
   * Get device headers for API requests
   */
  getDeviceHeaders(): DeviceHeaders {
    const deviceInfo = this.getDeviceInfo();
    
    return {
      'X-Device-ID': deviceInfo.deviceId,
      'X-Platform': deviceInfo.platform,
      'X-Device-Type': deviceInfo.deviceType,
      'X-App-Version': DeviceDetectionService.APP_VERSION,
      'X-User-Agent': deviceInfo.userAgent,
      'X-Screen-Resolution': deviceInfo.screenResolution,
      'X-Timezone': deviceInfo.timezone
    };
  }

  /**
   * Clear device data (for logout)
   */
  clearDeviceData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('device_id');
    }
    this.deviceId = null;
  }
}

// Create singleton instance
const deviceDetection = new DeviceDetectionService();

export { DeviceDetectionService, type DeviceInfo, type DeviceHeaders };
export default deviceDetection;
