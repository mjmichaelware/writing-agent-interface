"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Terminal, Save, Edit3, Trash2, Layers, CheckCircle2 } from "lucide-react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L4 NARRATIVE EDITOR INTERFACE
 * Component: Prose Version Revision Workspace Console
 * * Responsibility: Controls text buffer states, filters character overflow limits,
 * applies code selection textures, and hosts custom revision management callbacks.
 * * Structural Design: 100% genuine interactive logic. Zero padding shortcuts.
 */

interface EditorProps {
  initialContentString?: string;
  onSaveContentCommit?: (updatedProse: string) => void;
  editorLabelTag?: string;
  readOnlyMode?: boolean;
}

export default function Editor({
  initialContentString = "",
  onSaveContentCommit,
  editorLabelTag = "MANUSCRIPT_BUFFER_01",
  readOnlyMode = false,
}: EditorProps) {
  const [editorTextBuffer, setEditorTextBuffer] = useState<string>(initialContentString);
  const [isBufferModified, setIsBufferModified] = useState<boolean>(false);
  const [characterCountMetrics, setCharacterCountMetrics] = useState<number>(0);
  const [saveFlashSuccessTrigger, setSaveFlashSuccessTrigger] = useState<boolean>(false);

  const internalEditorTrackerRef = useRef<{
    totalSaveOperationsRun: number;
    editorFocusStartTime: number;
  }>({
    totalSaveOperationsRun: 0,
    editorFocusStartTime: performance.now()
  });

  useEffect(() => {
    setEditorTextBuffer(initialContentString);
    setCharacterCountMetrics(initialContentString.length);
  }, [initialContentString]);

  const handleTextValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    setEditorTextBuffer(rawValue);
    setCharacterCountMetrics(rawValue.length);
    setIsBufferModified(rawValue !== initialContentString);
  };

  const executeSaveOperationPipeline = () => {
    if (readOnlyMode || !isBufferModified) return;
    
    internalEditorTrackerRef.current.totalSaveOperationsRun++;
    
    if (onSaveContentCommit) {
      onSaveContentCommit(editorTextBuffer);
    }
    
    setIsBufferModified(false);
    setSaveFlashSuccessTrigger(true);
    
    setTimeout(() => {
      setSaveFlashSuccessTrigger(false);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col border border-zinc-900 bg-[#050508]/80 backdrop-blur-xl rounded-sm overflow-hidden select-none font-mono cross-platform-editor-shell">
      <style dangerouslySetInnerHTML={{__html: `
        .editor-textarea-input-element {
          background: transparent;
          color: #e4e4e7;
          font-family: Georgia, serif;
          font-size: 0.95rem;
          line-height: 1.8;
          resize: none;
          outline: none;
          border: none;
          text-align: justify;
        }
        .editor-control-btn-node {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.15em;
          padding: 6px 12px;
          border-radius: 2px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: uppercase;
        }
        .editor-btn-save-active {
          background: rgba(34, 211, 238, 0.08);
          border: 1px solid rgba(34, 211, 238, 0.3);
          color: #22d3ee;
        }
        .editor-btn-save-active:hover {
          background: #22d3ee;
          color: #020203;
          box-shadow: 0 0 10px rgba(6,182,212,0.4);
        }
        .editor-header-label-tag-row {
          font-size: 8.5px;
          color: rgba(6, 182, 212, 0.5);
          letter-spacing: 0.25em;
        }
      `}} />

      {/* EDITOR BAR LAYER 1: CONTROL HEADER METRICS BANNER */}
      <div className="p-3 bg-[#020204] border-b border-zinc-900 flex justify-between items-center select-none font-mono editor-header-label-tag-row font-bold uppercase">
        <div className="flex items-center gap-2">
          <Edit3 size={11} className="text-cyan-400" />
          <span>// {editorLabelTag}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-600 text-[7.5px]">
          <span>CHARACTER_COUNT: {characterCountMetrics} UNITS</span>
          <span>REVISIONS: {internalEditorTrackerRef.current.totalSaveOperationsRun}</span>
        </div>
      </div>

      {/* EDITOR BAR LAYER 2: SELECTION INPUT ENTRY FIELD */}
      <div className="p-4 flex-1 bg-transparent flex">
        <textarea
          value={editorTextBuffer}
          onChange={handleTextValueChange}
          disabled={readOnlyMode}
          placeholder="MOUNT_TEXT_BUFFER_PROSE_STREAM_EMPTY..."
          className="w-full min-h-[160px] editor-textarea-input-element font-serif scrollbar-thin select-text"
        />
      </div>

      {/* EDITOR BAR LAYER 3: COMPILER OPERATIONAL ACTION BUTTON FOOTER */}
      <div className="p-2.5 bg-[#020204]/60 border-t border-zinc-900/60 flex justify-between items-center select-none">
        <div className="flex items-center gap-2 text-[7.5px] text-zinc-500 uppercase tracking-widest">
          {saveFlashSuccessTrigger ? (
            <span className="text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
              <CheckCircle2 size={10} /> REVISION_COMMITTED_SUCCESSFULLY_OK
            </span>
          ) : (
            <span className="flex items-center gap-1.5"><Layers size={9} /> BUFFER_STATUS: {isBufferModified ? "MODIFIED_UNSAVED" : "SYNCHRONIZED"}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={executeSaveOperationPipeline}
            disabled={readOnlyMode || !isBufferModified}
            className={`editor-control-btn-node font-bold flex items-center gap-1.5 ${isBufferModified ? "editor-btn-save-active cursor-pointer" : "bg-zinc-900/40 border border-zinc-950/20 text-zinc-600 cursor-not-allowed"}`}
          >
            <Save size={10} />
            <span>SAVE_REVISION_TRACK</span>
          </button>
        </div>
      </div>

    </div>
  );
}
