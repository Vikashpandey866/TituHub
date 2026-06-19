export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" copy="TituHub protects customer account, order and booking information with secure platform practices." />;
}

function PolicyPage({ title, copy }) {
  return <section className="section-shell"><div className="premium-panel mx-auto max-w-3xl p-6"><h1 className="font-heading text-3xl font-extrabold">{title}</h1><p className="mt-3 text-sm leading-6 text-zinc-500">{copy}</p></div></section>;
}
