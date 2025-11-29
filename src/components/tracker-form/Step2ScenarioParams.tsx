import * as Label from '@radix-ui/react-label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useScenarios } from '@/hooks/useScenarios'
import { useCreateTrackerContext } from '@/contexts/CreateTrackerContext'

export const Step2ScenarioParams = () => {
    const { data: scenarios = [] } = useScenarios()
    const { formData, updateFormData } = useCreateTrackerContext()

    const selectedScenario = scenarios.find(
        (s) => String(s.id) === String(formData.scenarioId)
    )

    const handleParameterChange = (paramId: string, value: string) => {
        updateFormData({
            parameters: {
                ...formData.parameters,
                [paramId]: value,
            },
        })
    }

    const handleToggleChange = (paramId: string, checked: boolean) => {
        updateFormData({
            parameters: {
                ...formData.parameters,
                [paramId]: checked ? 'true' : 'false',
            },
        })
    }

    if (!selectedScenario) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    Please select a scenario in step 1
                </p>
            </div>
        )
    }

    return (
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
                                <span className="text-destructive ml-1">*</span>
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
                                value={formData.parameters[param.id] || ''}
                                onChange={(e) =>
                                    handleParameterChange(
                                        param.id,
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        ) : param.type === 'toggle' ? (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={param.id}
                                    checked={
                                        formData.parameters[param.id] === 'true'
                                    }
                                    onCheckedChange={(checked) =>
                                        handleToggleChange(
                                            param.id,
                                            checked === true
                                        )
                                    }
                                />
                                <label
                                    htmlFor={param.id}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {param.label}
                                </label>
                            </div>
                        ) : (
                            <Select
                                value={
                                    formData.parameters[param.id] ||
                                    param.default ||
                                    ''
                                }
                                onValueChange={(value) =>
                                    handleParameterChange(param.id, value)
                                }
                                required
                            >
                                <SelectTrigger id={param.id} className="w-full">
                                    <SelectValue
                                        placeholder={`Select ${param.label.toLowerCase()}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {param.options?.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
