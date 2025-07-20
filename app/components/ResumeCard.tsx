import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[#00D4AA]';
        if (score >= 60) return 'text-[#FFB347]';
        return 'text-[#FF6B6B]';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        return 'Needs Work';
    };

    return (
        <Link 
            to={`/resume/${id}`} 
            className="resume-card group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#00D4AA]/20 backdrop-blur-sm rounded-full border border-[#00D4AA]/30">
                    <div className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-[#00D4AA]">Analyzed</span>
                </div>
            </div>

            {/* Hover Overlay */}
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl z-20 flex items-end justify-center pb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                        <span className="text-white text-sm font-medium">Click to view detailed analysis</span>
                    </div>
                </div>
            )}

            <div className="resume-card-header">
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {companyName ? (
                                <h2 className="text-[color:var(--color-text-primary)] font-bold break-words text-xl">{companyName}</h2>
                            ) : (
                                <h2 className="text-[color:var(--color-text-primary)] font-bold text-xl">General Resume</h2>
                            )}
                            {jobTitle && (
                                <h3 className="text-base break-words text-[color:var(--color-text-secondary)] mt-1">{jobTitle}</h3>
                            )}
                        </div>
                        <div className="flex-shrink-0 ml-4">
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                    </div>
                    
                    {/* Score Summary */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-sm font-semibold ${getScoreColor(feedback.overallScore)}`}>
                            {getScoreLabel(feedback.overallScore)}
                        </span>
                        <span className="text-[color:var(--color-text-muted)] text-sm">•</span>
                        <span className="text-[color:var(--color-text-secondary)] text-sm">
                            {feedback.overallScore}/100 Overall Score
                        </span>
                    </div>
                </div>
            </div>

            {/* Resume Preview */}
            {resumeUrl && (
                <div className="relative overflow-hidden">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume preview"
                            className="w-full h-[280px] sm:h-[320px] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    
                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-xs">ATS: {feedback.ATS?.score || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-[#FFB347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span className="text-xs">Quality: {Math.round((feedback.content?.score + feedback.structure?.score) / 2) || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="text-xs text-[color:var(--color-text-secondary)]">
                                Click to review
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard