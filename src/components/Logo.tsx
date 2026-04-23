import logo from "@/assets/gigvora-logo.png";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={logo} alt="Gigvora" className={`${className} w-auto select-none`} />;
}
