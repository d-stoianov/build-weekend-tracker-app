import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Trash2 } from 'lucide-react'
import * as Label from '@radix-ui/react-label'
import {
    useTracker,
    useTrackerHistory,
    useUpdateTracker,
    useDeleteTracker,
} from '@/hooks/useTrackers'
import { useScenarios } from '@/hooks/useScenarios'

const TrackerDetailsPage = () => {
    const { trackerId } = Route.useParams()
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<{
        output: string
        timestamp: string
    } | null>(null)

    const {
        data: tracker,
        isLoading: trackerLoading,
        error: trackerError,
    } = useTracker(trackerId)
    const { data: scenarios = [] } = useScenarios()
    const { data: history = [], isLoading: historyLoading } =
        useTrackerHistory(trackerId)
    const updateTracker = useUpdateTracker(trackerId)
    const deleteTracker = useDeleteTracker()

    const scenario = tracker
        ? scenarios.find((s) => String(s.id) === String(tracker.scenarioId))
        : null

    const [isActive, setIsActive] = useState(tracker?.isActive || false)

    // Update local state when tracker data changes
    useEffect(() => {
        if (tracker) {
            setIsActive(tracker.isActive)
        }
    }, [tracker])

    if (trackerLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (trackerError || !tracker) {
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

    const handleToggleActive = async (checked: boolean) => {
        setIsActive(checked)
        try {
            await updateTracker.mutateAsync({ isActive: checked })
        } catch (error) {
            // Revert on error
            setIsActive(!checked)
            console.error('Failed to update tracker status:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTracker.mutateAsync(trackerId)
            setShowDeleteDialog(false)
            router.navigate({ to: '/dashboard' })
        } catch (error) {
            console.error('Failed to delete tracker:', error)
        }
    }

    const formatDateTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatFrequency = () => {
        if (!tracker.frequency) return 'Not configured'

        const { repeatEvery, repeatUnit, repeatOn } = tracker.frequency
        const unitMap: Record<string, string> = {
            day: 'day',
            week: 'week',
            month: 'month',
            hour: 'hour',
        }
        const unit = unitMap[repeatUnit] || repeatUnit
        let frequencyText = `Every ${repeatEvery} ${unit}${repeatEvery !== '1' ? 's' : ''}`

        if (repeatOn && repeatOn.length > 0) {
            const weekdays = [
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
            ]
            const dayNames = repeatOn.map((id) => {
                const day = weekdays.findIndex((d) => d === id)
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
            })
            frequencyText += ` on ${dayNames.join(', ')}`
        }

        return frequencyText
    }

    const isHtmlDocument = (content: string): boolean => {
        const trimmed = content.trim()
        return (
            trimmed.toLowerCase().startsWith('<!doctype html') ||
            trimmed.toLowerCase().startsWith('<html')
        )
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
                            disabled={updateTracker.isPending}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                        {tracker.description}
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        className="gap-2"
                    >
                        <Trash2 size={16} />
                        Delete Tracker
                    </Button>
                </div>
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

                        {tracker.frequency && (
                            <div>
                                <Label.Root className="text-sm font-medium text-muted-foreground">
                                    Frequency
                                </Label.Root>
                                <p className="text-foreground mt-1">
                                    {formatFrequency()}
                                </p>
                            </div>
                        )}

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
                    {historyLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : history.length === 0 ? (
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
                                                {formatDateTime(
                                                    entry.timestamp
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-foreground">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedHistoryEntry(
                                                            {
                                                                output: entry.output,
                                                                timestamp:
                                                                    entry.timestamp,
                                                            }
                                                        )
                                                    }
                                                    className="text-left w-full hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    <div className="font-medium">
                                                        {entry.summary}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Click to show details
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Tracker</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{tracker.name}"?
                            This action cannot be undone and will permanently
                            delete all tracker data and history.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={deleteTracker.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteTracker.isPending}
                        >
                            {deleteTracker.isPending
                                ? 'Deleting...'
                                : 'Delete Tracker'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Detail Modal */}
            <Dialog
                open={!!selectedHistoryEntry}
                onOpenChange={(open) => {
                    if (!open) setSelectedHistoryEntry(null)
                }}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Execution Details</DialogTitle>
                        <DialogDescription>
                            {selectedHistoryEntry &&
                                formatDateTime(selectedHistoryEntry.timestamp)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex-1 min-h-0 overflow-hidden">
                        {selectedHistoryEntry &&
                            (isHtmlDocument(selectedHistoryEntry.output) ? (
                                <iframe
                                    srcDoc={selectedHistoryEntry.output}
                                    className="w-full h-full min-h-[500px] border border-border rounded-lg"
                                    title="Execution Output"
                                    sandbox="allow-same-origin"
                                />
                            ) : (
                                <div className="bg-background border border-border rounded-lg p-4 max-h-[500px] overflow-y-auto">
                                    <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
                                        {selectedHistoryEntry.output}
                                    </pre>
                                </div>
                            ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedHistoryEntry(null)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const Route = createFileRoute('/dashboard/trackers/$trackerId')({
    component: TrackerDetailsPage,
})
