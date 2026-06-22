import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bot, Brain, Code2, TestTube2, FileText, Container,
  Sparkles, ArrowRight, Github, ExternalLink, Cpu, Layers,
  Workflow as WorkflowIcon, Rocket, Menu, X, ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import AgentWorkspace from "@/components/AgentWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Software Engineering Agency — Autonomous Full-Stack Delivery" },
      { name: "description", content: "An autonomous AI engineering team that designs, builds, tests, documents and deploys production-ready full-stack applications." },
      { property: "og:title", content: "AI Software Engineering Agency" },
      { property: "og:description", content: "Build production-ready applications with an autonomous AI engineering team." },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "#home"], ["Workspace", "#workspace"], ["Features", "#features"], ["Workflow", "#workflow"],
    ["Technology", "#technology"], ["Projects", "#projects"], ["Documentation", "#docs"],
  ];
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <a href="#home" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-[var(--shadow-glow)]">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">
              AI Software <span className="text-gradient">Engineering</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <a href="/sign-in" className="rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Sign In
            </a>
            <a href="#workspace" className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]">
              Build Your Own API
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <button onClick={() => setOpen(v => !v)} className="rounded-md p-2 md:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">{label}</a>
            ))}
            <a href="#workspace" className="mt-1 rounded-lg bg-gradient-brand px-3 py-2 text-center text-sm font-semibold text-white">Build Your Own API</a>
          </div>
        )}
      </div>
    </header>
  );
}

