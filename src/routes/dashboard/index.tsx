import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import scenariosData from '@/mocks/scenarios.json'
import trackersData from '@/mocks/trackers.json'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Tracker {
    id: string
    name: string
    description: string
    scenarioId: string
}

interface Scenario {
    id: string
    name: string
    description: string
    parameters: Record<string, any>
}

const DashboardPage = () => {
    const trackers = trackersData as Tracker[]
    const scenarios = scenariosData as Scenario[]

    // Create a map for quick scenario lookup
    const scenarioMap = new Map(
        scenarios.map((scenario) => [scenario.id, scenario])
    )

    const getScenarioName = (scenarioId: string): string => {
        return scenarioMap.get(scenarioId)?.name || 'Unknown Scenario'
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Your Trackers
                    </h2>
                    <p className="text-muted-foreground">
                        Manage and monitor all your active trackers
                    </p>
                </div>
                <Link to="/dashboard/trackers/new">
                    <Button className="gap-2">
                        <Plus size={18} />
                        Add Tracker
                    </Button>
                </Link>
            </div>

            {trackers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-6 text-lg">
                        You have no trackers yet... click add to create your
                        first one.
                    </p>
                    <Link to="/dashboard/trackers/new">
                        <Button className="gap-2">
                            <Plus size={18} />
                            Add Tracker
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trackers.map((tracker) => (
                        <div
                            key={tracker.id}
                            className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-xl"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {tracker.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {tracker.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                <span className="text-xs text-muted-foreground">
                                    {getScenarioName(tracker.scenarioId)}
                                </span>
                                <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export const Route = createFileRoute('/dashboard/')({
    component: DashboardPage,
    beforeLoad: ({ context }) => {
        if (!context.isAuthorized) {
            throw redirect({ to: '/login' })
        }
    },
})
