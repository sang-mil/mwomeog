"use client";

import { useEffect, useState } from "react";
import { RestaurantCategory } from "@/types/restaurant";

interface LadderProps {
  onSelectCategory: (category: RestaurantCategory) => void;
  onBack: () => void;
}

interface LadderItem {
  name: string;
  category: RestaurantCategory;
  emoji: string;
}

const DEFAULT_CANDIDATES: LadderItem[] = [
  { name: "한식", category: "한식", emoji: "🍚" },
  { name: "일식", category: "일식", emoji: "🍣" },
  { name: "중식", category: "중식", emoji: "🥟" },
  { name: "양식", category: "양식", emoji: "🍕" },
];

export default function Ladder({ onSelectCategory, onBack }: LadderProps) {
  const [candidates] = useState<LadderItem[]>(DEFAULT_CANDIDATES);
  const [bridges, setBridges] = useState<{ col: number; row: number }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [tracePoints, setTracePoints] = useState<{ x: number; y: number }[]>([]);

  const ROWS = 6;
  const COLS = candidates.length;

  // 사다리 가로선 랜덤 생성
  const generateLadder = () => {
    const newBridges: { col: number; row: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      let prevConnected = false;
      for (let c = 0; c < COLS - 1; c++) {
        if (!prevConnected && Math.random() > 0.45) {
          newBridges.push({ col: c, row: r });
          prevConnected = true;
        } else {
          prevConnected = false;
        }
      }
    }
    setBridges(newBridges);
    setSelectedIndex(null);
    setWinningIndex(null);
    setTracePoints([]);
  };

  useEffect(() => {
    generateLadder();
  }, []);

  // 사다리 경로 추적
  const traceLadder = (startCol: number) => {
    if (isTracing) return;
    setIsTracing(true);
    setSelectedIndex(startCol);
    setWinningIndex(null);

    let currentCol = startCol;
    const points: { x: number; y: number }[] = [];

    // 시작 지점
    points.push({ x: currentCol, y: -0.5 });
    points.push({ x: currentCol, y: 0 });

    for (let r = 0; r < ROWS; r++) {
      // 오른쪽으로 다리가 있는지
      const rightBridge = bridges.find((b) => b.col === currentCol && b.row === r);
      // 왼쪽으로 다리가 있는지
      const leftBridge = bridges.find((b) => b.col === currentCol - 1 && b.row === r);

      points.push({ x: currentCol, y: r + 0.5 });

      if (rightBridge) {
        currentCol += 1;
        points.push({ x: currentCol, y: r + 0.5 });
      } else if (leftBridge) {
        currentCol -= 1;
        points.push({ x: currentCol, y: r + 0.5 });
      }

      points.push({ x: currentCol, y: r + 1 });
    }

    points.push({ x: currentCol, y: ROWS + 0.5 });
    setTracePoints(points);

    setTimeout(() => {
      setWinningIndex(currentCol);
      setIsTracing(false);
    }, 1200);
  };

  const winner = winningIndex !== null ? candidates[winningIndex] : null;

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
        <span className="font-bold text-gray-700">사다리타기</span>
        <button
          type="button"
          onClick={generateLadder}
          disabled={isTracing}
          className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50"
        >
          새 사다리
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        출발할 번호(1~{COLS})를 터치해 사다리를 타보세요!
      </p>

      {/* 상단 번호 선택 버튼 */}
      <div className="mt-4 flex justify-around">
        {candidates.map((_, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isTracing}
            onClick={() => traceLadder(idx)}
            className={`flex h-10 w-10 items-center justify-center rounded-full font-black text-sm transition ${
              selectedIndex === idx
                ? "bg-black text-white ring-4 ring-black/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* 사다리 SVG 시각화 */}
      <div className="relative mx-auto mt-4 h-[240px] w-full max-w-[340px] px-4">
        <svg className="h-full w-full" viewBox={`-0.5 -0.5 ${COLS} ${ROWS + 1}`}>
          {/* 세로선 */}
          {Array.from({ length: COLS }).map((_, c) => (
            <line
              key={`col-${c}`}
              x1={c}
              y1={0}
              x2={c}
              y2={ROWS}
              stroke="#D1D5DB"
              strokeWidth="0.08"
              strokeLinecap="round"
            />
          ))}

          {/* 가로 다리 */}
          {bridges.map((b, idx) => (
            <line
              key={`bridge-${idx}`}
              x1={b.col}
              y1={b.row + 0.5}
              x2={b.col + 1}
              y2={b.row + 0.5}
              stroke="#9CA3AF"
              strokeWidth="0.08"
              strokeLinecap="round"
            />
          ))}

          {/* 이동 경로 하이라이트 애니메이션 */}
          {tracePoints.length > 1 && (
            <polyline
              points={tracePoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#EF4444"
              strokeWidth="0.12"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* 하단 도착 후보 목록 */}
      <div className="flex justify-around px-2">
        {candidates.map((item, idx) => {
          const isWon = winningIndex === idx;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-2xl px-2.5 py-2 transition-all duration-300 ${
                isWon
                  ? "bg-amber-100 ring-2 ring-amber-400 scale-110"
                  : "bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="mt-0.5 text-xs font-bold text-gray-800">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 결과 알림 */}
      {winner && (
        <div className="mt-5 rounded-2xl bg-amber-50 p-4 border border-amber-200">
          <p className="text-xs font-bold text-amber-600">사다리타기 결과</p>
          <p className="mt-1 text-xl font-black text-gray-900">
            {winner.emoji} {winner.name} 당첨!
          </p>
          <button
            type="button"
            onClick={() => onSelectCategory(winner.category)}
            className="mt-3 w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow"
          >
            내 주변 {winner.name} 맛집 보러가기 ➔
          </button>
        </div>
      )}
    </div>
  );
}
