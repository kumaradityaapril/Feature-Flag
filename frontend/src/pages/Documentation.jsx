import React from 'react';

const Documentation = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      {/* Hero Header */}
      <section>
        <div className="flex items-center gap-3 text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Knowledge Base
        </div>
        <h1 className="text-4xl font-headline font-bold text-on-surface mb-4">Getting Started</h1>
        <p className="text-lg text-tertiary leading-relaxed">
          The Feature Flag Service provides a central hub for managing application toggles and real-time configuration overrides. This guide will help you integrate feature flags into your codebase.
        </p>
      </section>

      {/* Evaluation API */}
      <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8">
        <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Evaluation API
        </h2>
        <p className="text-sm text-tertiary mb-6">
          The core of the system is the <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">/evaluate</code> endpoint. Use this to determine if a feature should be enabled for a specific user context.
        </p>

        <div className="space-y-4">
          <div className="bg-[#0f172a] rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="bg-surface-container px-4 py-2 border-b border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">HTTP Request</span>
              <span className="text-[10px] font-mono text-primary">POST /evaluate</span>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[#93c5fd] overflow-x-auto">
{`{
  "flag_name": "new_beta_dashboard",
  "user_id": "user_12345",
  "context": {
    "country": "US",
    "version": "1.2.0"
  }
}`}
            </pre>
          </div>

          <div className="bg-[#0f172a] rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="bg-surface-container px-4 py-2 border-b border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">HTTP Response</span>
              <span className="text-[10px] font-mono text-[#4ade80]">200 OK</span>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[#4ade80] overflow-x-auto">
{`{
  "success": true,
  "data": {
    "enabled": true
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Target Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8">
          <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">person_search</span>
            Targeting Logic
          </h3>
          <ul className="space-y-4 text-xs text-tertiary list-none">
            <li className="flex gap-3">
              <span className="text-primary font-bold">01.</span>
              <span><strong>Explicit Whitelists</strong>: If a user ID is explicitly listed in the targeting rules, they will receive the flag value immediately.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">02.</span>
              <span><strong>Rollout Percentage</strong>: Users not whitelisted are subjected to a deterministic hash-based rollout. A user with "user_1" will always get the same result for a given flag.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">03.</span>
              <span><strong>Global Defaults</strong>: If no rollout percentage or whitelist is defined, the flag defaults to its global enabled state.</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8">
          <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffb4ab] text-xl">shield</span>
            The Kill Switch
          </h3>
          <p className="text-xs text-tertiary leading-relaxed mb-4">
            Safety is paramount. The <strong>Emergency Kill Switch</strong> is a high-priority override that instantly disables a feature flag globally, bypassing all targeting logic and rollout percentages.
          </p>
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-[10px] text-error flex items-center gap-3">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Once engaged, the flag service will return <strong>false</strong> for ALL evaluation requests.</span>
          </div>
        </section>
      </div>

      {/* SDK Implementation Tips */}
      <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8">
        <h2 className="text-2xl font-bold text-on-surface mb-6">SDK Implementation Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Local Caching', desc: 'Cache flag evaluations locally for 60s to minimize network latency.', icon: 'memory' },
            { title: 'Graceful Fallback', desc: 'Always default to FALSE in your code if the API is unreachable.', icon: 'error_outline' },
            { title: 'Contextual Evaluation', desc: 'Pass user metadata (location, version) for advanced rule matching.', icon: 'settings_input_component' }
          ].map((tip, i) => (
            <div key={i} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/5">
              <span className="material-symbols-outlined text-primary mb-3">{tip.icon}</span>
              <h4 className="text-xs font-bold text-on-surface mb-1">{tip.title}</h4>
              <p className="text-[10px] text-tertiary leading-normal">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Documentation;
