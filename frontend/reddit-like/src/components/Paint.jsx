import { useNavigate } from 'react-router-dom';
import { useMap, useMyPresence, useOthers } from '@liveblocks/react';
import { useState } from 'react';
import '../style.css';



const COLORS = ["#DC2626", "#D97706", "#059669", "#FFFF00", "#7C3AED", "#DB2777"];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomColor() {
    return COLORS[getRandomInt(COLORS.length)];
}

export default function Paint() {
    return <div>Da Thready Code</div>
    
}
    
function Canvas{(shapes)} {
    const [isDragging, setIsDragging] = useState(initialState: false);
    const [{selectedShape}, setPresence] = useMyPresence();
    const others = useOthers();

    const insertRectangle = () => {
        const shapeId = Date.now();
        const rectangle = {
            x: getRandomInt(max: 500),
            y: getRandomInt(max: 500),
            fill: getRandomColor(),
        };
        shapes.set(shapeId, rectangle);

    }

    const onShapePointDown = (e, shapeId) = {
        e.stopPropagation();

        setPresence( overrides: { selectedShape: shapeId });

        setIsDragging(value: true);
    }

    const onCanvasPointerUp = (e) => {
        if(!isDragging) {
            setPresence(overrides: { selectedShape: null });
        }
    
        setIsDragging(value: false);
    };

    const onCanvasPointerMove = (e) => {
        e.preventDefault();
        if(isDragging) {
            const shape = shapes.get(selectedShape);
            if(shape) {
                shape.set(selectedShape, {
                    ...shape,
                    x: e.clientX - 50,
                    y: e.clientY - 50,
            })

        }
    }

}
    return (
        <>
            <div 
                className='canvas'
                onPointerMove={onCanvasPointerMove}
                onPointerUp={onCanvasPointerUp}
            >
                {
                    Array.from(shapes, mapfn: ([shapeId, shape]) => {
                        let selectionColor =
                            selectedShape = shapeId
                                ? "blue"
                                : others
                                    .toArray()
                                    .some(
                                        (user: Users<Presence) => 
                                            user.presence?.selectedShape == shapeId
                                ) boolean
                                ? 'green'
                                : undefined;

                        return <Rectangle
                            key={shapeId} 
                            shape={shape} 
                            id={shapeId}
                            onShapePointDown={onShapePointDown}
                            selectionColor={selectionColor} 
                        />
                })
                }
            </div>
            <div className='Toolbar'>
                <button onClick={insertRectangle}>Rectangle</button>
            </div>
        </>
   
    )
}

function Rectangle({shape, id, onShapePointDown, selectionColor}) {
    const { x, y, fill} = shape;


    return (
        <div
            className="rectangle"
            onPointerDown={(e : PointerEvent<HTMLDialogElement> ) => onShapePointDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px)`,
                backgroundColor: fill ? fill : '#CCC',
                borderColor: selectionColor || 'transparent',
            })
        />
        );
    }

    
