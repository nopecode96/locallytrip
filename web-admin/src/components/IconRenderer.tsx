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
  Tag
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
  
  // If it's a Lucide icon name, render the component
  if (iconName && iconMap[iconName as keyof typeof iconMap]) {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback for unknown icons
  return <span className={`inline-block ${className}`} style={{ fontSize: size }}>📋</span>;
};

export default IconRenderer;
