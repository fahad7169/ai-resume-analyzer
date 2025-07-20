import { cn } from "~/lib/utils";
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";


const ScoreBadge = ({ score }: { score: number }) => {
  const colorScheme = score > 69
    ? { bg: 'bg-[#00D4AA]/20', text: 'text-[#00D4AA]', icon: 'text-[#00D4AA]' }
    : score > 39
      ? { bg: 'bg-[#FFB347]/20', text: 'text-[#FFB347]', icon: 'text-[#FFB347]' }
      : { bg: 'bg-[#FF6B6B]/20', text: 'text-[#FF6B6B]', icon: 'text-[#FF6B6B]' };

  return (
      <div className={`flex flex-row gap-1 items-center px-3 py-1 rounded-full border border-[color:var(--color-border)]/30 ${colorScheme.bg}`}>
        {score > 69 ? (
          <svg className={`w-4 h-4 ${colorScheme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className={`w-4 h-4 ${colorScheme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        <p className={`text-sm font-medium ${colorScheme.text}`}>
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold text-[color:var(--color-text-primary)]">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-[color:var(--color-bg-primary)]/40 border border-[color:var(--color-border)]/30 w-full rounded-lg px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-center" key={index}>
                {tip.type === "good" ? (
                  <svg className="w-5 h-5 text-[#00D4AA] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#FFB347] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                <p className="text-base text-[color:var(--color-text-secondary)]">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-3 rounded-xl p-4 border",
                      tip.type === "good"
                          ? "bg-[#00D4AA]/10 border-[#00D4AA]/20"
                          : "bg-[#FFB347]/10 border-[#FFB347]/20"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                  {tip.type === "good" ? (
                    <svg className="w-5 h-5 text-[#00D4AA] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#FFB347] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  <p className={cn(
                    "text-lg font-semibold",
                    tip.type === "good" ? "text-[#00D4AA]" : "text-[#FFB347]"
                  )}>{tip.tip}</p>
                </div>
                <p className="text-[color:var(--color-text-secondary)] leading-relaxed">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="glass-effect rounded-2xl shadow-2xl w-full p-6 border border-[color:var(--color-border)]/50">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[color:var(--color-text-primary)] mb-2">Detailed Feedback</h3>
          <p className="text-[color:var(--color-text-secondary)]">Expand each section to see specific recommendations and tips.</p>
        </div>
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;