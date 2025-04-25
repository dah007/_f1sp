import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
    id: string;
    label: string;
    value: string;
}

/**
 * A component that represents a sortable item using the `useSortable` hook from `@dnd-kit/sortable`.
 *
 * @component
 * @param {SortableItemProps} props - The properties for the SortableItem component.
 * @param {string} props.id - The unique identifier for the sortable item.
 * @param {string} props.value - The value associated with the sortable item.
 * @param {string} props.label - The label to be displayed inside the sortable item.
 *
 * @returns {JSX.Element} A sortable item component.
 *
 * @example
 * ```tsx
 * <SortableItem id="item-1" value="Item 1" label="Item 1" />
 * ```
 */
const SortableItem: React.FC<SortableItemProps> = (props: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className="border border-gray-400 rounded-lg dark:font-white light:font-black p-4 cursor-pointer m-2"
            data-value={props.value}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {props.label}
        </div>
    );
};

export default SortableItem;
