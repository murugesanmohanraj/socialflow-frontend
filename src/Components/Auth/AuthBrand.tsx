import socialflowLogo from "../../Assets/Images/socialflow.png";

export function AuthBrand() {
  return (
    <section className="relative hidden overflow-hidden bg-[#102a43] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border-[52px] border-[#2f80ed]/20" />
      <div className="absolute -bottom-40 -left-36 h-96 w-96 rounded-full border-[64px] border-[#57cc99]/15" />

      <BrandMark />

      <div className="relative max-w-lg">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#8ee3bb]">
          One clear view
        </p>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">
          Your social workflow, in sync.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
          Connect your accounts, manage supported actions, and keep every result
          easy to follow from one focused workspace.
        </p>
      </div>

      <p className="relative text-sm text-slate-400">
        Built for calm, consistent account management.
      </p>
    </section>
  );
}

export function AuthMobileBrand() {
  return (
    <div className="mb-10 lg:hidden">
      <BrandMark compact />
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative flex items-center gap-3 text-lg font-semibold tracking-tight">
      <img
        src={socialflowLogo}
        alt="Social Media Manager logo"
        className={`h-9 w-9 rounded-xl bg-white p-1 object-contain ${compact ? "ring-1 ring-slate-200" : ""}`}
      />
      Social Media Manager
    </div>
  );
}
