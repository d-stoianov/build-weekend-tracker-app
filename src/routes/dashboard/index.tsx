import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTrackers } from '@/hooks/useTrackers'
import { useScenarios } from '@/hooks/useScenarios'

const DashboardPage = () => {
    const {
        data: trackers = [],
        isLoading: trackersLoading,
        error: trackersError,
    } = useTrackers()
    const { data: scenarios = [] } = useScenarios()

    const scenarioMap = new Map(
        scenarios.map((scenario) => [scenario.id, scenario])
    )

    const getScenarioName = (scenarioId: string): string => {
        return scenarioMap.get(scenarioId)?.name || 'Unknown Scenario'
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    if (trackersLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (trackersError) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">
                    Failed to load trackers. Please try again later.
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                >
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div>
            {trackers.length > 0 && (
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
            )}

            {trackers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-6 text-lg">
                        You have no trackers yet... Click add to create your
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
                        <Link
                            key={tracker.id}
                            to="/dashboard/trackers/$trackerId"
                            params={{
                                trackerId: tracker.id,
                            }}
                            className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-xl block"
                        >
                            <div className="mb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {tracker.name}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            tracker.isActive
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {tracker.isActive
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {tracker.description}
                                </p>
                            </div>
                            <div className="space-y-2 mt-4 pt-4 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {getScenarioName(tracker.scenarioId)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Created {formatDate(tracker.createdAt)}
                                    </span>
                                </div>
                                <Link
                                    to="/dashboard/trackers/$trackerId"
                                    params={{
                                        trackerId: tracker.id,
                                    }}
                                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors inline-block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Details →
                                </Link>
                            </div>
                        </Link>
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
