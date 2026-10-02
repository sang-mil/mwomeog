"use client";

import { DecisionMode } from "@/types/decision";

interface DecisionMethodSelectorProps {
  onSelectMode: (mode: DecisionMode) => void;
}

export default function DecisionMethodSelector({
  onSelectMode,
}: DecisionMethodSelectorProps) {
  return (
    <div className="mt-5 grid gap-3">
      <button
        type="button"
        onClick={() => onSelectMode("question")}
        className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          ❓
        </div>
        <div>
          <p className="font-extrabold text-gray-900 text-base">질문으로 정하기</p>
          <p className="mt-0.5 text-xs text-gray-500">
            3가지 취향 질문으로 딱 맞는 메뉴를 좁혀줘요.
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectMode("roulette")}
        className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          🎡
        </div>
        <div>
          <p className="font-extrabold text-gray-900 text-base">랜덤 돌림판</p>
          <p className="mt-0.5 text-xs text-gray-500">
            돌아가는 룰렛에 오늘의 운명을 맡겨보세요.
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectMode("ladder")}
        className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          🪜
        </div>
        <div>
          <p className="font-extrabold text-gray-900 text-base">사다리타기</p>
          <p className="mt-0.5 text-xs text-gray-500">
            직접 번호를 골라 사다리를 타서 하나를 결정해요.
          </p>
        </div>
      </button>
    </div>
  );
}
