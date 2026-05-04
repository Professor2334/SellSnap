import { LucideIcon, LayoutDashboard, Package, ClipboardList, LogOut, Plus, Search, Mail, Lock, User, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const Icons = {
  Dashboard: LayoutDashboard,
  Products: Package,
  Orders: ClipboardList,
  Logout: LogOut,
  Add: Plus,
  Search: Search,
  Email: Mail,
  Password: Lock,
  User: User,
  Success: CheckCircle2,
  Security: ShieldCheck,
  Fast: Zap,
};

export type IconName = keyof typeof Icons;

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: IconName;
  size?: number | string;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideIcon = Icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} {...props} />;
}
