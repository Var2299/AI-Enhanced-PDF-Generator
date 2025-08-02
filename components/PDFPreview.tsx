'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserData, AIEnhancements } from '@/types/user';
import { generateAndDownloadPDF } from '@/lib/pdf-generator';
import { generateProfessionalSummary, suggestSkills } from '@/lib/groq-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  FileText,
  Sparkles,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  FileUser,
  Award,
} from 'lucide-react';

export default function PDFPreview() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiEnhancements, setAiEnhancements] = useState<AIEnhancements>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Helper to load enhancements from sessionStorage
  const loadStoredEnhancements = (): AIEnhancements | null => {
    const stored = sessionStorage.getItem('aiEnhancements');
    return stored ? JSON.parse(stored) : null;
  };

  // Helper to persist enhancements
  const storeEnhancements = (enh: AIEnhancements) => {
    sessionStorage.setItem('aiEnhancements', JSON.stringify(enh));
  };

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const data: UserData = JSON.parse(savedData);
      setUserData(data);

      // Try to restore previously stored AI enhancements
      const prev = loadStoredEnhancements();
      if (prev && prev.professionalSummary) {
        setAiEnhancements(prev);
      } else {
        loadAIEnhancements(data);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const loadAIEnhancements = async (data: UserData) => {
    if (!data.description && !data.position) return;

    setIsLoadingAI(true);
    try {
      const [summary, skills] = await Promise.all([
        generateProfessionalSummary(data.name, data.position, data.description),
        suggestSkills(data.position, data.description),
      ]);
      const enh: AIEnhancements = {
        professionalSummary: summary,
        suggestedSkills: skills,
      };
      setAiEnhancements(enh);
      storeEnhancements(enh);
    } catch (error) {
      console.error('Failed to load AI enhancements:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleDownload = async () => {
    if (userData) {
      setIsDownloading(true);
      try {
        await generateAndDownloadPDF(userData, aiEnhancements);
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF generation failed. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">AI-Enhanced PDF Preview</h1>
          <p className="text-slate-600 text-lg">Review your professional profile with AI enhancements</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* -- PDF Preview Pane -- */}
          <div className="flex-1 lg:flex-[2]">
            <Card className="shadow-2xl border-0 bg-white overflow-hidden">
              <CardHeader className="pb-5">
                <CardTitle className="text-2xl text-center font-bold text-slate-800 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Professional Profile Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl min-h-[700px] space-y-8">
                  {/* Header */}
                  <div className="text-center border-b-4 border-blue-500 pb-6">
                    <h1 className="text-4xl font-bold text-blue-600 mb-1">{userData.name}</h1>
                    <p className="text-xl text-slate-600">{userData.position || 'Professional'}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Generated on{' '}
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">{userData.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {aiEnhancements.professionalSummary && (
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-green-500" /> AI-Generated Professional Summary
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{aiEnhancements.professionalSummary}</p>
                    </div>
                  )}

                  {/* Description */}
                  {userData.description && (
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileUser className="w-5 h-5 text-purple-500" /> Description
                      </h3>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{userData.description}</p>
                    </div>
                  )}

                  {/* AI Skills */}
                  {Array.isArray(aiEnhancements.suggestedSkills) && aiEnhancements.suggestedSkills.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" /> AI-Suggested Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {aiEnhancements.suggestedSkills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loading */}
                  {isLoadingAI && (
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500 flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                      <span className="text-slate-700">Loading AI enhancements...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* -- Actions Panel -- */}
          <div className="lg:w-96">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm sticky top-8 space-y-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Actions & Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 space-y-3">
                  <h3 className="font-bold text-blue-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Document Summary
                  </h3>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div className="flex gap-2 items-start">
                      <User className="w-4 h-4 mt-0.5" />
                      <div>
                        <span className="font-medium">Name:</span> {userData.name}
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Mail className="w-4 h-4 mt-0.5" />
                      <div>
                        <span className="font-medium">Email:</span> {userData.email}
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Phone className="w-4 h-4 mt-0.5" />
                      <div>
                        <span className="font-medium">Phone:</span> {userData.phone}
                      </div>
                    </div>
                    {userData.position && (
                      <div className="flex gap-2 items-start">
                        <Briefcase className="w-4 h-4 mt-0.5" />
                        <div>
                          <span className="font-medium">Position:</span> {userData.position}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Status */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200 space-y-3">
                  <h3 className="font-bold text-purple-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Enhancements
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700">Professional Summary</span>
                      <Badge variant={aiEnhancements.professionalSummary ? 'default' : 'secondary'} className="text-xs">
                        {aiEnhancements.professionalSummary ? '✓ Generated' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700">Skill Suggestions</span>
                      <Badge
                        variant={aiEnhancements.suggestedSkills?.length ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {aiEnhancements.suggestedSkills?.length
                          ? `✓ ${aiEnhancements.suggestedSkills.length} skills`
                          : 'Pending'}
                      </Badge>
                    </div>
                    {isLoadingAI && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Loading AI features...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 py-3 transition-all hover:scale-[1.02]"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Form
                </Button>

                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 transition-all hover:scale-[1.02] shadow-lg"
                  size="lg"
                >
                  {isDownloading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </Button>

                <div className="text-xs text-slate-500 text-center mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium mb-1">📄 High-quality PDF generation</p>
                  <p>🤖 AI-enhanced content included</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
