import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Scenario } from '@/types/api'

export const useScenarios = () => {
    return useQuery<Scenario[]>({
        queryKey: ['scenarios'],
        queryFn: () => api.get<Scenario[]>('/scenarios'),
    })
}
