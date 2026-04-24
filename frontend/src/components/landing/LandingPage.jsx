import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Utensils,
  ArrowRight,
  CreditCard,
  LayoutGrid,
  ChefHat,
  BarChart3,
  CheckCircle2,
  Star,
  Quote,
  Smartphone,
  Receipt,
} from "lucide-react";
import { Button } from "../ui/button.jsx";
import heroImage from "../../assets/hero-table.jpg";

const Header = () => (
  <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Utensils className="h-4 w-4" />
        </span>
        <span className="font-display text-xl font-bold tracking-tight">
          Dine Flow
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
        <a href="#features" className="transition-colors hover:text-foreground">
          Features
        </a>
        <a href="#how" className="transition-colors hover:text-foreground">
          How it works
        </a>
        <a href="#pricing" className="transition-colors hover:text-foreground">
          Pricing
        </a>
        <a href="#faq" className="transition-colors hover:text-foreground">
          FAQ
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <Link to="/sign-in">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get started
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden bg-hero-gradient">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          Trusted by 20K+ restaurants
        </span>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
          The flow your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-2 -z-0 h-3 rounded-full bg-highlight/80" />
            <span className="relative italic">restaurant</span>
          </span>
          <br /> has been waiting for.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Dine Flow is the modern POS that runs orders, tables, kitchen and
          payments in one calm, beautiful workspace — from the front of house to
          the back office.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/sign-up/$" params={{ _splat: "" }}>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Get started free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-foreground/20">
            Watch demo
          </Button>
        </div>
        <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
          {[
            { k: "20K+", v: "Restaurants" },
            { k: "32M+", v: "Orders / mo" },
            { k: "4.8", v: "Avg rating" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-2xl font-bold text-foreground">
                {s.k}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-3xl bg-highlight md:block" />
        <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-full bg-mint md:block" />
        <div className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-border">
          <img
            src={heroImage}
            alt="Dine Flow restaurant POS in use on a beautifully set table"
            className="h-full w-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card ring-1 ring-border"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs text-muted-foreground">
              New order · Table 12
            </div>
            <div className="text-sm font-semibold">$84.50 paid</div>
          </div>
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const features = [
  {
    icon: LayoutGrid,
    title: "Table management",
    desc: "Drag-and-drop floor plans with live status, merges and waitlists.",
  },
  {
    icon: ChefHat,
    title: "Kitchen display",
    desc: "Tickets fly straight to the right station with timers and recall.",
  },
  {
    icon: CreditCard,
    title: "Integrated payments",
    desc: "Split, tip, refund and tap-to-pay — all from the same screen.",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    desc: "Sales, labor and item performance updated minute by minute.",
  },
  {
    icon: Smartphone,
    title: "QR & online orders",
    desc: "Customers order from their phone, sent straight to your POS.",
  },
  {
    icon: Utensils,
    title: "Inventory & menu",
    desc: "86 items in one tap, low-stock alerts and recipe-level costs.",
  },
];

const Features = () => (
  <section id="features" className="py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Features
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Everything you need, nothing you don't.
        </h2>
        <p className="mt-4 text-muted-foreground">
          A single workspace that replaces five disconnected tools — designed
          for service.
        </p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-primary">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how" className="bg-primary py-24 text-primary-foreground">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
          How it works
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          From first tap to last receipt — under a minute.
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          Set up your menu, invite your team, plug in a card reader. Dine Flow
          handles the rest.
        </p>
        <div className="mt-8 space-y-4">
          {[
            "Build your menu in minutes with drag-and-drop categories",
            "Invite servers, hosts and managers with role-based permissions",
            "Track every order from chair to kitchen to bill — in real time",
            "Close the night with one-click reports and payouts",
          ].map((line) => (
            <div key={line} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
              <p className="text-primary-foreground/90">{line}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/sign-up/$" params={{ _splat: "" }}>
            <Button
              size="lg"
              className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
            >
              Start your free trial <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="rounded-3xl bg-card p-6 text-card-foreground shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Tonight</div>
              <div className="font-display text-2xl font-bold">$4,820</div>
            </div>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-primary">
              +18% vs last week
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "42", v: "Orders" },
              { k: "12", v: "Tables open" },
              { k: "6", v: "Avg / table" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-muted p-3">
                <div className="font-display text-xl font-bold">{s.k}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {[
              {
                t: "Table 4 · Burger combo",
                s: "In kitchen",
                c: "bg-highlight",
              },
              { t: "Table 9 · Pasta + wine", s: "Served", c: "bg-mint" },
              { t: "Table 12 · Tasting menu", s: "Paid", c: "bg-primary/15" },
            ].map((o) => (
              <div
                key={o.t}
                className="flex items-center justify-between rounded-xl border border-border p-3"
              >
                <span className="text-sm font-medium">{o.t}</span>
                <span
                  className={`rounded-full ${o.c} px-3 py-1 text-xs font-semibold text-primary`}
                >
                  {o.s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const plans = [
  {
    name: "Starter",
    price: "$29",
    desc: "For small cafés and food trucks getting started.",
    features: [
      "1 register",
      "Unlimited menu items",
      "Basic reports",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$89",
    desc: "Most popular — full POS for growing restaurants.",
    features: [
      "3 registers",
      "Kitchen display",
      "Online ordering",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$129",
    desc: "Multi-location, custom integrations and SSO.",
    features: [
      "Unlimited registers",
      "Multi-location",
      "Custom integrations",
      "Dedicated CSM",
    ],
    highlight: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="bg-mint py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Pricing
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          A plan that fits the size of your kitchen.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start free for 30 days. No credit card required.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl p-8 ${
              p.highlight
                ? "bg-primary text-primary-foreground shadow-soft scale-[1.03]"
                : "bg-card text-card-foreground shadow-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-highlight-foreground">
                Most popular
              </span>
            )}
            <div className="text-sm uppercase tracking-widest opacity-70">
              {p.name}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">{p.price}</span>
              <span className="opacity-70">/mo</span>
            </div>
            <p
              className={`mt-3 text-sm ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
            >
              {p.desc}
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 ${p.highlight ? "text-highlight" : "text-primary"}`}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/sign-up/$" params={{ _splat: "" }} className="mt-8">
              <Button
                className={`w-full ${
                  p.highlight
                    ? "bg-highlight text-highlight-foreground hover:bg-highlight/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Get started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const testimonials = [
  {
    quote:
      "We cut our average ticket time by 30% in the first month. The kitchen team actually smiles now.",
    name: "Maya Okafor",
    role: "Owner · Saffron Bistro",
  },
  {
    quote:
      "Switched from three tools to Dine Flow. Reports that took an hour now take ten seconds.",
    name: "Daniel Park",
    role: "GM · Hana Ramen",
  },
  {
    quote:
      "The floor plan and split-bill flow are the best we've ever used. Servers love it.",
    name: "Lucia Romero",
    role: "Director · Ember & Oak",
  },
];

const Testimonials = () => (
  <section className="py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Loved by operators
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          What restaurants are saying.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-3xl border border-border bg-card p-7 shadow-card"
          >
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="mt-4 text-foreground">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint font-semibold text-primary">
                {t.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
              <div className="ml-auto flex gap-0.5 text-highlight">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const faqs = [
  {
    q: "What hardware do I need?",
    a: "Any tablet or laptop works. We support most major card readers, kitchen printers and cash drawers — or order our starter kit.",
  },
  {
    q: "Is Dine Flow easy to set up?",
    a: "Most restaurants go live in under a day. Our onboarding team can build your menu with you for free.",
  },
  {
    q: "Can I take payments through Dine Flow?",
    a: "Yes — accept cards, contactless, Apple Pay and Google Pay with built-in tipping and split-bill support.",
  },
  {
    q: "Do you offer customer support?",
    a: "24/7 chat and email, plus phone support on Pro and Enterprise plans.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-24">
    <div className="mx-auto max-w-3xl px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Frequently asked questions
        </h2>
      </div>
      <div className="mt-12 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-colors open:bg-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-semibold">
              {f.q}
              <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full bg-mint text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="px-6 pb-24">
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-highlight px-8 py-16 text-center text-highlight-foreground shadow-soft md:px-16 md:py-20">
      <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold md:text-5xl">
        Get started with Dine Flow today.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-highlight-foreground/80">
        Join 20,000+ restaurants running calmer, faster service. 30 days free,
        no card required.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/sign-up/$" params={{ _splat: "" }}>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start free trial <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="border-highlight-foreground/30 bg-transparent"
        >
          Talk to sales
        </Button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-primary py-12 text-primary-foreground">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
            <Utensils className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-bold">Dine Flow</span>
        </div>
        <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
          The modern POS that helps restaurants serve calmer, faster and
          smarter.
        </p>
      </div>
      {[
        {
          title: "Product",
          links: ["Features", "Pricing", "Integrations", "Hardware"],
        },
        { title: "Company", links: ["About", "Customers", "Blog", "Careers"] },
        {
          title: "Resources",
          links: ["Help center", "API docs", "Status", "Contact"],
        },
      ].map((c) => (
        <div key={c.title}>
          <div className="text-sm font-semibold">{c.title}</div>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            {c.links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="transition-colors hover:text-primary-foreground"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-t border-primary-foreground/15 px-6 pt-6 text-xs text-primary-foreground/60">
      © {new Date().getFullYear()} Dine Flow. Crafted for restaurants that care.
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

