import { LucideIcon, LayoutDashboard, Package, ShoppingBag, LogOut, Plus, Search, Mail, Lock, User, CheckCircle2, ShieldCheck, Zap, Settings, HelpCircle, FileText, ChevronRight, ChevronLeft, ArrowLeft, MoreHorizontal, Edit2, MoreVertical } from 'lucide-react';

export const Icons = {
  Dashboard: LayoutDashboard,
  Products: Package,
  Orders: ShoppingBag,
  Logout: LogOut,
  Add: Plus,
  Search: Search,
  Email: Mail,
  Password: Lock,
  User: User,
  Success: CheckCircle2,
  Security: ShieldCheck,
  Fast: Zap,
  Settings: Settings,
  Support: HelpCircle,
  Terms: FileText,
  ChevronRight: ChevronRight,
  ChevronLeft: ChevronLeft,
  ArrowLeft: ArrowLeft,
  More: MoreHorizontal,
  MoreVertical: MoreVertical,
  Edit: Edit2,
};

export type IconName = keyof typeof Icons;

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: IconName;
  size?: number | string;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideIcon = Icons[name];
  if (!LucideIcon) return null;
  
  // Hide decorative icons from screen readers unless explicitly labelled
  const isDecorative = !props['aria-label'] && !props['aria-labelledby'];
  
  return (
    <LucideIcon 
      size={size} 
      className={className} 
      aria-hidden={isDecorative ? "true" : undefined}
      {...props} 
    />
  );
}
