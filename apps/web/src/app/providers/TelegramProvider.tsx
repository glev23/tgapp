import React, { createContext, useContext, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

interface TelegramContextType {
	webApp: any
	user: any
	isReady: boolean
	themeParams: any
}

const TelegramContext = createContext<TelegramContextType | null>(null)

export function useTelegram() {
	const context = useContext(TelegramContext)
	if (!context) {
		throw new Error('useTelegram must be used within TelegramProvider')
	}
	return context
}

interface TelegramProviderProps {
	children: React.ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
	const isTelegram = typeof window !== 'undefined' && (window as any).Telegram?.WebApp
	const safeWebApp = isTelegram ? WebApp : null
	const defaultTheme = {
		bg_color: '#ffffff',
		text_color: '#000000',
		hint_color: '#999999',
		button_color: '#2481cc',
		button_text_color: '#ffffff',
		secondary_bg_color: '#f1f1f1'
	}

	const [isReady, setIsReady] = useState(false)
	const [themeParams, setThemeParams] = useState<any>(isTelegram ? (safeWebApp as any)?.themeParams ?? defaultTheme : defaultTheme)

	useEffect(() => {
		if (!isTelegram || !safeWebApp) {
			setIsReady(true)
			return
		}

		try {
			(safeWebApp as any).ready?.()
			;(safeWebApp as any).expand?.()
		} catch {}
		
		const updateTheme = () => {
			const root = document.documentElement
			const tp = (safeWebApp as any)?.themeParams ?? defaultTheme
			
			if (tp.bg_color) root.style.setProperty('--tg-theme-bg-color', tp.bg_color)
			if (tp.text_color) root.style.setProperty('--tg-theme-text-color', tp.text_color)
			if (tp.hint_color) root.style.setProperty('--tg-theme-hint-color', tp.hint_color)
			if (tp.button_color) root.style.setProperty('--tg-theme-button-color', tp.button_color)
			if (tp.button_text_color) root.style.setProperty('--tg-theme-button-text-color', tp.button_text_color)
			if (tp.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', tp.secondary_bg_color)

			setThemeParams(tp)
		}

		(safeWebApp as any).onEvent?.('themeChanged', updateTheme)
		updateTheme()
		setIsReady(true)

		return () => {
			(safeWebApp as any).offEvent?.('themeChanged', updateTheme)
		}
	}, [isTelegram])

	const value: TelegramContextType = {
		webApp: safeWebApp,
		user: isTelegram ? (safeWebApp as any)?.initDataUnsafe?.user || null : null,
		isReady,
		themeParams
	}

	return (
		<TelegramContext.Provider value={value}>
			{children}
		</TelegramContext.Provider>
	)
}
 