export default function PromptCard({
  title,
  icon: Icon,
  prompt,
  locked,
  onGenerate,
  onToggleLock
}) {
  return (
    <div
      className={`
        rounded-2xl shadow p-5 space-y-4 transition
        ${locked ? 'bg-red-50 border border-red-200' : 'bg-white'}
      `}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          {Icon && <Icon size={18} />}
          <span>{title}</span>
        </div>

        <button
          onClick={onToggleLock}
          className={`
            px-3 py-1 rounded-xl text-sm font-bold
            ${locked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}
          `}
        >
          {locked ? 'Locked 🔒' : 'Lock'}
        </button>
      </div>

      {/* CONTENT */}
      <div className="min-h-[70px]">
        {prompt ? (
          <>
            <div className="font-bold text-lg">
              {prompt.name}
            </div>

            <div className="text-sm text-gray-600">
              {prompt.description}
            </div>
          </>
        ) : (
          <div className="text-gray-400 italic">
            Tap 'generate' to create a prompt
          </div>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={onGenerate}
        disabled={locked}
        className={`
          w-full flex items-center justify-center gap-2
          py-3 rounded-xl font-bold text-white transition
          ${locked
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {Icon && <Icon size={18} />}
        <span>Generate {title}</span>
      </button>

    </div>
  )
}