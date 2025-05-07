import { useNavigate } from "react-router-dom";
import {
  useMyPresence,
  useOthers,
  useHistory,
  useBatch,
  useStorage,
} from "@liveblocks/react";
import { useState } from "react";
import "../../style.css";

const COLORS = ["#DC2626", "#D97706", "#059669", "#FFFF00", "#7C3AED", "#DB2777"];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)];
}

export default function Paint() {
  return <div>Da Thready Code</div>;
}

function Canvas() {
  const history = useHistory();
  const [isDragging, setIsDragging] = useState(false);
  const [{ selectedShape }, setPresence] = useMyPresence();
  const others = useOthers();
  const batch = useBatch();
  const shapes = useStorage((root) => root.shapes);

  const insertRectangle = () => {
    batch(() => {
      const shapeId = Date.now();
      const rectangle = {
        x: getRandomInt(500),
        y: getRandomInt(500),
        fill: getRandomColor(),
      };
      shapes.set(shapeId, rectangle);
    });
  };

  const onShapePointDown = (e, shapeId) => {
    history.pause();
    e.stopPropagation();

    setPresence({ selectedShape: shapeId }, { addToHistory: true });

    setIsDragging(true);
  };

  const onCanvasPointerUp = (e) => {
    if (!isDragging) {
      setPresence({ selectedShape: null }, { addToHistory: true });
    }

    setIsDragging(false);

    history.resume();
  };

  const onCanvasPointerMove = (e) => {
    e.preventDefault();
    if (isDragging) {
      const shape = shapes.get(selectedShape);
      if (shape) {
        shapes.set(selectedShape, {
          ...shape,
          x: e.clientX - 50,
          y: e.clientY - 50,
        });
      }
    }
  };

  const deleteRectangle = () => {
    shapes.delete(selectedShape);
    setPresence({ selectedShape: null });
  };

  return (
    <>
      <div
        className="canvas"
        onPointerMove={onCanvasPointerMove}
        onPointerUp={onCanvasPointerUp}
      >
        {Array.from(shapes).map(([shapeId, shape]) => {
          let selectionColor =
            selectedShape === shapeId
              ? "blue"
              : others
                  .toArray()
                  .some(
                    (user) =>
                      user.presence?.selectedShape === shapeId
                  )
              ? "green"
              : undefined;

          return (
            <Rectangle
              key={shapeId}
              shape={shape}
              id={shapeId}
              onShapePointDown={onShapePointDown}
              selectionColor={selectionColor}
            />
          );
        })}
      </div>
      <div className="Toolbar">
        <button onClick={insertRectangle}>Rectangle</button>
        <button onClick={history.undo}>Undo</button>
        <button
          onClick={deleteRectangle}
          disabled={selectedShape === null}
        >
          Delete
        </button>
        <button onClick={history.redo}>Redo</button>
      </div>
    </>
  );
}

function Rectangle({ shape, id, onShapePointDown, selectionColor }) {
  const { x, y, fill } = shape;

  return (
    <div
      className="rectangle"
      onPointerDown={(e) => onShapePointDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: fill || "#CCC",
        borderColor: selectionColor || "transparent",
      }}
    />
  );
}