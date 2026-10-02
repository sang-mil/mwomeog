"use client";

import { useState } from "react";
import { RestaurantCategory } from "@/types/restaurant";

interface FoodQuestionProps {
  onSelectCategory: (category: RestaurantCategory) => void;
  onBack: () => void;
}

interface QuestionStep {
  title: string;
  subtitle: string;
  options: {
    emoji: string;
    text: string;
    tag: string;
    categories: RestaurantCategory[];
  }[];
}

const QUESTIONS: QuestionStep[] = [
  {
    title: "오늘 어떤 스타일이 땡기시나요?",
    subtitle: "첫 번째 질문이에요",
    options: [
      {
        emoji: "🍲",
        text: "뜨끈하고 얼큰한 국물 요리",
        tag: "국물파",
        categories: ["한식", "일식", "중식"],
      },
      {
        emoji: "🥩",
        text: "씹는 맛 가득한 고기/구이/면",
        tag: "요리파",
        categories: ["양식", "일식", "치킨", "분식"],
      },
    ],
  },
  {
    title: "원하는 매운맛 강도는?",
    subtitle: "맛의 취향을 골라주세요",
    options: [
      {
        emoji: "🌶️",
        text: "스트레스 풀리는 매콤·칼칼한 맛",
        tag: "매콤",
        categories: ["한식", "중식", "분식", "치킨"],
      },
      {
        emoji: "🧀",
        text: "자극 없이 담백하고 고소한 맛",
        tag: "순한맛",
        categories: ["일식", "양식", "카페"],
      },
    ],
  },
  {
    title: "오늘 식사 분위기는 어떤가요?",
    subtitle: "마지막 질문이에요",
    options: [
      {
        emoji: "⚡",
        text: "혼자 또는 빠르고 간편하게",
        tag: "빠르게",
        categories: ["분식", "일식", "카페"],
      },
      {
        emoji: "🎉",
        text: "여유롭고 푸짐하게 제대로 즐기기",
        tag: "푸짐하게",
        categories: ["한식", "양식", "중식", "치킨"],
      },
    ],
  },
];

export default function FoodQuestion({
  onSelectCategory,
  onBack,
}: FoodQuestionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<RestaurantCategory[]>([]);
  const [resultCategory, setResultCategory] = useState<RestaurantCategory | null>(null);

  const handleSelectOption = (categories: RestaurantCategory[]) => {
    const updated = [...selectedCategories, ...categories];
    setSelectedCategories(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 카테고리 빈도수 계산하여 최다 득표 카테고리 선정
      const counts: Record<string, number> = {};
      for (const cat of updated) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const best = (sorted[0]?.[0] as RestaurantCategory) || "한식";
      setResultCategory(best);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedCategories([]);
    setResultCategory(null);
  };

  if (resultCategory) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl shadow-inner animate-bounce">
          🎯
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-600">
          오늘의 추천 결과
        </p>

        <h3 className="mt-1 text-2xl font-black text-gray-900">
          오늘은 <span className="text-amber-500 font-extrabold">{resultCategory}</span> 어떠세요?
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          질문 답변을 분석해 가장 딱 맞는 음식 종류를 찾았어요!
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onSelectCategory(resultCategory)}
            className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white shadow-xl transition active:scale-[0.98]"
          >
            내 주변 {resultCategory} 맛집 보기 ➔
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-200"
          >
            질문 다시 하기
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentStep];

  return (
    <div className="py-2">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
        <button
          type="button"
          onClick={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-black"
        >
          ‹ 뒤로
        </button>
        <span>
          {currentStep + 1} / {QUESTIONS.length}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs font-bold text-gray-400">{q.subtitle}</p>
        <h3 className="mt-1 text-xl font-black text-gray-900">{q.title}</h3>
      </div>

      <div className="mt-6 grid gap-3">
        {q.options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectOption(option.categories)}
            className="flex items-center gap-4 rounded-3xl border-2 border-transparent bg-gray-50 p-4 text-left transition hover:border-black/20 hover:bg-gray-100 active:scale-[0.98]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              {option.emoji}
            </div>
            <div className="flex-1">
              <span className="inline-block rounded-full bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                #{option.tag}
              </span>
              <p className="mt-1 font-bold text-gray-900">{option.text}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
