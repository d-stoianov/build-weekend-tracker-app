import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import scenariosData from '@/mocks/scenarios.json'
import { Button } from '@/components/ui/button'
import * as Label from '@radix-ui/react-label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface ParameterOption {
    label: string
    value: string
}

interface Parameter {
    id: string
    type: 'text' | 'dropdown'
    label: string
    placeholder?: string
    default?: string
    options?: ParameterOption[]
}

interface Scenario {
    id: string
    name: string
    description: string
    parameters: Parameter[]
}

const CreateTrackerPage = () => {
    const router = useRouter()
    const scenarios = scenariosData as Scenario[]
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        scenarioId: '',
        parameters: {} as Record<string, string>,
        frequency: {
            repeatEvery: '1',
            repeatUnit: 'day',
            repeatOn: [] as string[],
        },
    })

    const weekdays = [
        { id: 'sunday', label: 'S', fullLabel: 'Sunday' },
        { id: 'monday', label: 'M', fullLabel: 'Monday' },
        { id: 'tuesday', label: 'T', fullLabel: 'Tuesday' },
        { id: 'wednesday', label: 'W', fullLabel: 'Wednesday' },
        { id: 'thursday', label: 'T', fullLabel: 'Thursday' },
        { id: 'friday', label: 'F', fullLabel: 'Friday' },
        { id: 'saturday', label: 'S', fullLabel: 'Saturday' },
    ]

    const selectedScenario = scenarios.find((s) => s.id === formData.scenarioId)

    const handleNext = () => {
        if (step === 1) {
            // Validate step 1
            if (!formData.name || !formData.scenarioId) {
                return
            }
            // Initialize parameter values with defaults
            if (selectedScenario) {
                const initialParams: Record<string, string> = {}
                selectedScenario.parameters.forEach((param) => {
                    if (param.type === 'dropdown' && param.default) {
                        initialParams[param.id] = param.default
                    } else {
                        initialParams[param.id] = ''
                    }
                })
                setFormData({ ...formData, parameters: initialParams })
            }
            setStep(2)
        } else if (step === 2) {
            // Validate step 2 - check all required parameters
            if (selectedScenario) {
                const requiredParams = selectedScenario.parameters.filter(
                    (p) => p.type === 'text'
                )
                const allFilled = requiredParams.every(
                    (p) => formData.parameters[p.id]?.trim() !== ''
                )
                if (!allFilled) {
                    return
                }
            }
            setStep(3)
        } else if (step === 3) {
            // Final step - validate and submit
            if (
                !formData.frequency.repeatEvery ||
                !formData.frequency.repeatUnit
            ) {
                return
            }
            // Submit the form
            console.log('Final form data:', formData)
            // TODO: Add API call here
            router.navigate({ to: '/dashboard' })
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleParameterChange = (paramId: string, value: string) => {
        setFormData({
            ...formData,
            parameters: {
                ...formData.parameters,
                [paramId]: value,
            },
        })
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value })
    }

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, description: e.target.value })
    }

    const handleScenarioChange = (value: string) => {
        setFormData({ ...formData, scenarioId: value })
    }

    const handleFrequencyChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            frequency: {
                ...formData.frequency,
                [field]: value,
            },
        })
    }

    const toggleWeekday = (weekdayId: string) => {
        const currentRepeatOn = formData.frequency.repeatOn
        const isSelected = currentRepeatOn.includes(weekdayId)
        const newRepeatOn = isSelected
            ? currentRepeatOn.filter((id) => id !== weekdayId)
            : [...currentRepeatOn, weekdayId]
        setFormData({
            ...formData,
            frequency: {
                ...formData.frequency,
                repeatOn: newRepeatOn,
            },
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Create New Tracker
                </h1>
                <p className="text-muted-foreground">
                    Step {step} of 3 -{' '}
                    {step === 1
                        ? 'Basic Information'
                        : step === 2
                          ? 'Scenario Parameters'
                          : 'Frequency Configuration'}
                </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleNext()
                    }}
                    className="space-y-6"
                >
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <>
                            <div className="space-y-2">
                                <Label.Root
                                    htmlFor="name"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Tracker Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label.Root>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="e.g., Instagram Posts Check"
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
                                    Scenario{' '}
                                    <span className="text-destructive">*</span>
                                </Label.Root>
                                <Select
                                    value={formData.scenarioId}
                                    onValueChange={handleScenarioChange}
                                    required
                                >
                                    <SelectTrigger
                                        id="scenario"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a scenario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {scenarios.map((scenario) => (
                                            <SelectItem
                                                key={scenario.id}
                                                value={scenario.id}
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
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Step 2: Scenario Parameters */}
                    {step === 2 && selectedScenario && (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Configure {selectedScenario.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedScenario.description}
                                </p>
                            </div>
                            <div className="space-y-6">
                                {selectedScenario.parameters.map((param) => (
                                    <div key={param.id} className="space-y-2">
                                        <Label.Root
                                            htmlFor={param.id}
                                            className="text-sm font-medium text-foreground"
                                        >
                                            {param.label}
                                            {param.type === 'text' && (
                                                <span className="text-destructive ml-1">
                                                    *
                                                </span>
                                            )}
                                        </Label.Root>
                                        {param.type === 'text' ? (
                                            <input
                                                id={param.id}
                                                type="text"
                                                placeholder={
                                                    param.placeholder ||
                                                    `Enter ${param.label.toLowerCase()}...`
                                                }
                                                required
                                                value={
                                                    formData.parameters[
                                                        param.id
                                                    ] || ''
                                                }
                                                onChange={(e) =>
                                                    handleParameterChange(
                                                        param.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                            />
                                        ) : (
                                            <Select
                                                value={
                                                    formData.parameters[
                                                        param.id
                                                    ] ||
                                                    param.default ||
                                                    ''
                                                }
                                                onValueChange={(value) =>
                                                    handleParameterChange(
                                                        param.id,
                                                        value
                                                    )
                                                }
                                                required
                                            >
                                                <SelectTrigger
                                                    id={param.id}
                                                    className="w-full"
                                                >
                                                    <SelectValue
                                                        placeholder={`Select ${param.label.toLowerCase()}`}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {param.options?.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Step 3: Frequency Configuration */}
                    {step === 3 && (
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
                                        Repeat Every{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label.Root>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="repeatEvery"
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            required
                                            value={
                                                formData.frequency.repeatEvery
                                            }
                                            onChange={(e) =>
                                                handleFrequencyChange(
                                                    'repeatEvery',
                                                    e.target.value
                                                )
                                            }
                                            className="w-24 px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        />
                                        <Select
                                            value={
                                                formData.frequency.repeatUnit
                                            }
                                            onValueChange={(value) =>
                                                handleFrequencyChange(
                                                    'repeatUnit',
                                                    value
                                                )
                                            }
                                            required
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="day">
                                                    Day(s)
                                                </SelectItem>
                                                <SelectItem value="week">
                                                    Week(s)
                                                </SelectItem>
                                                <SelectItem value="month">
                                                    Month(s)
                                                </SelectItem>
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
                                                formData.frequency.repeatOn.includes(
                                                    day.id
                                                )
                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleWeekday(day.id)
                                                    }
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
                                    {formData.frequency.repeatOn.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Selected:{' '}
                                            {formData.frequency.repeatOn
                                                .map(
                                                    (id) =>
                                                        weekdays.find(
                                                            (d) => d.id === id
                                                        )?.fullLabel
                                                )
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                        {step === 1 ? (
                            <Link to="/dashboard">
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={
                                step === 1
                                    ? !formData.name || !formData.scenarioId
                                    : step === 2
                                      ? selectedScenario
                                          ? selectedScenario.parameters
                                                .filter(
                                                    (p) => p.type === 'text'
                                                )
                                                .some(
                                                    (p) =>
                                                        !formData.parameters[
                                                            p.id
                                                        ]?.trim()
                                                )
                                          : true
                                      : !formData.frequency.repeatEvery ||
                                        !formData.frequency.repeatUnit
                            }
                        >
                            {step === 3 ? 'Create Tracker' : 'Next Step'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/dashboard/trackers/new')({
    component: CreateTrackerPage,
})
