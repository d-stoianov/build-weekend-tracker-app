import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
    Tracker,
    CreateTrackerRequest,
    UpdateTrackerRequest,
    TrackerHistoryEntry,
    TrackerFrequency,
} from '@/types/api'

// Convert frequency to API format
const convertFrequencyToApiFormat = (frequency?: TrackerFrequency) => {
    if (!frequency) return undefined

    // Convert startDateTime to "YYYY-MM-DD HH:mm:ss" format
    const date = new Date(frequency.startDateTime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    let intervalInMinutes: number
    switch (frequency.intervalUnit) {
        case 'minute':
            intervalInMinutes = frequency.interval
            break
        case 'hour':
            intervalInMinutes = frequency.interval * 60
            break
        case 'day':
            intervalInMinutes = frequency.interval * 24 * 60
            break
        case 'week':
            intervalInMinutes = frequency.interval * 7 * 24 * 60
            break
        case 'month':
            intervalInMinutes = frequency.interval * 30 * 24 * 60
            break
        default:
            intervalInMinutes = frequency.interval
    }

    return {
        time,
        interval: intervalInMinutes,
    }
}

export const useTrackers = () => {
    return useQuery<Tracker[]>({
        queryKey: ['trackers'],
        queryFn: () => api.get<Tracker[]>('/trackers'),
    })
}

export const useTracker = (trackerId: string) => {
    return useQuery<Tracker>({
        queryKey: ['trackers', trackerId],
        queryFn: () => api.get<Tracker>(`/trackers/${trackerId}`),
        enabled: !!trackerId,
    })
}

// Get tracker history
export const useTrackerHistory = (trackerId: string) => {
    return useQuery<TrackerHistoryEntry[]>({
        queryKey: ['trackers', trackerId, 'history'],
        queryFn: () =>
            api.get<TrackerHistoryEntry[]>(`/trackers/${trackerId}/history`),
        enabled: !!trackerId,
        refetchInterval: 10000, // Poll every 10 seconds
    })
}

// Create tracker
export const useCreateTracker = () => {
    const queryClient = useQueryClient()

    return useMutation<Tracker, Error, CreateTrackerRequest>({
        mutationFn: (data) => {
            const { frequency, ...rest } = data
            const apiData: any = { ...rest }

            if (frequency) {
                const converted = convertFrequencyToApiFormat(frequency)
                if (converted) {
                    apiData.time = converted.time
                    apiData.interval = converted.interval
                }
            }

            console.log('apiData', apiData)

            return api.post<Tracker>('/trackers', apiData)
        },
        onSuccess: () => {
            // Invalidate and refetch trackers list
            queryClient.invalidateQueries({ queryKey: ['trackers'] })
        },
    })
}

export const useUpdateTracker = (trackerId: string) => {
    const queryClient = useQueryClient()

    return useMutation<Tracker, Error, UpdateTrackerRequest>({
        mutationFn: (data) => {
            // Convert frequency to API format and exclude it from the request
            const { frequency, ...rest } = data
            const apiData: any = { ...rest }

            if (frequency) {
                const converted = convertFrequencyToApiFormat(frequency)
                if (converted) {
                    apiData.time = converted.time
                    apiData.interval = converted.interval
                }
            }

            return api.put<Tracker>(`/trackers/${trackerId}`, apiData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trackers'] })
            queryClient.invalidateQueries({
                queryKey: ['trackers', trackerId],
            })
        },
    })
}

export const useDeleteTracker = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (trackerId) => api.delete<void>(`/trackers/${trackerId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trackers'] })
        },
    })
}
