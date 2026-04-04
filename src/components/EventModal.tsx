'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/lib/supabase';
import { X } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  onDelete?: () => void;
  event?: CalendarEvent | null;
  initialDate?: Date | null;
}

const colorOptions = [
  { value: '#0066ff', label: 'Electric Blue' },
  { value: '#00ffff', label: 'Neon Cyan' },
  { value: '#ff00ff', label: 'Plasma Pink' },
  { value: '#8b5cf6', label: 'Nebula Purple' },
  { value: '#f97316', label: 'Cosmic Orange' },
  { value: '#22c55e', label: 'Alien Green' },
  { value: '#ef4444', label: 'Red Alert' },
  { value: '#eab308', label: 'Solar Yellow' },
];

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}: EventModalProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startTime, setStartTime] = useState(() => {
    if (event?.start_time) {
      return new Date(event.start_time).toISOString().slice(0, 16);
    }
    if (initialDate) {
      return initialDate.toISOString().slice(0, 16);
    }
    const now = new Date();
    now.setMinutes(0);
    return now.toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState(() => {
    if (event?.end_time) {
      return new Date(event.end_time).toISOString().slice(0, 16);
    }
    if (initialDate) {
      const end = new Date(initialDate);
      end.setHours(end.getHours() + 1);
      return end.toISOString().slice(0, 16);
    }
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toISOString().slice(0, 16);
  });
  const [color, setColor] = useState(event?.color || '#0066ff');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f0f14] border border-[#0066ff]/30 rounded-2xl shadow-2xl shadow-[#0066ff]/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0066ff]/20 bg-gradient-to-r from-[#0066ff]/10 to-transparent">
          <h2 className="text-xl font-bold text-white">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#8a8a95] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#8a8a95] mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#0066ff]/20 rounded-xl text-white placeholder:text-[#8a8a95]/50 focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/30 outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#8a8a95] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#0066ff]/20 rounded-xl text-white placeholder:text-[#8a8a95]/50 focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/30 outline-none transition-all resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8a8a95] mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#0066ff]/20 rounded-xl text-white focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/30 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8a8a95] mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#0066ff]/20 rounded-xl text-white focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/30 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-[#8a8a95] mb-2">
              Event Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === option.value
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#0066ff]/20">
            {event && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#8a8a95] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#0066ff]/30"
              >
                {event ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
