export interface ParameterOption {
    label: string
    value: string
}

export interface Parameter {
    id: string
    type: 'text' | 'dropdown' | 'toggle'
    label: string
    placeholder?: string
    default?: string
    options?: ParameterOption[]
}

export interface Scenario {
    id: string | number
    name: string
    description: string
    parameters: Parameter[]
}

export interface TrackerFrequency {
    repeatEvery: string
    repeatUnit: 'day' | 'week' | 'month' | 'hour'
    repeatOn: string[]
}

export interface Tracker {
    id: string
    name: string
    description: string
    scenarioId: string
    isActive: boolean
    createdAt: string
    parameters: Record<string, string>
    frequency?: TrackerFrequency
}

export interface CreateTrackerRequest {
    name: string
    description?: string
    scenarioId: string
    parameters: Record<string, string>
    frequency?: TrackerFrequency
}

export interface UpdateTrackerRequest {
    name?: string
    description?: string
    isActive?: boolean
    parameters?: Record<string, string>
    frequency?: TrackerFrequency
}

export interface TrackerHistoryEntry {
    timestamp: string
    text: string
}
