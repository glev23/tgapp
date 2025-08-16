import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useButtonHaptic } from '../../hooks/useHapticFeedback'

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden',
	{
		variants: {
			variant: {
				default: 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-neon hover:shadow-neon-strong hover:scale-105',
				outline: 'border border-glass bg-glass/20 text-text-primary hover:bg-glass/40 backdrop-blur-sm',
				ghost: 'text-text-primary hover:bg-glass/20 backdrop-blur-sm',
				glass: 'bg-glass/30 text-text-primary border border-glass backdrop-blur-md hover:bg-glass/50',
				success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/25',
				danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-red-500/25',
				// Backward-compatibility aliases
				primary: 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-neon hover:shadow-neon-strong hover:scale-105',
				secondary: 'border border-glass bg-glass/20 text-text-primary hover:bg-glass/40 backdrop-blur-sm'
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				default: 'h-10 px-4',
				lg: 'h-11 px-6 text-base',
				xl: 'h-12 px-8 text-lg'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	loading?: boolean
	hapticFeedback?: 'light' | 'medium' | 'heavy' | false
	glowEffect?: boolean
	fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ 
		className, 
		variant, 
		size, 
		loading = false, 
		hapticFeedback = 'light',
		glowEffect = false,
		fullWidth = false,
		children, 
		onClick,
		disabled,
		...props 
	}, ref) => {
		const triggerHaptic = useButtonHaptic()

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (disabled || loading) return
			
			// Trigger haptic feedback
			if (hapticFeedback) {
				triggerHaptic(hapticFeedback)
			}
			
			onClick?.(e)
		}

		return (
			<motion.button
				ref={ref}
				className={cn(
					buttonVariants({ variant, size, className }),
					loading && 'cursor-wait',
					glowEffect && 'animate-pulse',
					fullWidth && 'w-full'
				)}
				disabled={disabled || loading}
				onClick={handleClick}
				whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
				whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
				{...props}
			>
				{/* Shimmer effect for gradient buttons */}
				{(variant === 'default' || variant === 'success' || variant === 'danger' || variant === 'primary') && !loading && (
					<motion.div
						className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						initial={{ x: '-100%' }}
						animate={{ x: '100%' }}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatDelay: 3,
							ease: 'linear'
						}}
					/>
				)}

				{loading && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="mr-2"
					>
						<Loader2 className="h-4 w-4 animate-spin" />
					</motion.div>
				)}
				
				<span className={cn(loading && 'opacity-70')}>
					{children}
				</span>
			</motion.button>
		)
	}
)

Button.displayName = 'Button'

export { Button, buttonVariants } 