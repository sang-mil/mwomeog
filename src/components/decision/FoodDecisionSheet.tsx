"use client";

interface FoodDecisionSheetProps {
  onClose: () => void;
}

export default function FoodDecisionSheet({
  onClose,
}: FoodDecisionSheetProps) {
  return (
    <div className="absolute inset-0 z-[55] flex items-end bg-black/30 backdrop-blur-[2px]">
      <div className="w-full rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              DECIDE
            </p>

            <h2 className="mt-1 text-2xl font-black">
              오늘 뭐 먹지?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            className="rounded-3xl bg-gray-50 p-5 text-left"
          >
            <div className="text-2xl">❓</div>
            <p className="mt-3 font-bold">질문으로 정하기</p>
            <p className="mt-1 text-sm text-gray-500">
              몇 가지 질문으로 후보를 좁혀요.
            </p>
          </button>

          <button
            type="button"
            className="rounded-3xl bg-gray-50 p-5 text-left"
          >
            <div className="text-2xl">🎡</div>
            <p className="mt-3 font-bold">돌림판</p>
            <p className="mt-1 text-sm text-gray-500">
              먹고 싶은 후보를 넣고 랜덤으로 골라요.
            </p>
          </button>

          <button
            type="button"
            className="rounded-3xl bg-gray-50 p-5 text-left"
          >
            <div className="text-2xl">🪜</div>
            <p className="mt-3 font-bold">사다리타기</p>
            <p className="mt-1 text-sm text-gray-500">
              후보를 등록해서 하나를 결정해요.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
