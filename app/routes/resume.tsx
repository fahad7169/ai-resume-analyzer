import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";


export const meta = () => ([
    { title: 'ResumeX | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="min-h-screen with-navbar">
            <nav className="fixed top-4 left-4 right-4 z-40">
                <div className="glass-effect rounded-2xl px-6 py-4 max-w-7xl mx-auto border border-[color:var(--color-border)]/50">
                    <Link to="/" className="back-button">
                        <svg className="w-4 h-4 text-[color:var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-[color:var(--color-text-secondary)] text-sm font-semibold">Back to Homepage</span>
                    </Link>
                </div>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse pt-8">
                <section className="w-1/2 max-lg:w-full px-8 max-lg:px-4 py-6 flex items-center justify-center sticky top-24 h-[calc(100vh-6rem)]">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 glass-effect max-sm:m-0 h-full w-full p-4 rounded-3xl border border-[color:var(--color-border)]/50">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="w-1/2 max-lg:w-full px-8 max-lg:px-4 py-6">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-[color:var(--color-text-primary)] mb-2">Resume Review</h2>
                        <p className="text-[color:var(--color-text-secondary)] text-lg">Detailed analysis and recommendations for your resume</p>
                    </div>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <img src="/images/resume-scan-2.gif" className="w-64 mb-4" />
                            <p className="text-[color:var(--color-text-secondary)] text-lg">Loading your resume analysis...</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume