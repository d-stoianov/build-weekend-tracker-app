import * as Label from '@radix-ui/react-label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useScenarios } from '@/hooks/useScenarios'
import { useCreateTrackerContext } from '@/contexts/CreateTrackerContext'
import { useEffect } from 'react'

export const Step1BasicInfo = () => {
    const { data: scenarios = [], isLoading: scenariosLoading } = useScenarios()
    const { formData, updateFormData, resetForm } = useCreateTrackerContext()

    // Clear parameters when entering step 1
    useEffect(() => {
        resetForm()
    }, [])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({ name: e.target.value })
    }

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        updateFormData({ description: e.target.value })
    }

    const handleScenarioChange = (value: string) => {
        // Clear parameters when scenario changes
        updateFormData({ scenarioId: value, parameters: {} })
    }

    if (scenariosLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-2">
                <Label.Root
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                >
                    Tracker Name <span className="text-destructive">*</span>
                </Label.Root>
                <input
                    id="name"
                    type="text"
                    placeholder="e.g. Instagram Posts Check"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
            </div>

            <div className="space-y-2">
                <Label.Root
                    htmlFor="description"
                    className="text-sm font-medium text-foreground"
                >
                    Description{' '}
                    <span className="text-muted-foreground text-xs">
                        (optional)
                    </span>
                </Label.Root>
                <textarea
                    id="description"
                    placeholder="Describe what this tracker will monitor..."
                    rows={4}
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                />
            </div>

            <div className="space-y-2">
                <Label.Root
                    htmlFor="scenario"
                    className="text-sm font-medium text-foreground"
                >
                    Scenario <span className="text-destructive">*</span>
                </Label.Root>
                <Select
                    value={String(formData.scenarioId || '')}
                    onValueChange={handleScenarioChange}
                    required
                >
                    <SelectTrigger id="scenario" className="w-full">
                        <SelectValue placeholder="Select a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                        {scenarios.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No scenarios available
                            </div>
                        ) : (
                            scenarios.map((scenario) => (
                                <SelectItem
                                    key={scenario.id}
                                    value={String(scenario.id)}
                                    textValue={scenario.name}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {scenario.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {scenario.description}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}
