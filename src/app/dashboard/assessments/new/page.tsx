"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAssessmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    targets: "",
    resumeText: "",
    goals: "",
    constraints: ""
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.targets.trim()) {
      newErrors.targets = "Target schools are required";
    }

    if (!formData.resumeText.trim()) {
      newErrors.resumeText = "Resume text is required";
    }

    if (!formData.goals.trim()) {
      newErrors.goals = "Goals are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const targets = formData.targets.split(',').map(s => s.trim()).filter(s => s);
      
      const response = await fetch('/api/assessment/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targets,
          resumeText: formData.resumeText,
          goals: formData.goals,
          constraints: formData.constraints || undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/assessments/${data.assessmentId}`);
      } else {
        const errorData = await response.json();
        console.error('Assessment creation failed:', errorData);
        alert('Failed to create assessment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">New Assessment</h1>
        <p className="text-muted-foreground">
          Tell us about your background and targets to get your personalized MBA admission assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Schools */}
        <div>
          <label htmlFor="targets" className="block text-sm font-medium mb-2">
            Target Schools *
          </label>
          <input
            type="text"
            id="targets"
            value={formData.targets}
            onChange={(e) => handleInputChange('targets', e.target.value)}
            placeholder="Harvard Business School, Stanford GSB, Wharton..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.targets ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.targets && (
            <p className="mt-1 text-sm text-red-600">{errors.targets}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Separate multiple schools with commas
          </p>
        </div>

        {/* Resume Text */}
        <div>
          <label htmlFor="resumeText" className="block text-sm font-medium mb-2">
            Resume Summary *
          </label>
          <textarea
            id="resumeText"
            value={formData.resumeText}
            onChange={(e) => handleInputChange('resumeText', e.target.value)}
            placeholder="Paste your resume or provide a summary of your work experience, education, and achievements..."
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical ${
              errors.resumeText ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.resumeText && (
            <p className="mt-1 text-sm text-red-600">{errors.resumeText}</p>
          )}
        </div>

        {/* Goals */}
        <div>
          <label htmlFor="goals" className="block text-sm font-medium mb-2">
            Post-MBA Goals *
          </label>
          <textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => handleInputChange('goals', e.target.value)}
            placeholder="Describe your short-term and long-term career goals after your MBA..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical ${
              errors.goals ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.goals && (
            <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
          )}
        </div>

        {/* Constraints */}
        <div>
          <label htmlFor="constraints" className="block text-sm font-medium mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => handleInputChange('constraints', e.target.value)}
            placeholder="Any constraints, preferences, or additional context that might affect your application..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Optional: Geographic preferences, timing constraints, etc.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Assessment..." : "Create Assessment"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 