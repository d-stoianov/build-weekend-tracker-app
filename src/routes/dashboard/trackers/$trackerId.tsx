import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import trackersData from '@/mocks/trackers.json'
import scenariosData from '@/mocks/scenarios.json'
import historyData from '@/mocks/tracker-history.json'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from 'lucide-react'
import * as Label from '@radix-ui/react-label'

interface Tracker {
    id: string
    name: string
    description: string
    scenarioId: string
    active: boolean
    parameters: Record<string, string>
    frequency: {
        repeatEvery: string
        repeatUnit: string
        repeatOn: string[]
    }
}

interface Scenario {
    id: string
    name: string
    description: string
    parameters: any[]
}

interface HistoryEntry {
    dateTime: string
    output: string
}

const TrackerDetailsPage = () => {
    const { trackerId } = Route.useParams()
    const router = useRouter()
    const trackers = trackersData as Tracker[]
    const scenarios = scenariosData as Scenario[]
    const histories = historyData as Array<{
        trackerId: string
        history: HistoryEntry[]
    }>

    const tracker = trackers.find((t) => t.id === trackerId)
    const scenario = tracker
        ? scenarios.find((s) => s.id === tracker.scenarioId)
        : null
    const history = histories.find((h) => h.trackerId === trackerId)?.history || []

    const [isActive, setIsActive] = useState(tracker?.active || false)

    if (!tracker) {
        return (
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        Tracker not found
                    </p>
                </div>
            </div>
        )
    }

    const handleToggleActive = (checked: boolean) => {
        setIsActive(checked)
        // TODO: Add API call to update tracker status
        console.log('Tracker active status:', checked)
    }

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatFrequency = () => {
        const { repeatEvery, repeatUnit, repeatOn } = tracker.frequency
        const unitMap: Record<string, string> = {
            day: 'day',
            week: 'week',
            month: 'month',
            hour: 'hour',
        }
        const unit = unitMap[repeatUnit] || repeatUnit
        let frequencyText = `Every ${repeatEvery} ${unit}${repeatEvery !== '1' ? 's' : ''}`
        
        if (repeatOn.length > 0) {
            const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            const dayNames = repeatOn.map(id => {
                const day = weekdays.findIndex(d => d === id)
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
            })
            frequencyText += ` on ${dayNames.join(', ')}`
        }
        
        return frequencyText
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        {tracker.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <Label.Root
                            htmlFor="active-toggle"
                            className="text-sm font-medium text-foreground cursor-pointer"
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </Label.Root>
                        <Switch
                            id="active-toggle"
                            checked={isActive}
                            onCheckedChange={handleToggleActive}
                        />
                    </div>
                </div>
                <p className="text-muted-foreground">{tracker.description}</p>
            </div>

            <div className="space-y-6">
                {/* Tracker Information Card */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Tracker Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label.Root className="text-sm font-medium text-muted-foreground">
                                Scenario
                            </Label.Root>
                            <p className="text-foreground mt-1">
                                {scenario?.name || 'Unknown Scenario'}
                            </p>
                            {scenario?.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {scenario.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label.Root className="text-sm font-medium text-muted-foreground">
                                Frequency
                            </Label.Root>
                            <p className="text-foreground mt-1">
                                {formatFrequency()}
                            </p>
                        </div>

                        {Object.keys(tracker.parameters).length > 0 && (
                            <div>
                                <Label.Root className="text-sm font-medium text-muted-foreground mb-2 block">
                                    Parameters
                                </Label.Root>
                                <div className="space-y-2">
                                    {Object.entries(tracker.parameters).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span className="text-muted-foreground capitalize">
                                                    {key}:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    {value}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Execution History
                    </h2>
                    {history.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No execution history yet
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                            Date/Time
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                            Output
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-sm text-foreground">
                                                {formatDateTime(entry.dateTime)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-foreground">
                                                {entry.output}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/dashboard/trackers/$trackerId')({
    component: TrackerDetailsPage,
})

