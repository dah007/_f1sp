export type CharacterType = {
    id: number
    race: string
    classType: string
}

export type MoveRowType = (dragIndex: number, hoverIndex: number) => void

export interface DraggableProps {
    dndCharacter: CharacterType
    moveRow: MoveRowType
    index: number
}
