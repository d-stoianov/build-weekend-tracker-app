import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
    Tracker,
    CreateTrackerRequest,
    UpdateTrackerRequest,
    TrackerHistoryEntry,
} from '@/types/api'

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
        mutationFn: (data) => api.post<Tracker>('/trackers', data),
        onSuccess: () => {
            // Invalidate and refetch trackers list
            queryClient.invalidateQueries({ queryKey: ['trackers'] })
        },
    })
}

export const useUpdateTracker = (trackerId: string) => {
    const queryClient = useQueryClient()

    return useMutation<Tracker, Error, UpdateTrackerRequest>({
        mutationFn: (data) => api.put<Tracker>(`/trackers/${trackerId}`, data),
        onSuccess: () => {
            // Invalidate and refetch both the list and the specific tracker
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
