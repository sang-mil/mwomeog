"use client";

import { useEffect, useRef, useState } from "react";
import { RestaurantCategory } from "@/types/restaurant";

interface RouletteProps {
  onSelectCategory: (category: RestaurantCategory) => void;
  onBack: () => void;
}

interface RouletteOption {
  label: string;
  category: RestaurantCategory;
  color: string;
}

const DEFAULT_OPTIONS: RouletteOption[] = [
  { label: "한식", category: "한식", color: "#FF6B6B" },
  { label: "중식", category: "중식", color: "#FFA94D" },
  { label: "일식", category: "일식", color: "#FFD43B" },
  { label: "양식", category: "양식", color: "#69DB7C" },
  { label: "치킨", category: "치킨", color: "#4DABF7" },
  { label: "분식", category: "분식", color: "#9775FA" },
  { label: "카페", category: "카페", color: "#F06595" },
];

export default function Roulette({ onSelectCategory, onBack }: RouletteProps) {
  const [options, setOptions] = useState<RouletteOption[]>(DEFAULT_OPTIONS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RouletteOption | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 룰렛 그리기
  const drawRoulette = (rotationDeg: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12;
    const total = options.length;
    const arc = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, size, size);

    // 회전 변환 적용
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    options.forEach((opt, idx) => {
      const angle = idx * arc;

      // 섹터 그리기
      ctx.beginPath();
      ctx.fillStyle = opt.color;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arc);
      ctx.lineTo(0, 0);
      ctx.fill();

      // 경계선
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();

      // 텍스트 그리기
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.rotate(angle + arc / 2);
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.fillText(opt.label, radius - 20, 0);
      ctx.restore();
    });

    ctx.restore();

    // 중앙 원형 캡
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(center, center, 22, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#E5E7EB";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#1F2937";
    ctx.arc(center, center, 10, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    drawRoulette(currentRotation);
  }, [options, currentRotation]);

  const spin = () => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const spinRounds = 5 + Math.floor(Math.random() * 5); // 5~10회전
    const randomExtra = Math.floor(Math.random() * 360);
    const targetDeg = currentRotation + spinRounds * 360 + randomExtra;

    const duration = 3500;
    const startTime = performance.now();
    const startDeg = currentRotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nowDeg = startDeg + (targetDeg - startDeg) * easeOut;

      setCurrentRotation(nowDeg);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // 포인터는 상단(270도/ -90도 위치)을 가리킨다고 가정
        const total = options.length;
        const normalizedDeg = (360 - (targetDeg % 360) + 270) % 360;
        const index = Math.floor((normalizedDeg / 360) * total) % total;
        setWinner(options[index]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="py-2 text-center">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-black"
        >
          ‹ 뒤로
        </button>
        <span className="font-bold text-gray-700">랜덤 돌림판</span>
        <div className="w-8" />
      </div>

      {/* 룰렛 캔버스 영역 */}
      <div className="relative mx-auto mt-4 flex h-[280px] w-[280px] items-center justify-center">
        {/* 상단 화살표 포인터 */}
        <div className="pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-black drop-shadow-md" />
        </div>

        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-full shadow-xl"
        />
      </div>

      {/* 결과 표시 */}
      {winner && !isSpinning && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 border border-amber-200 animate-fadeIn">
          <p className="text-xs font-bold text-amber-600">오늘의 당첨 메뉴!</p>
          <p className="mt-1 text-2xl font-black text-gray-900">
            🎉 {winner.label} 당첨!
          </p>
          <button
            type="button"
            onClick={() => onSelectCategory(winner.category)}
            className="mt-3 w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow"
          >
            내 주변 {winner.label} 맛집 보러가기 ➔
          </button>
        </div>
      )}

      {/* 돌리기 버튼 */}
      <button
        type="button"
        disabled={isSpinning}
        onClick={spin}
        className="mt-5 w-full rounded-2xl bg-black py-4 text-base font-bold text-white shadow-xl transition active:scale-[0.98] disabled:bg-gray-300"
      >
        {isSpinning ? "돌아가는 중... 🎡" : "룰렛 돌리기 🎯"}
      </button>

      {/* 카테고리 칩 선택/해제 */}
      <div className="mt-4">
        <p className="text-[11px] text-gray-400">
          후보 {options.length}개로 진행 중
        </p>
      </div>
    </div>
  );
}
