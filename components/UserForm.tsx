'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { UserFormData, userSchema } from '@/lib/validation';
import { generateAndDownloadPDF } from '@/lib/pdf-generator';
import { enhanceDescription } from '@/lib/groq-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, Sparkles, Loader2 } from 'lucide-react';

export default function UserForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const watchedDescription = watch('description');
  const watchedPosition = watch('position');

  const saveToStorage = (data: UserFormData) => {
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  };
useEffect(() => {
  const fromPreview = sessionStorage.getItem('fromPreview');

  if (fromPreview) {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const parsed: Partial<UserFormData> = JSON.parse(savedData);

        Object.entries(parsed).forEach(([key, value]) => {
          setValue(key as keyof UserFormData, value as string); // Safe cast here
        });
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
      }
    }

    sessionStorage.removeItem('fromPreview');
  } else {
    localStorage.removeItem('userData'); // Clear on fresh load
  }
}, [setValue]);

  const handleEnhanceWithAI = async () => {
    const currentData = getValues();
    if (!currentData.description && !currentData.position) {
      alert('Please fill in at least the position or description fields to use AI enhancement.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceDescription(
        currentData.description || '',
        currentData.position || ''
      );

      setValue('description', enhanced);

      const updatedData = { ...currentData, description: enhanced };
      saveToStorage(updatedData);
    } catch (error) {
      console.error('AI enhancement failed:', error);
      alert('AI enhancement failed. Please check your API key and try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleViewPDF = handleSubmit((data) => {
    saveToStorage(data);
    sessionStorage.setItem('fromPreview', 'true');
    router.push('/preview');
  });

  const handleDownloadPDF = handleSubmit(async (data) => {
    setIsSubmitting(true);
    const sanitizedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position ?? '',
      description: data.description ?? '',
    };
    saveToStorage(sanitizedData);

    try {
      await generateAndDownloadPDF(sanitizedData);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">AI-Enhanced PDF Generator</h1>
          <p className="text-slate-600 text-lg">Create professional documents with AI-powered enhancements</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center font-semibold text-slate-700">
              Professional Profile Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="Enter your position (optional)"
                    {...register('position')}
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description about yourself (optional)"
                  {...register('description')}
                  className="min-h-[120px] resize-none pr-12"
                />
                <Button
                  type="button"
                  onClick={handleEnhanceWithAI}
                  disabled={isEnhancing || (!watchedDescription && !watchedPosition)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>
                <p className="text-xs text-slate-500 pl-1">
                  Click the ✨ button to enhance your description with AI
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleViewPDF}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View PDF
                </Button>
                <Button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 text-lg font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-slate-500">
          * Required fields must be completed • Enhanced with AI-powered features
        </div>
      </div>
    </div>
  );
}
