import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

interface SortableItemProps {
  id: string;
  label: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 cursor-move"
    >
      <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600">
        <GripVertical size={18} />
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
    </div>
  );
};

const SectionReorder: React.FC = () => {
  const { settings, updateSectionOrder } = useSettingsStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionLabels: Record<string, string> = {
    summary: 'Professional Summary',
    workExperience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = settings.sectionOrder.indexOf(active.id);
      const newIndex = settings.sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(settings.sectionOrder, oldIndex, newIndex);
      updateSectionOrder(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Drag to reorder sections</h3>
        <p className="text-xs text-gray-600 mb-3">
          Sections will appear in this order on your resume
        </p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={settings.sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {settings.sectionOrder.map((sectionId) => (
              <SortableItem key={sectionId} id={sectionId} label={sectionLabels[sectionId] || sectionId} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SectionReorder;