const AGENTS = [
  { name: "Product Manager", icon: Brain, desc: "Translates ideas into specs, user stories and acceptance criteria." },
  { name: "Software Architect", icon: Layers, desc: "Designs scalable systems, data models and service boundaries." },
  { name: "Backend Developer", icon: Cpu, desc: "Implements APIs, business logic and integrations end-to-end." },
  { name: "Frontend Developer", icon: Code2, desc: "Builds responsive UIs with modern frameworks and design systems." },
  { name: "QA Tester", icon: TestTube2, desc: "Writes and runs unit, integration and end-to-end tests automatically." },
  { name: "Tech Writer", icon: FileText, desc: "Generates README, API docs and architecture diagrams on every change." },
];

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-24 sm:pt-16">
      {/* floating orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
        <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-secondary/30 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.2s" }} />
        <div className="absolute left-1/2 bottom-0 h-80 w-80 -translate-x-1/2 rounded-full bg-highlight/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "2.4s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Autonomous engineering team · powered by multi-agent AI
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Build production-ready apps with an{" "}
            <span className="text-gradient">autonomous AI engineering team</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From requirements to deployment, our AI agents collaborate like a complete
            software company — delivering full-stack applications with minimal human intervention.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#workspace" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow-strong)] transition-transform hover:scale-[1.03]">
              Launch AI Sandbox <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#projects" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-foreground hover:bg-white/5">
              View Projects
            </a>
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="relative mx-auto mt-16 max-w-5xl">
          <div className="glass glow-border rounded-3xl p-4 sm:p-6">
            <div className="flex items-center gap-2 px-2 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-chart-5/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">agency.console — multi-agent workflow</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {AGENTS.map((a, i) => (
                <div key={a.name} className="glass relative overflow-hidden rounded-2xl p-4 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand">
                      <a.icon className="h-4.5 w-4.5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{a.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-success">● active</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-2/3 rounded-full bg-gradient-brand" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Brain, title: "Autonomous Product Planning", desc: "AI translates raw ideas into structured PRDs, user stories and milestones." },
  { icon: Layers, title: "Intelligent System Architecture", desc: "Generates scalable architectures, data models and service contracts." },
  { icon: Code2, title: "Full-Stack Code Generation", desc: "Backend APIs and frontend UIs written, refactored and reviewed by agents." },
  { icon: TestTube2, title: "Automated Testing Pipeline", desc: "Unit, integration and E2E tests authored and executed continuously." },
  { icon: FileText, title: "Documentation Generation", desc: "READMEs, API references and architecture diagrams stay always in sync." },
  { icon: Container, title: "Docker-Based Deployment", desc: "Containerized, reproducible builds shipped to any cloud or edge runtime." },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Everything an engineering org does — <span className="text-gradient">automated</span></h2>
          <p className="mt-4 text-muted-foreground">Six specialized AI agents replace the bottlenecks of a traditional software team.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass glow-border group relative rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-[var(--shadow-glow)]">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [{ name: "User Idea", icon: Sparkles }, ...AGENTS, { name: "Deployment", icon: Rocket }];
  return (
    <section id="workflow" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">How the <span className="text-gradient">AI team</span> works</h2>
          <p className="mt-4 text-muted-foreground">A coordinated pipeline of agents — each handing off context to the next.</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}
              className="glass glow-border relative rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand">
                  <s.icon className="h-4.5 w-4.5 text-white" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{s.name}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {"desc" in s ? (s as { desc: string }).desc : i === 0 ? "Your prompt or business goal kicks off the pipeline." : "Containerized release with rollback and observability."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-highlight">
                <span className="h-1 w-1 rounded-full bg-highlight" /> handoff ready
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TECH = [
  { name: "LangGraph", desc: "Multi-agent orchestration" },
  { name: "FastAPI", desc: "High-performance Python APIs" },
  { name: "React", desc: "Modern frontend framework" },
  { name: "Docker", desc: "Reproducible deployments" },
  { name: "Python", desc: "Agent runtime & tooling" },
  { name: "REST APIs", desc: "Standard service contracts" },
];

function Technology() {
  return (
    <section id="technology" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Built on a <span className="text-gradient">modern stack</span></h2>
          <p className="mt-4 text-muted-foreground">Battle-tested tools wired together by an agent runtime.</p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {TECH.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass glow-border group relative rounded-2xl p-5 text-center transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand opacity-90 group-hover:animate-pulse-glow">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <p className="font-display text-sm font-semibold">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  { title: "Realtime Analytics API", desc: "Multi-tenant analytics service generated end-to-end with auth, billing and dashboards.", stack: ["FastAPI", "Postgres", "React", "Docker"] },
  { title: "AI Knowledge Workspace", desc: "Document ingestion, embeddings and RAG search built by the agent team in one run.", stack: ["LangGraph", "Pinecone", "Next.js"] },
  { title: "Workflow Automation SaaS", desc: "Visual builder with task scheduling, retries and full audit log — autogenerated.", stack: ["Python", "Celery", "React"] },
];

function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Shipped by the <span className="text-gradient">AI agency</span></h2>
          <p className="mt-4 text-muted-foreground">A glimpse of full-stack systems delivered autonomously.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass glow-border group overflow-hidden rounded-2xl">
              <div className="relative h-44 overflow-hidden bg-gradient-brand">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)" }} />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur">case study</span>
                  <WorkflowIcon className="h-5 w-5 text-white/80" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map(s => (
                    <span key={s} className="rounded-md border border-border bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <a href="#" className="glass inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-white/5">
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                  <a href="#" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-2 text-xs font-semibold text-white">
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "6", label: "AI Agents" },
  { value: "100%", label: "Automated Workflow" },
  { value: "Full-Stack", label: "Development" },
  { value: "24/7", label: "Continuous Testing" },
];

function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass glow-border rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="text-center">
                <p className="font-display text-3xl font-extrabold sm:text-5xl text-gradient">{s.value}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="glass glow-border relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
          <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> Production-ready output
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-5xl">
            Start building with <span className="text-gradient">AI today</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Generate APIs, applications and production-ready systems using a fully autonomous engineering team.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#workspace" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow-strong)] transition-transform hover:scale-[1.03]">
              Build Your Own API <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#projects" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/5">
              Explore Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Workflow", "Technology", "Projects"] },
    { title: "Resources", links: ["Documentation", "Changelog", "Guides", "Blog"] },
    { title: "Company", links: ["About", "Contact", "Careers", "Press"] },
    { title: "Connect", links: ["GitHub", "Twitter", "LinkedIn", "Discord"] },
  ];
  return (
    <footer id="docs" className="border-t border-border/60 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
                <Bot className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-sm font-bold">AI Software Engineering Agency</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              An autonomous AI engineering team that designs, builds, tests, documents and deploys full-stack applications.
            </p>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <p className="font-display text-sm font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map(l => (
                  <li key={l}><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AI Software Engineering Agency. All rights reserved.</p>
          <p>Built with autonomous agents.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <AgentWorkspace />
        <Features />
        <Workflow />
        <Technology />
        <Projects />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
