import { BuildEnv } from '@/config/types'

export const BUILD_ENV: BuildEnv = import.meta.env.VITE_BUILD_ENV ?? 'DEV'
export const API_URL: string = import.meta.env.VITE_API_URL ?? ''
