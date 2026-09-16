'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import { ProjectStatus } from '@/types';
import {
  CheckCircle2,
  Clock,
  Circle,
  FolderKanban,
  MapPin,
  Calendar,
  User,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

interface ProjectDetailModalProps {
  projectId: string | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  projectId,
  onClose,
}) => {
  const {
    projects,
    toggleProjectStage,
    updateProjectProgress,
    addProjectStage,
    updateProjectStage,
    deleteProjectStage,
    updateProject,
    deleteProject,
  } = useSolarFlow();

  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageNotes, setNewStageNotes] = useState('');

  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageName, setEditingStageName] = useState('');
  const [editingStageNotes, setEditingStageNotes] = useState('');

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const handleAddStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    addProjectStage(project.id, newStageName.trim(), newStageNotes.trim());
    setNewStageName('');
    setNewStageNotes('');
    setIsAddingStage(false);
  };

  const handleStartEditStage = (stage: { id: string; name: string; notes?: string }) => {
    setEditingStageId(stage.id);
    setEditingStageName(stage.name);
    setEditingStageNotes(stage.notes || '');
  };

  const handleSaveEditStage = (stageId: string) => {
    if (!editingStageName.trim()) return;
    updateProjectStage(project.id, stageId, {
      name: editingStageName.trim(),
      notes: editingStageNotes.trim(),
    });
    setEditingStageId(null);
  };

  return (
    <Modal
      isOpen={!!projectId}
      onClose={onClose}
      title={`${project.projectCode}: ${project.company}`}
      subtitle={`${formatCapacity(project.capacityKW)} Turnkey Solar Installation &bull; ${project.location}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Project Snapshot Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">System Capacity</span>
            <span className="text-base font-bold text-amber-600">
              {formatCapacity(project.capacityKW)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Contract Value</span>
            <span className="text-base font-bold text-slate-900">
              {formatINR(project.totalContractValue, true)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Project Manager</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {project.projectManager}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Target Commissioning</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(project.targetCompletionDate)}
            </span>
          </div>
        </div>

        {/* Project Status & Progress Controls */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Lifecycle Execution Status
              </span>
              <span className="text-xs text-slate-500">
                Update overarching turnkey project status
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={project.status}
                onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                  project.status === 'Commissioned'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : project.status === 'Installation'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                }`}
              >
                <option value="Active">Active (Engineering)</option>
                <option value="Under Approval">Under DISCOM Approval</option>
                <option value="Installation">Installation & Erection</option>
                <option value="Commissioned">Commissioned & Grid Synced</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Overall Project Progress
              </span>
              <span className="text-sm font-extrabold text-amber-600">
                {project.progressPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={project.progressPercentage}
              onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0% (Design)</span>
              <span>50% (Erection)</span>
              <span>100% (Commissioned & Sync)</span>
            </div>
          </div>
        </div>

        {/* Turnkey Stages & Steps Management */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-amber-500" />
                Project Steps & Milestones ({project.stages.length})
              </h4>
              <p className="text-[11px] text-slate-500">
                Add, manage, edit remarks, and track completion of each step
              </p>
            </div>

            <button
              onClick={() => setIsAddingStage(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
          </div>

          {/* Add Step Inline Form */}
          {isAddingStage && (
            <form
              onSubmit={handleAddStageSubmit}
              className="p-4 mb-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3 animate-in fade-in-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Add New Milestone Step</span>
                <button
                  type="button"
                  onClick={() => setIsAddingStage(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. CEIG Transformer Inspection, Grounding Grid Testing..."
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional notes / remarks or subcontractor instructions..."
                  value={newStageNotes}
                  onChange={(e) => setNewStageNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStage(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs font-bold bg-amber-500 text-slate-950 rounded hover:bg-amber-400"
                >
                  Save Step
                </button>
              </div>
            </form>
          )}

          {/* Stages List */}
          <div className="space-y-3">
            {project.stages.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No steps in this project yet. Click "Add Step" above to add milestones.
              </div>
            ) : (
              project.stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isInProgress = stage.status === 'in_progress';
                const isEditing = editingStageId === stage.id;

                if (isEditing) {
                  return (
                    <div
                      key={stage.id}
                      className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          Edit Step {idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEditStage(stage.id)}
                            className="p-1 rounded bg-amber-500 text-slate-950 hover:bg-amber-400"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStageId(null)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title="Cancel edit"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={editingStageName}
                        onChange={(e) => setEditingStageName(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                      />

                      <input
                        type="text"
                        placeholder="Remarks / notes..."
                        value={editingStageNotes}
                        onChange={(e) => setEditingStageNotes(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={stage.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isInProgress
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        onClick={() =>
                          toggleProjectStage(
                            project.id,
                            stage.id,
                            isCompleted ? 'in_progress' : isInProgress ? 'pending' : 'completed'
                          )
                        }
                        className="mt-0.5 flex-shrink-0"
                        title="Click to toggle status"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : isInProgress ? (
                          <Clock className="w-5 h-5 text-amber-500 fill-amber-100 animate-pulse" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {idx + 1}. {stage.name}
                          </span>
                          <Badge
                            size="sm"
                            variant={isCompleted ? 'success' : isInProgress ? 'warning' : 'neutral'}
                          >
                            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>

                        {stage.notes && (
                          <p className="text-xs text-slate-600 mt-1">{stage.notes}</p>
                        )}

                        {stage.completedDate && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Cleared on: {formatDate(stage.completedDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={stage.status}
                        onChange={(e) =>
                          toggleProjectStage(
                            project.id,
                            stage.id,
                            e.target.value as 'completed' | 'in_progress' | 'pending'
                          )
                        }
                        className="text-xs font-medium px-2 py-1 rounded border border-slate-300 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => handleStartEditStage(stage)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                        title="Edit stage details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteProjectStage(project.id, stage.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Delete this stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Delete Project Danger Zone */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to remove project ${project.projectCode}?`)) {
                deleteProject(project.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Entire Project
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
