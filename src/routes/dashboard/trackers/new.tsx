import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useScenarios } from '@/hooks/useScenarios'
import { useCreateTracker } from '@/hooks/useTrackers'
import {
    CreateTrackerProvider,
    useCreateTrackerContext,
} from '@/contexts/CreateTrackerContext'
import { Step1BasicInfo } from '@/components/tracker-form/Step1BasicInfo'
import { Step2ScenarioParams } from '@/components/tracker-form/Step2ScenarioParams'
import { Step3Frequency } from '@/components/tracker-form/Step3Frequency'

const CreateTrackerForm = () => {
    const router = useRouter()
    const { data: scenarios = [] } = useScenarios()
    const createTracker = useCreateTracker()
    const { formData, step, setStep, updateFormData, resetForm } =
        useCreateTrackerContext()

    const selectedScenario = scenarios.find(
        (s) => String(s.id) === String(formData.scenarioId)
    )

    const handleNext = async () => {
        if (step === 1) {
            // Validate step 1
            if (!formData.name || !formData.scenarioId) {
                return
            }

            console.log('selectedScenario', selectedScenario)

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
                updateFormData({ parameters: initialParams })
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
            // Final step - submit
            // Submit the form (frequency will be converted to API format in the hook)
            try {
                await createTracker.mutateAsync({
                    name: formData.name,
                    description: formData.description || undefined,
                    scenarioId: formData.scenarioId,
                    parameters: formData.parameters,
                    frequency: formData.frequency,
                })
                resetForm()
                router.navigate({ to: '/dashboard' })
            } catch (error) {
                console.error('Failed to create tracker:', error)
                // TODO: Show error message to user
            }
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
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
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await handleNext()
                    }}
                    className="space-y-6"
                >
                    {step === 1 && <Step1BasicInfo />}
                    {step === 2 && <Step2ScenarioParams />}
                    {step === 3 && <Step3Frequency />}

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                        {step === 1 ? (
                            <Link to="/dashboard" onClick={() => resetForm()}>
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
                                createTracker.isPending ||
                                (step === 1
                                    ? !formData.name?.trim() ||
                                      !formData.scenarioId?.trim()
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
                                      : false)
                            }
                        >
                            {createTracker.isPending
                                ? 'Creating...'
                                : step === 3
                                  ? 'Create Tracker'
                                  : 'Next Step'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const CreateTrackerPage = () => {
    return (
        <CreateTrackerProvider>
            <CreateTrackerForm />
        </CreateTrackerProvider>
    )
}

export const Route = createFileRoute('/dashboard/trackers/new')({
    component: CreateTrackerPage,
})
