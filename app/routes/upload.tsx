import {type FormEvent, useState} from 'react'
import Breadcrumb from "~/components/Breadcrumb";
import { ToastContainer } from "~/components/Toast";
import {usePuterStore} from "~/lib/puter";
import {useNavigate, Link} from "react-router";
import {prepareInstructions} from "../../constants";
import FileUploader from '~/components/FileUploader';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { useToast } from '~/hooks/useToast';

export default function Upload() {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        try {
            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                showError('Upload Failed', 'Failed to upload your resume. Please try again.');
                setIsProcessing(false);
                return;
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                showError('Conversion Failed', 'Failed to convert PDF to image. Please ensure your PDF is valid.');
                setIsProcessing(false);
                return;
            }

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            
            showSuccess('Analysis Complete!', 'Your resume has been analyzed successfully.');
            setIsProcessing(false);
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error('Analysis error:', error);
            showError('Analysis Failed', 'Something went wrong during the analysis. Please try again.');
            setIsProcessing(false);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) {
            showWarning('No File Selected', 'Please upload a resume file before analyzing.');
            return;
        }

        await handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[#0F172A] min-h-screen without-navbar">
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

            <section className="main-section">
                <div className="w-full max-w-6xl">
                    {/* Navigation */}
                    <div className="mb-6 sm:mb-8">
                        <Breadcrumb items={[{ label: "Upload Resume", current: true }]} />
                        <div className="flex items-center gap-2 mt-4">
                            <Link 
                                to="/" 
                                className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors group touch-manipulation"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full py-4 sm:py-8">
                    <div className="relative">
                        {/* Background decorative elements - Hidden on mobile */}
                        <div className="absolute inset-0 overflow-hidden hidden sm:block">
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/10 to-[#6366F1]/10 rounded-full blur-3xl"></div>
                        </div>
                        
                    
                    </div>
                    {isProcessing ? (
                        <div className="max-w-2xl mx-auto text-center px-4">
                            {/* Progress Steps - Mobile Responsive */}
                            <div className="flex items-center justify-center mb-8 sm:mb-12 overflow-x-auto">
                                <div className="flex items-center gap-2 sm:gap-4 min-w-max px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-green-400 font-medium text-sm sm:text-base">Upload & Details</span>
                                    </div>
                                    <div className="w-8 sm:w-12 h-px bg-[#6366F1]"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <span className="text-[#6366F1] font-medium text-sm sm:text-base">AI Analysis</span>
                                    </div>
                                    <div className="w-8 sm:w-12 h-px bg-[#334155]"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#334155] rounded-full flex items-center justify-center">
                                            <span className="text-[#64748B] text-xs sm:text-sm font-semibold">3</span>
                                        </div>
                                        <span className="text-[#64748B] font-medium text-sm sm:text-base">Results</span>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Card - Mobile Responsive */}
                            <div className="bg-[#1E293B]/80 backdrop-blur-lg border border-[#334155] rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
                                <div className="flex items-center justify-center mb-4 sm:mb-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Analyzing Your Resume</h3>
                                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                    <p className="text-base sm:text-lg text-[#6366F1] font-medium">{statusText}</p>
                                    <p className="text-sm sm:text-base text-[#94A3B8]">Our AI is working on providing you with personalized feedback and ATS optimization tips.</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-[#334155] rounded-full h-2 mb-4 sm:mb-6">
                                    <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                </div>

                                {/* Analysis Steps - Mobile Responsive */}
                                <div className="space-y-3 sm:space-y-4 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-green-400 font-medium text-sm sm:text-base">Document processed successfully</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#6366F1] rounded-full flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                        <span className="text-[#6366F1] font-medium text-sm sm:text-base">Running AI analysis...</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#334155] rounded-full flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#64748B] rounded-full"></div>
                                        </div>
                                        <span className="text-[#64748B] text-sm sm:text-base">Generating recommendations</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs sm:text-sm text-[#64748B]">
                                    ⏱️ This usually takes 30-60 seconds
                                </p>
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-center px-4 text-xl sm:text-2xl lg:text-3xl text-[#A5B4C7] mb-6">Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <div className="w-full max-w-6xl mx-auto">
                            {/* Premium Progress Indicator - Mobile Responsive */}
                            <div className="flex items-center justify-center mb-6 sm:mb-12">
                                <div className="glass-effect rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 border border-[#2A3441]/50 w-full max-w-sm sm:max-w-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-white text-xs font-bold">1</span>
                                            </div>
                                            <span className="text-white font-medium text-xs sm:text-sm text-center leading-tight">Setup<br className="sm:hidden"/>& Upload</span>
                                        </div>
                                        <div className="flex-1 mx-2 sm:mx-3 h-0.5 bg-gradient-to-r from-[#4F75FF] to-[#2A3441] rounded-full"></div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2A3441] rounded-full flex items-center justify-center">
                                                <span className="text-[#6B7A8F] text-xs font-semibold">2</span>
                                            </div>
                                            <span className="text-[#6B7A8F] font-medium text-xs sm:text-sm text-center leading-tight">AI<br className="sm:hidden"/>Analysis</span>
                                        </div>
                                        <div className="flex-1 mx-2 sm:mx-3 h-0.5 bg-[#2A3441] rounded-full"></div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2A3441] rounded-full flex items-center justify-center">
                                                <span className="text-[#6B7A8F] text-xs font-semibold">3</span>
                                            </div>
                                            <span className="text-[#6B7A8F] font-medium text-xs sm:text-sm text-center leading-tight">Results</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form id="upload-form" onSubmit={handleSubmit} className="space-y-1 lg:space-y-0">
                                {/* Desktop Side-by-Side Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                {/* Job Details Section - Mobile Responsive */}
                                <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl relative overflow-hidden border border-[#2A3441]/50">
                                    {/* Decorative background - Hidden on mobile */}
                                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#4F75FF]/20 to-transparent rounded-full blur-2xl hidden sm:block"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V8a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v-.5A2.5 2.5 0 0110.5 3h3A2.5 2.5 0 0116 5.5V6m-8 0h8" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-[#A5B4C7] bg-clip-text text-transparent">Job Details</h3>
                                                <p className="text-[#A5B4C7] text-sm sm:text-lg">Help us provide better, targeted feedback</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                                            <div className="space-y-2">
                                                <label htmlFor="company-name" className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-white font-medium text-sm sm:text-base">
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#4F75FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    Company Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="company-name" 
                                                    placeholder="e.g., Google, Microsoft, Apple..." 
                                                    id="company-name"
                                                    className="w-full p-3 sm:p-4 bg-[#0A0E1A]/60 border border-[#2A3441] rounded-xl text-white placeholder-[#6B7A8F] focus:border-[#4F75FF] focus:ring-2 focus:ring-[#4F75FF]/20 transition-all text-sm sm:text-base"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="job-title" className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-white font-medium text-sm sm:text-base">
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#4F75FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V8a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v-.5A2.5 2.5 0 0110.5 3h3A2.5 2.5 0 0116 5.5V6m-8 0h8" />
                                                        </svg>
                                                    </div>
                                                    Job Title
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="job-title" 
                                                    placeholder="e.g., Software Engineer, Product Manager..." 
                                                    id="job-title"
                                                    className="w-full p-3 sm:p-4 bg-[#0A0E1A]/60 border border-[#2A3441] rounded-xl text-white placeholder-[#6B7A8F] focus:border-[#4F75FF] focus:ring-2 focus:ring-[#4F75FF]/20 transition-all text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 sm:mt-8 space-y-2">
                                            <label htmlFor="job-description" className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-white font-medium text-sm sm:text-base">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#4F75FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                Job Description
                                            </label>
                                            <textarea 
                                                rows={4} 
                                                name="job-description" 
                                                placeholder="Paste the complete job description here for more targeted, accurate feedback..." 
                                                id="job-description"
                                                className="w-full p-3 sm:p-4 bg-[#0A0E1A]/60 border border-[#2A3441] rounded-xl text-white placeholder-[#6B7A8F] focus:border-[#4F75FF] focus:ring-2 focus:ring-[#4F75FF]/20 transition-all resize-none text-sm sm:text-base"
                                            />
                                            <div className="flex items-start gap-2 sm:gap-3 mt-3 p-3 bg-[#4F75FF]/10 border border-[#4F75FF]/20 rounded-xl">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F75FF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-xs sm:text-sm text-[#A5B4C7]">
                                                    <span className="text-[#4F75FF] font-medium">Pro tip:</span> Including the job description helps our AI provide specific ATS optimization and keyword suggestions tailored to this role.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Section - Enhanced Design */}
                                <div className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/95 backdrop-blur-xl border border-[#334155]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
                                    {/* Enhanced Decorative Elements */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#4F75FF]/10 to-[#8B5CF6]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#FF6B6B]/10 to-transparent rounded-full blur-2xl"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-6">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#4F75FF] via-[#8B5CF6] to-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-[#A5B4C7] to-[#4F75FF] bg-clip-text text-transparent">Upload Your Resume</h3>
                                                <p className="text-[#A5B4C7] text-sm sm:text-base font-medium">PDF format • Maximum 20MB • Secure & private</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative bg-gradient-to-br from-[#0A0E1A]/60 to-[#1A2332]/60 border-2 border-dashed border-[#4F75FF]/40 rounded-2xl p-4 sm:p-8 hover:border-[#4F75FF]/70 hover:from-[#4F75FF]/5 hover:to-[#8B5CF6]/5 transition-all duration-300 group/upload backdrop-blur-sm">
                                            {/* Animated background on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#4F75FF]/0 to-[#8B5CF6]/0 group-hover/upload:from-[#4F75FF]/10 group-hover/upload:to-[#8B5CF6]/10 rounded-2xl transition-all duration-500"></div>
                                            <div className="relative z-10">
                                                <FileUploader onFileSelect={handleFileSelect} />
                                            </div>
                                        </div>
                                        
                                        {file && (
                                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#4F75FF]/10 border border-[#4F75FF]/20 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4F75FF] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white font-medium text-sm sm:text-base">Ready to analyze!</p>
                                                        <p className="text-[#A5B4C7] text-xs sm:text-sm">Your resume has been uploaded successfully</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </div>

                                {/* Premium Action Button - Mobile Responsive */}
                                <div className="flex justify-end sm:justify-center self-end sm:self-start">
                                    <button 
                                        className="relative py-2 sm:py-4 px-4 sm:px-12 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3 shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 group overflow-hidden w-auto sm:w-full max-w-fit sm:max-w-md touch-manipulation text-white transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F75FF 0%, #FF6B6B 50%, #FFB347 100%)',
                                            boxShadow: '0 8px 32px 0 rgba(79, 117, 255, 0.4)'
                                        }}
                                        type="submit"
                                        disabled={!file}
                                    >
                                        {/* Animated background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="relative z-10 flex items-center gap-2 sm:gap-3 justify-center">
                                            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-center">
                                                <span className="sm:hidden">{file ? 'Analyze' : 'Upload'}</span>
                                                <span className="hidden sm:inline">{file ? 'Start AI Analysis' : 'Upload Resume to Continue'}</span>
                                            </span>
                                            <svg className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
        </section>
    </main>
    );
}