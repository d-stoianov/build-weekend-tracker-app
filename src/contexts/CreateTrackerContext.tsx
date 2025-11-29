import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from 'react'
import { CreateTrackerRequest } from '@/types/api'

interface CreateTrackerContextType {
    formData: CreateTrackerRequest
    step: number
    setStep: (step: number) => void
    updateFormData: (data: Partial<CreateTrackerRequest>) => void
    resetForm: () => void
}

const CreateTrackerContext = createContext<
    CreateTrackerContextType | undefined
>(undefined)

const initialFormData: CreateTrackerRequest = {
    name: '',
    description: '',
    scenarioId: '',
    parameters: {},
    frequency: {
        repeatEvery: '1',
        repeatUnit: 'day',
        repeatOn: [],
    },
}

export const CreateTrackerProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] =
        useState<CreateTrackerRequest>(initialFormData)

    const updateFormData = useCallback(
        (data: Partial<CreateTrackerRequest>) => {
            setFormData((prev) => {
                const updated: CreateTrackerRequest = {
                    ...prev,
                    ...data,
                    // Only merge parameters if data.parameters exists, otherwise keep prev.parameters
                    parameters: data.parameters
                        ? {
                              ...prev.parameters,
                              ...data.parameters,
                          }
                        : prev.parameters,
                    // Only merge frequency if data.frequency exists, otherwise keep prev.frequency
                    frequency: data.frequency
                        ? {
                              ...prev.frequency,
                              ...data.frequency,
                          }
                        : prev.frequency,
                }
                return updated
            })
        },
        []
    )

    const resetForm = useCallback(() => {
        setFormData(initialFormData)
        setStep(1)
    }, [])

    return (
        <CreateTrackerContext.Provider
            value={{
                formData,
                step,
                setStep,
                updateFormData,
                resetForm,
            }}
        >
            {children}
        </CreateTrackerContext.Provider>
    )
}

export const useCreateTrackerContext = () => {
    const context = useContext(CreateTrackerContext)
    if (context === undefined) {
        throw new Error(
            'useCreateTrackerContext must be used within a CreateTrackerProvider'
        )
    }
    return context
}
