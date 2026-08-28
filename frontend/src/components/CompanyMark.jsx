import React, { useState } from "react";

const KNOWN_DOMAINS = {
  vercel: "vercel.com",
  stripe: "stripe.com",
  linear: "linear.app",
  supabase: "supabase.com",
  google: "google.com",
  apple: "apple.com",
  microsoft: "microsoft.com",
  meta: "meta.com",
  facebook: "facebook.com",
  amazon: "amazon.com",
  netflix: "netflix.com",
  notion: "notion.so",
  figma: "figma.com",
  github: "github.com",
  openai: "openai.com",
  anthropic: "anthropic.com",
  airbnb: "airbnb.com",
  uber: "uber.com",
  spotify: "spotify.com",
  datadog: "datadoghq.com",
  cloudflare: "cloudflare.com",
  discord: "discord.com",
  slack: "slack.com",
  atlassian: "atlassian.com",
  postman: "postman.com",
  adobe: "adobe.com",
  salesforce: "salesforce.com",
  oracle: "oracle.com",
  ibm: "ibm.com",
  twitter: "x.com",
  x: "x.com",
  linkedin: "linkedin.com",
  tailwind: "tailwindcss.com",
};

export default function CompanyMark({ name = "?", size = "size-12", className = "" }) {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || "?").trim();
  const initial = cleanName.charAt(0).toUpperCase();
  const normalizedKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Determine domain name for logo fetch
  let domain = KNOWN_DOMAINS[normalizedKey];
  if (!domain && cleanName.length > 1) {
    const firstWord = cleanName.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    domain = KNOWN_DOMAINS[firstWord] || `${firstWord}.com`;
  }

  const logoUrl = domain ? `https://unavatar.io/${domain}?fallback=false` : null;

  // Gradients for fallback avatar
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-emerald-400 via-teal-500 to-cyan-600",
    "from-violet-600 via-purple-600 to-indigo-600",
    "from-amber-400 via-orange-500 to-rose-500",
    "from-fuchsia-500 via-pink-500 to-rose-500",
  ];
  const charCode = cleanName.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  return (
    <div
      className={`${size} relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-lg shadow-black/40 flex items-center justify-center shrink-0 group transition-all duration-300 ${className}`}
    >
      {logoUrl && !imgError ? (
        <div className="w-full h-full p-2 bg-slate-900/90 flex items-center justify-center">
          <img
            src={logoUrl}
            alt={`${cleanName} logo`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} grid place-items-center font-bold text-white text-base shadow-inner group-hover:scale-105 transition-transform duration-300`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
