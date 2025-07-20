import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";


const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-[#00D4AA]'
            : score > 49
        ? 'text-[#FFB347]' : 'text-[#FF6B6B]';

    return (
        <div className="p-4 glass-effect rounded-xl border border-[#2A3441]/50">
            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="flex flex-row gap-3 items-center">
                    <p className="text-xl font-semibold text-white">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-xl font-bold">
                    <span className={textColor}>{score}</span>
                    <span className="text-[#6B7A8F]">/100</span>
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="glass-effect rounded-2xl shadow-2xl w-full border border-[#2A3441]/50">
            <div className="flex flex-row items-center p-6 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-white">Your Resume Score</h2>
                    <p className="text-sm text-[#A5B4C7]">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <div className="p-6 pt-0 space-y-4">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary