import type { ProblemStatement } from "@/lib/events/schema";

export function ChallengeDocument({
  statement,
}: {
  statement: ProblemStatement;
}) {
  return (
    <div className="challenge-document-body">
      <section>
        <h3>The challenge</h3>
        <p>{statement.objective}</p>
      </section>
      {statement.runtime && (
        <section>
          <h3>Runtime & stack</h3>
          <dl className="challenge-specs">
            <div>
              <dt>Platform</dt>
              <dd>{statement.runtime.target}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{statement.runtime.description}</dd>
            </div>
            {statement.runtime.mandate && (
              <div>
                <dt>Evaluation</dt>
                <dd>{statement.runtime.mandate}</dd>
              </div>
            )}
          </dl>
        </section>
      )}
      {Boolean(statement.specs?.length) && (
        <section>
          <h3>Specifications</h3>
          <dl className="challenge-specs">
            {statement.specs?.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {statement.architecture && (
        <section>
          <h3>Architecture & flow</h3>
          <p>{statement.architecture.summary}</p>
          {statement.architecture.steps && (
            <ol className="challenge-steps">
              {statement.architecture.steps.map((step) => (
                <li key={step.step}>
                  <h4>{step.step}</h4>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          )}
          {statement.architecture.notes?.map((note) => (
            <aside className="challenge-note" key={note}>
              <strong>Evaluation note</strong>
              <p>{note}</p>
            </aside>
          ))}
        </section>
      )}
      {Boolean(statement.coreFeatures?.length) && (
        <section>
          <h3>What to build</h3>
          <div className="challenge-features">
            {statement.coreFeatures?.map((feature) => (
              <div key={feature.title}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {statement.hardRequirements.length > 0 && (
        <section>
          <h3>Requirements</h3>
          <ul>
            {statement.hardRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </section>
      )}
      {statement.strictlyProhibited.length > 0 && (
        <section>
          <h3>Not allowed</h3>
          <ul>
            {statement.strictlyProhibited.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      )}
      {Boolean(statement.bonusPoints?.length) && (
        <section>
          <h3>Bonus points</h3>
          <ul>
            {statement.bonusPoints?.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
