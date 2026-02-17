export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white px-6 text-center">
      <div className="mb-8 text-7xl select-none">📡</div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">오프라인 상태</h1>
      <p className="text-lg text-zinc-400 mb-8 max-w-sm leading-relaxed">
        인터넷 연결이 없습니다.
        <br />
        연결을 확인한 뒤 다시 시도해 주세요.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors"
      >
        다시 시도
      </button>
      <p className="mt-12 text-sm text-zinc-600">
        kimjisub.com
      </p>
    </div>
  );
}
