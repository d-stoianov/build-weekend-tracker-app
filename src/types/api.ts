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

export interface ScenarioOutput {
    id: string
    label: string
    type: 'toggle' | 'toggel' // Support both spellings
}

export interface Scenario {
    id: string | number
    name: string
    description: string
    parameters: Parameter[]
    outputs?: ScenarioOutput[]
}

export interface TrackerFrequency {
    startDateTime: string // ISO datetime string
    interval: number // The number (e.g., 1, 2, 5)
    intervalUnit: 'minute' | 'hour' | 'day' | 'week' | 'month'
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
    outputs?: Record<string, string> // e.g., { "email": "true", "sheet": "true" }
}

export interface CreateTrackerRequest {
    name: string
    description?: string
    scenarioId: string
    parameters: Record<string, string>
    frequency?: TrackerFrequency
    outputs?: Record<string, string> // e.g., { "email": "true", "sheet": "true" }
}

export interface UpdateTrackerRequest {
    name?: string
    description?: string
    isActive?: boolean
    parameters?: Record<string, string>
    frequency?: TrackerFrequency
    outputs?: Record<string, string> // e.g., { "email": "true", "sheet": "true" }
}

export interface TrackerHistoryEntry {
    timestamp: string
    output: string
    summary: string
}
