/**
 * Device Detection Utility for Admin Dashboard Audit Trail
 * Provides browser and device information for admin audit logging
 */

interface AdminDeviceInfo {
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
  adminSession: boolean;
}

class AdminDeviceDetectionService {
  private deviceId: string;

  constructor() {
    this.deviceId = this.generateAdminDeviceId();
  }

  /**
   * Generate or retrieve persistent admin device ID
   */
  private generateAdminDeviceId(): string {
    const stored = localStorage.getItem('admin_device_id');
    if (stored) return stored;

    // Generate unique admin device ID
    const fingerprint = this.generateFingerprint();
    const deviceId = `admin-${fingerprint}-${Date.now()}`;
    
    localStorage.setItem('admin_device_id', deviceId);
    return deviceId;
  }

  /**
   * Generate browser fingerprint for admin
   */
  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Admin fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      'admin' // Add admin identifier
    ].join('|');

    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  /**
   * Detect platform from user agent
   */
  private detectPlatform(): string {
    const ua = navigator.userAgent.toLowerCase();
    
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
    const ua = navigator.userAgent.toLowerCase();
    
    // Mobile detection
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    
    // Tablet detection
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    
    // Desktop by default (most admin access)
    return 'desktop';
  }

  /**
   * Detect browser information
   */
  private detectBrowser(): { name: string; version: string } {
    const ua = navigator.userAgent;
    
    // Chrome
    const chromeMatch = ua.match(/Chrome\/(\d+)/);
    if (chromeMatch) {
      return { name: 'Chrome', version: chromeMatch[1] };
    }
    
    // Firefox
    const firefoxMatch = ua.match(/Firefox\/(\d+)/);
    if (firefoxMatch) {
      return { name: 'Firefox', version: firefoxMatch[1] };
    }
    
    // Safari
    const safariMatch = ua.match(/Safari\/(\d+)/);
    if (safariMatch && !ua.includes('Chrome')) {
      return { name: 'Safari', version: safariMatch[1] };
    }
    
    // Edge
    const edgeMatch = ua.match(/Edg\/(\d+)/);
    if (edgeMatch) {
      return { name: 'Edge', version: edgeMatch[1] };
    }
    
    return { name: 'Unknown', version: 'Unknown' };
  }

  /**
   * Detect OS information
   */
  private detectOS(): { name: string; version: string } {
    const ua = navigator.userAgent;
    
    // Windows
    const windowsMatch = ua.match(/Windows NT (\d+\.\d+)/);
    if (windowsMatch) {
      const versionMap: { [key: string]: string } = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7'
      };
      return { name: 'Windows', version: versionMap[windowsMatch[1]] || windowsMatch[1] };
    }
    
    // macOS
    const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (macMatch) {
      return { name: 'macOS', version: macMatch[1].replace('_', '.') };
    }
    
    // Linux
    if (ua.includes('Linux')) {
      return { name: 'Linux', version: 'Unknown' };
    }
    
    return { name: 'Unknown', version: 'Unknown' };
  }

  /**
   * Get comprehensive admin device information
   */
  getAdminDeviceInfo(): AdminDeviceInfo {
    const browser = this.detectBrowser();
    const os = this.detectOS();

    return {
      deviceId: this.deviceId,
      platform: this.detectPlatform(),
      deviceType: this.detectDeviceType(),
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      screenResolution: `${screen.width}x${screen.height}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      adminSession: true
    };
  }

  /**
   * Get admin headers for API requests
   */
  getAdminDeviceHeaders(): Record<string, string> {
    const deviceInfo = this.getAdminDeviceInfo();
    
    return {
      'X-Device-ID': deviceInfo.deviceId,
      'X-Device-Platform': deviceInfo.platform,
      'X-Device-Type': deviceInfo.deviceType,
      'X-App-Version': '1.0.0-admin',
      'X-Browser-Name': deviceInfo.browserName,
      'X-Browser-Version': deviceInfo.browserVersion,
      'X-Screen-Resolution': deviceInfo.screenResolution,
      'X-Timezone': deviceInfo.timezone,
      'X-Language': deviceInfo.language,
      'X-Admin-Session': 'true',
      'X-Session-Type': 'admin'
    };
  }

  /**
   * Clear admin device ID (for logout or reset)
   */
  clearAdminDeviceId(): void {
    localStorage.removeItem('admin_device_id');
    this.deviceId = this.generateAdminDeviceId();
  }

  /**
   * Log admin activity (for high-priority admin actions)
   */
  logAdminActivity(action: string, details?: any): void {
    const deviceInfo = this.getAdminDeviceInfo();
    
    console.log('Admin Activity Logged:', {
      timestamp: new Date().toISOString(),
      action,
      details,
      device: {
        id: deviceInfo.deviceId,
        platform: deviceInfo.platform,
        browser: `${deviceInfo.browserName} ${deviceInfo.browserVersion}`,
        os: `${deviceInfo.osName} ${deviceInfo.osVersion}`,
        location: window.location.href
      }
    });
  }
}

// Export singleton instance for admin
export const adminDeviceDetection = new AdminDeviceDetectionService();
export default adminDeviceDetection;
