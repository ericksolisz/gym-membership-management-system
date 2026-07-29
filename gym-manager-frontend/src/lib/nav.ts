import { LayoutDashboard, Users, Network } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  to: { name: string }
  icon: Component
  /** Also highlight for these route name prefixes. */
  match?: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: { name: 'dashboard' }, icon: LayoutDashboard },
  {
    label: 'Members',
    to: { name: 'members' },
    icon: Users,
    match: ['member-create', 'member-detail', 'member-edit'],
  },
  { label: 'Integrations & API', to: { name: 'system' }, icon: Network },
]

export const APP_NAME = 'Ironsmith'
export const APP_TAGLINE = 'Membership Management'
