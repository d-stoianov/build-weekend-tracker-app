import * as Label from '@radix-ui/react-label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateTrackerContext } from '@/contexts/CreateTrackerContext'
import { useScenarios } from '@/hooks/useScenarios'

export const Step3Frequency = () => {
    const { formData, updateFormData } = useCreateTrackerContext()
    const { data: scenarios = [] } = useScenarios()

    const selectedScenario = scenarios.find(
        (s) => String(s.id) === String(formData.scenarioId)
    )

    // Ensure frequency is always defined with defaults
    const getDefaultDateTime = () => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
        // Convert to ISO string for storage
        return new Date(localDateTime).toISOString()
    }

    const frequency = formData.frequency || {
        startDateTime: getDefaultDateTime(),
        interval: 1,
        intervalUnit: 'day' as const,
    }

    const handleFrequencyChange = (field: string, value: string | number) => {
        updateFormData({
            frequency: {
                ...frequency,
                [field]: value,
            },
        })
    }

    // Convert ISO string to local datetime format for input (YYYY-MM-DDTHH:mm)
    const getLocalDateTime = (isoString: string) => {
        if (!isoString) {
            return new Date().toISOString().slice(0, 16)
        }
        const date = new Date(isoString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const handleDateTimeChange = (value: string) => {
        // Convert local datetime to ISO string
        const date = new Date(value)
        handleFrequencyChange('startDateTime', date.toISOString())
    }

    // Handle outputs checkbox changes
    const outputs = formData.outputs || {}
    const handleOutputChange = (key: string, checked: boolean) => {
        const newOutputs = { ...outputs }
        if (checked) {
            newOutputs[key] = 'true'
        } else {
            delete newOutputs[key]
        }
        updateFormData({ outputs: newOutputs })
    }

    return (
        <>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Configure Frequency
                </h3>
                <p className="text-sm text-muted-foreground">
                    Set when to start tracking and how often to repeat
                </p>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label.Root
                        htmlFor="startDateTime"
                        className="text-sm font-medium text-foreground"
                    >
                        Start Date & Time{' '}
                        <span className="text-destructive">*</span>
                    </Label.Root>
                    <input
                        id="startDateTime"
                        type="datetime-local"
                        required
                        value={getLocalDateTime(frequency.startDateTime)}
                        onChange={(e) => handleDateTimeChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label.Root
                        htmlFor="interval"
                        className="text-sm font-medium text-foreground"
                    >
                        Repeat Every <span className="text-destructive">*</span>
                    </Label.Root>
                    <div className="flex items-center gap-3">
                        <input
                            id="interval"
                            type="number"
                            min="1"
                            placeholder="1"
                            required
                            value={frequency.interval}
                            onChange={(e) =>
                                handleFrequencyChange(
                                    'interval',
                                    parseInt(e.target.value) || 1
                                )
                            }
                            className="w-24 px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                        <Select
                            value={frequency.intervalUnit}
                            onValueChange={(value) =>
                                handleFrequencyChange('intervalUnit', value)
                            }
                            required
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="minute">
                                    Minute(s)
                                </SelectItem>
                                <SelectItem value="hour">Hour(s)</SelectItem>
                                <SelectItem value="day">Day(s)</SelectItem>
                                <SelectItem value="week">Week(s)</SelectItem>
                                <SelectItem value="month">Month(s)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedScenario?.outputs &&
                    selectedScenario.outputs.length > 0 && (
                        <div className="space-y-2">
                            <Label.Root className="text-sm font-medium text-foreground">
                                Outputs
                            </Label.Root>
                            <div className="space-y-3 p-4 border border-border rounded-lg bg-background/50">
                                {selectedScenario.outputs.map((output) => (
                                    <div
                                        key={output.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`outputs-${output.id}`}
                                            checked={
                                                outputs[output.id] === 'true'
                                            }
                                            onCheckedChange={(checked) =>
                                                handleOutputChange(
                                                    output.id,
                                                    !!checked
                                                )
                                            }
                                        />
                                        <Label.Root
                                            htmlFor={`outputs-${output.id}`}
                                            className="text-sm font-medium text-foreground cursor-pointer"
                                        >
                                            {output.label}
                                        </Label.Root>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </>
    )
}
