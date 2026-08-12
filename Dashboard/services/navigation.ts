export type NavigationItem = { label: string; href: string; count?: number }

export const navigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/' },
  { label: 'Sectors', href: '/sectors' },
  { label: 'Alerts', href: '/alerts', count: 2 },
  { label: 'Automation', href: '/automation' },
  { label: 'Reports', href: '/reports' },
]

export function getActiveNavigation(pathname: string) { return navigationItems.find((item) => item.href === pathname) ?? navigationItems[0] }
