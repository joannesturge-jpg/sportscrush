import type { Metadata } from "next";
import { Anton, Dancing_Script, VT323 } from "next/font/google";
import "./case.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-arcade",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-script",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crack the Case — Ridgeview Prom Night",
  description: "An 80s-set escape room whodunit. Gather your friends, read the evidence, crack the case.",
};

export default function CrackTheCaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${anton.variable} ${dancingScript.variable} ${vt323.variable} ctc-root min-h-screen`}>
      {children}
      <div className="ctc-crt-scanlines" aria-hidden="true" />
      <div className="ctc-crt-vignette" aria-hidden="true" />
      <div className="ctc-crt-statusbar" aria-hidden="true">
        <span className="ctc-crt-led" />
        RIDGEVIEW PD TERMINAL — CASE-FILE OS v2.1
      </div>
    </div>
  );
}
