import { type VariantProps, cva } from 'class-variance-authority'
export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-tight transition-colors focus:outline-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        // Semantic status / plan variants
        emerald:
          'border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
        amber:
          'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400',
        red: 'border-transparent bg-red-500/12 text-red-700 dark:text-red-400',
        blue: 'border-transparent bg-blue-500/12 text-blue-700 dark:text-blue-400',
        gold: 'border-transparent bg-yellow-500/15 text-yellow-800 dark:text-yellow-400',
        zinc: 'border-transparent bg-zinc-500/12 text-zinc-700 dark:text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
