import * as Label from '@radix-ui/react-label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCreateTrackerContext } from '@/contexts/CreateTrackerContext'

const weekdays = [
    { id: 'sunday', label: 'S', fullLabel: 'Sunday' },
    { id: 'monday', label: 'M', fullLabel: 'Monday' },
    { id: 'tuesday', label: 'T', fullLabel: 'Tuesday' },
    { id: 'wednesday', label: 'W', fullLabel: 'Wednesday' },
    { id: 'thursday', label: 'T', fullLabel: 'Thursday' },
    { id: 'friday', label: 'F', fullLabel: 'Friday' },
    { id: 'saturday', label: 'S', fullLabel: 'Saturday' },
]

export const Step3Frequency = () => {
    const { formData, updateFormData } = useCreateTrackerContext()

    // Ensure frequency is always defined with defaults
    const frequency = formData.frequency || {
        repeatEvery: '1',
        repeatUnit: 'day' as const,
        repeatOn: [],
    }

    const handleFrequencyChange = (field: string, value: string) => {
        updateFormData({
            frequency: {
                ...frequency,
                [field]: value,
            },
        })
    }

    const toggleWeekday = (weekdayId: string) => {
        const currentRepeatOn = frequency.repeatOn
        const isSelected = currentRepeatOn.includes(weekdayId)
        const newRepeatOn = isSelected
            ? currentRepeatOn.filter((id) => id !== weekdayId)
            : [...currentRepeatOn, weekdayId]
        updateFormData({
            frequency: {
                ...frequency,
                repeatOn: newRepeatOn,
            },
        })
    }

    return (
        <>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Configure Frequency
                </h3>
                <p className="text-sm text-muted-foreground">
                    Set how often this tracker should run
                </p>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label.Root
                        htmlFor="repeatEvery"
                        className="text-sm font-medium text-foreground"
                    >
                        Repeat Every <span className="text-destructive">*</span>
                    </Label.Root>
                    <div className="flex items-center gap-3">
                        <input
                            id="repeatEvery"
                            type="number"
                            min="1"
                            placeholder="1"
                            required
                            value={frequency.repeatEvery}
                            onChange={(e) =>
                                handleFrequencyChange(
                                    'repeatEvery',
                                    e.target.value
                                )
                            }
                            className="w-24 px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                        <Select
                            value={frequency.repeatUnit}
                            onValueChange={(value) =>
                                handleFrequencyChange('repeatUnit', value)
                            }
                            required
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">Day(s)</SelectItem>
                                <SelectItem value="week">Week(s)</SelectItem>
                                <SelectItem value="month">Month(s)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label.Root className="text-sm font-medium text-foreground">
                        Repeat On{' '}
                        <span className="text-muted-foreground text-xs">
                            (optional)
                        </span>
                    </Label.Root>
                    <div className="flex items-center gap-2 flex-wrap">
                        {weekdays.map((day) => {
                            const isSelected =
                                frequency.repeatOn.includes(day.id)
                            return (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => toggleWeekday(day.id)}
                                    className={`
                                        w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all
                                        ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background/50 text-foreground border-input hover:border-primary/50 hover:bg-accent'
                                        }
                                    `}
                                    title={day.fullLabel}
                                >
                                    {day.label}
                                </button>
                            )
                        })}
                    </div>
                    {frequency.repeatOn.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Selected:{' '}
                            {frequency.repeatOn
                                .map(
                                    (id) =>
                                        weekdays.find((d) => d.id === id)
                                            ?.fullLabel
                                )
                                .join(', ')}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
