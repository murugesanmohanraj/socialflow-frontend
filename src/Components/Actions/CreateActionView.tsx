import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStoredAction } from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";

type Platform = "TikTok" | "YouTube";
type ActionType = "Open content" | "Review channel content";

type AccountOption = {
  id: string;
  name: string;
  platform: Platform;
  initials: string;
};

const accountOptions: AccountOption[] = [
  {
    id: "maria-studio",
    name: "@maria.studio",
    platform: "TikTok",
    initials: "MS",
  },
  { id: "growth-lab", name: "Growth Lab", platform: "YouTube", initials: "GL" },
  {
    id: "northstar-co",
    name: "@northstar.co",
    platform: "TikTok",
    initials: "NC",
  },
  {
    id: "creator-weekly",
    name: "Creator Weekly",
    platform: "YouTube",
    initials: "CW",
  },
];

const steps = ["Platform", "Action", "Target", "Accounts", "Review"];

function CreateActionView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform | "">("");
  const [action, setAction] = useState<ActionType | "">("");
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [createdActionId, setCreatedActionId] = useState("");

  const availableActions: ActionType[] =
    platform === "TikTok" ? ["Open content"] : ["Review channel content"];
  const availableAccounts = accountOptions.filter(
    (account) => account.platform === platform,
  );

  function nextStep() {
    setError("");
    if (step === 1 && !platform)
      return setError("Choose a platform to continue.");
    if (step === 2 && !action)
      return setError("Choose a supported action to continue.");
    if (step === 3 && !isValidUrl(targetUrl))
      return setError("Enter a valid target URL to continue.");
    if (step === 4 && selectedAccounts.length === 0)
      return setError("Select at least one account to continue.");
    if (step === 5) {
      const actionId = `${(action || "action").toLowerCase().replaceAll(" ", "-")}-${Date.now()}`;
      addStoredAction({
        id: actionId,
        title: action || "Social content action",
        platform: platform || "TikTok",
        description: `Run ${action || "the selected action"} for selected accounts.`,
        targetUrl,
        accountIds: selectedAccounts,
        lastRun: "Not run yet",
        result: "Not run yet",
        repetitions: 1,
        likeContent: false,
        postComment: false,
      });
      setCreatedActionId(actionId);
      setIsCreated(true);
      return;
    }
    setStep((currentStep) => Math.min(currentStep + 1, 5));
  }

  function previousStep() {
    setError("");
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }

  function toggleAccount(id: string) {
    setSelectedAccounts((current) =>
      current.includes(id)
        ? current.filter((accountId) => accountId !== id)
        : [...current, id],
    );
  }

  function selectPlatform(nextPlatform: Platform) {
    setPlatform(nextPlatform);
    setAction("");
    setSelectedAccounts([]);
  }

  function isValidUrl(value: string) {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        ((platform === "TikTok" && url.hostname.includes("tiktok.com")) ||
          (platform === "YouTube" &&
            (url.hostname.includes("youtube.com") ||
              url.hostname.includes("youtu.be"))))
      );
    } catch {
      return false;
    }
  }

  if (isCreated) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow="Actions / Complete"
          title="Action created"
          description="Your workflow is ready for the next execution step."
        >
          <section className="mx-auto max-w-xl rounded-2xl border border-[#b7ebd0] bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f5e7] text-2xl font-bold text-[#16845b]">
              ✓
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102a43]">
              Action saved successfully
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              The action has been configured for {selectedAccounts.length}{" "}
              selected account{selectedAccounts.length === 1 ? "" : "s"}.
              Execution monitoring will be available in the next step.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/actions")}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
              >
                Back to actions
              </button>
              <button
                type="button"
                onClick={() => navigate(`/actions/run/${createdActionId}`)}
                className="rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
              >
                Start execution
              </button>
            </div>
          </section>
        </ViewShell>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Actions / New action"
        title="Create an action"
        description="Set up a supported workflow for selected social accounts."
      >
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((label, index) => {
            const number = index + 1;
            return (
              <div key={label} className="flex shrink-0 items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step >= number ? "bg-[#102a43] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {step > number ? "✓" : number}
                </span>
                <span
                  className={`text-sm font-semibold ${step === number ? "text-[#102a43]" : "text-slate-400"}`}
                >
                  {label}
                </span>
                {number < steps.length && (
                  <span className="mx-1 h-px w-6 bg-slate-200 sm:w-10" />
                )}
              </div>
            );
          })}
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <StepHeading
              title="Choose a platform"
              description="Select where this action should run."
            />
          )}
          {step === 1 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                title="TikTok"
                description="For TikTok creator accounts"
                selected={platform === "TikTok"}
                onClick={() => selectPlatform("TikTok")}
                mark="♪"
              />
              <ChoiceCard
                title="YouTube"
                description="For YouTube channels"
                selected={platform === "YouTube"}
                onClick={() => selectPlatform("YouTube")}
                mark="▶"
              />
            </div>
          )}
          {step === 2 && (
            <>
              <StepHeading
                title="Choose an action"
                description={`Available actions for ${platform}.`}
              />
              <div className="mt-6 space-y-3">
                {availableActions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAction(option)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left ${action === option ? "border-[#2f80ed] bg-[#eaf2fc]" : "border-slate-200 hover:border-[#2f80ed]"}`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[#102a43]">
                        {option}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Only supported actions are shown for this platform.
                      </span>
                    </span>
                    <span
                      className={`h-5 w-5 rounded-full border-2 ${action === option ? "border-[#1976d2] bg-[#1976d2] ring-4 ring-[#1976d2]/15" : "border-slate-300"}`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <StepHeading
                title="Add a target"
                description={`Paste a valid ${platform} URL for this action.`}
              />
              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Target URL
                </span>
                <input
                  value={targetUrl}
                  onChange={(event) => setTargetUrl(event.target.value)}
                  placeholder={
                    platform === "TikTok"
                      ? "https://www.tiktok.com/@creator/video/..."
                      : "https://www.youtube.com/watch?v=..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
                />
              </label>
              <p className="mt-3 text-xs text-slate-400">
                The target must be an HTTPS URL from the selected platform.
              </p>
            </>
          )}
          {step === 4 && (
            <>
              <StepHeading
                title="Select accounts"
                description={`Choose which ${platform} accounts should run this action.`}
              />
              <div className="mt-6 space-y-3">
                {availableAccounts.map((account) => (
                  <label
                    key={account.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selectedAccounts.includes(account.id) ? "border-[#2f80ed] bg-[#eaf2fc]" : "border-slate-200 hover:border-[#2f80ed]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => toggleAccount(account.id)}
                      className="h-4 w-4 accent-[#1976d2]"
                    />
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-[#1976d2]">
                      {account.initials}
                    </span>
                    <span className="text-sm font-semibold text-[#102a43]">
                      {account.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                {selectedAccounts.length} account
                {selectedAccounts.length === 1 ? "" : "s"} selected
              </p>
            </>
          )}
          {step === 5 && (
            <>
              <StepHeading
                title="Review action"
                description="Confirm the setup before starting the workflow."
              />
              <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {[
                  ["Platform", platform],
                  ["Action", action],
                  ["Target", targetUrl],
                  ["Accounts", `${selectedAccounts.length} selected`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:justify-between sm:gap-4"
                  >
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="break-all text-sm font-semibold text-[#102a43] sm:text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {error && (
            <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
          )}
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                step === 1 ? navigate("/actions") : previousStep()
              }
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
            >
              {step === 5 ? "Execute action" : "Continue"}
            </button>
          </div>
        </section>
      </ViewShell>
    </div>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#102a43]">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
function ChoiceCard({
  title,
  description,
  selected,
  onClick,
  mark,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  mark: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${selected ? "border-[#2f80ed] bg-[#eaf2fc] shadow-sm" : "border-slate-200 hover:border-[#2f80ed]"}`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${title === "TikTok" ? "bg-black text-white" : "bg-[#fff0f0] text-[#dc2626]"}`}
      >
        {mark}
      </span>
      <span className="mt-5 block text-base font-semibold text-[#102a43]">
        {title}
      </span>
      <span className="mt-1 block text-sm text-slate-500">{description}</span>
    </button>
  );
}

export default CreateActionView;
