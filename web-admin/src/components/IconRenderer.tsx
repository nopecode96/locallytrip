import React from 'react';
import { 
  Home,
  Calendar,
  DollarSign,
  Star,
  BarChart3,
  Users,
  UserPlus,
  Shield,
  BookOpen,
  MessageSquare,
  Search,
  CreditCard,
  FileText,
  TrendingUp,
  MapPin,
  List,
  User,
  Plus,
  Tag,
  Heart,
  Utensils,
  Building,
  Mountain,
  Camera,
  Palette,
  Route,
  Calculator,
  Map
} from 'lucide-react';

// Map of icon names to Lucide React components
const iconMap = {
  // Basic icons
  home: Home,
  calendar: Calendar,
  'dollar-sign': DollarSign,
  star: Star,
  'bar-chart': BarChart3,
  
  // User management
  users: Users,
  'user-plus': UserPlus,
  user: User,
  shield: Shield,
  
  // Content
  'book-open': BookOpen,
  'message-square': MessageSquare,
  search: Search,
  
  // Finance
  'credit-card': CreditCard,
  'file-text': FileText,
  'trending-up': TrendingUp,
  
  // Experiences
  'map-pin': MapPin,
  list: List,
  plus: Plus,
  tag: Tag,
  
  // Experience Types - FontAwesome to Lucide mapping
  'fa-heart': Heart,
  'fa-utensils': Utensils,
  'fa-landmark': Building,
  'fa-mountain': Mountain,
  'fa-om': '🕉️',
  'fa-camera-retro': Camera,
  'fa-camera': Camera,
  'fa-rings-wedding': '💍',
  'fa-camera-alt': Camera,
  'fa-star': Star,
  'fa-palette': Palette,
  'fa-hiking': '🥾',
  'fa-map-marked-alt': Map,
  'fa-route': Route,
  'fa-calculator': Calculator,
};

interface IconRendererProps {
  iconName?: string;
  className?: string;
  size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = ({ 
  iconName, 
  className = '',
  size = 18 
}) => {
  // If it's an emoji (starts with unicode emoji range), render as is
  if (iconName && /[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(iconName)) {
    return <span className={`inline-block ${className}`} style={{ fontSize: size }}>{iconName}</span>;
  }
  
  // Check if icon exists in mapping
  if (iconName && iconMap[iconName as keyof typeof iconMap]) {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    
    // If it's a string (emoji), render as text
    if (typeof IconComponent === 'string') {
      return <span className={`inline-block ${className}`} style={{ fontSize: size }}>{IconComponent}</span>;
    }
    
    // If it's a React component, render it
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback for unknown icons
  return <span className={`inline-block ${className}`} style={{ fontSize: size }}>📋</span>;
};

export default IconRenderer;
