import { ProjectCreateFormData } from '../../types';

export interface StepProps {
    formData: ProjectCreateFormData;
    updateFormData: (data: Partial<ProjectCreateFormData>) => void;
    onNext: () => void;
    onPrev: () => void;
}
