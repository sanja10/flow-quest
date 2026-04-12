"use client";

import { FlowButton } from "@/components/ui/FlowButton";
import { Quest } from "@prisma/client";
import { format } from "date-fns";

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const difficultyConfig = {
  EASY: { label: "Easy", color: "text-primary-soft" },
  MEDIUM: { label: "Medium", color: "text-primary" },
  HARD: { label: "Hard", color: "text-yellow-400" },
};

const statusConfig = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
  const diff = difficultyConfig[quest.difficulty];
  const isDone = quest.status === "DONE";

  return (
    <div
      className={`border-4 p-4 flex flex-col gap-3 transition-all ${
        isDone ? "border-primary-dark opacity-50" : "border-primary"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className={`font-bold text-base leading-tight ${
            isDone ? "line-through text-primary-soft" : "text-primary"
          }`}
        >
          {quest.title}
        </h3>
        <span
          className={`text-label uppercase tracking-widest shrink-0 ${diff.color}`}
        >
          {diff.label}
        </span>
      </div>

      {/* Description */}
      {quest.description && (
        <p className="text-sm text-primary-soft leading-relaxed">
          {quest.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4">
        <span className="text-label uppercase tracking-widest text-primary-soft">
          {statusConfig[quest.status]}
        </span>
        {quest.deadline && (
          <span className="text-label uppercase tracking-widest text-primary-soft">
            Due {format(new Date(quest.deadline), "MMM d")}
          </span>
        )}
        <span className="text-label uppercase tracking-widest text-primary-soft ml-auto">
          +{quest.xpReward} XP
        </span>
      </div>

      {/* Actions */}
      {!isDone && (
        <div className="flex gap-3 pt-2">
          <FlowButton
            variant="primary"
            className="text-xs py-2 px-4"
            onClick={() => onComplete(quest.id)}
          >
            Complete →
          </FlowButton>
          <FlowButton
            variant="danger"
            className="text-xs py-2 px-4"
            onClick={() => onDelete(quest.id)}
          >
            Delete
          </FlowButton>
        </div>
      )}
    </div>
  );
}
