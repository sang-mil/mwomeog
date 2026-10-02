"use client";

import { useState } from "react";
import FoodQuestion from "./FoodQuestion";
import Roulette from "./Roulette";
import Ladder from "./Ladder";
import { RestaurantCategory } from "@/types/restaurant";

interface FoodDecisionSheetProps {
  onClose: () => void;
  onApplyCategory: (category: RestaurantCategory) => void;
}

type TabMode = "menu" | "question" | "roulette" | "ladder";

export default function FoodDecisionSheet({
  onClose,
  onApplyCategory,
}: FoodDecisionSheetProps) {
  const [mode, setMode] = useState<TabMode>("menu");

  const handleSelectResult = (category: RestaurantCategory) => {
    onApplyCategory(category);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[55] flex items-end bg-black/40 backdrop-blur-[3px] transition-all">
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

        {/* 메인 메뉴 선택 화면 */}
        {mode === "menu" && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  DECIDE YOUR MEAL
                </p>
                <h2 className="mt-0.5 text-2xl font-black text-gray-900">
                  오늘 뭐 먹지? 🤔
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              고민할 필요 없이 재밌게 골라보세요!
            </p>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => setMode("question")}
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
                onClick={() => setMode("roulette")}
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
                onClick={() => setMode("ladder")}
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

              <div className="mt-1 flex items-center justify-between rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-3.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <span className="font-medium">AI가 골라주기</span>
                </div>
                <span className="rounded-full bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                  준비 중
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 질문으로 정하기 모드 */}
        {mode === "question" && (
          <FoodQuestion
            onSelectCategory={handleSelectResult}
            onBack={() => setMode("menu")}
          />
        )}

        {/* 돌림판 모드 */}
        {mode === "roulette" && (
          <Roulette
            onSelectCategory={handleSelectResult}
            onBack={() => setMode("menu")}
          />
        )}

        {/* 사다리타기 모드 */}
        {mode === "ladder" && (
          <Ladder
            onSelectCategory={handleSelectResult}
            onBack={() => setMode("menu")}
          />
        )}
      </div>
    </div>
  );
}
