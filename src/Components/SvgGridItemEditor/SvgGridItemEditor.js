import React from "react";
import "../SvgGridItem/SvgGridItemStyle.css";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { EditorContext } from "../../Pages/Editor/Editor";
import { createPortal } from "react-dom";

export default function SvgGridItemEditor({
    svg,
    name,
    breadboard,
    part,
    behavior,
}) {
    const { setEditorComponent, setEditorCode } =
        React.useContext(EditorContext);

    function dragMapHandler() {
        setEditorComponent({
            componentName: name,
            breadboard: breadboard,
            part: part,
            behavior: behavior,
        });
        setEditorCode(behavior);
    }

    const [{ x, y, scale, zIndex, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        height: "10%",
    }));

    const bind = useDrag(({ down, movement: [mx, my] }) =>
        api.start({
            x: down ? mx : 0,
            y: down ? my : 0,
            scale: down ? 1.2 : 1,
            zindex: down ? 5 : 2,
        })
    );
    const svgViewBox = `${svg.viewBox.baseVal.x} ${svg.viewBox.baseVal.y} ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}`;

    return (
        <>
            {createPortal(
                <animated.div
                    {...bind()}
                    style={{
                        x,
                        y,
                        scale,
                        zIndex,
                        height,
                        pointerEvents: "auto",
                    }}
                    className={"animatedSvgGridItem"}
                    onClick={() => {
                        dragMapHandler();
                    }}
                >
                    <div className="ItemDiv">
                        <svg
                            className="Svg"
                            width="100%"
                            height="100%"
                            viewBox={svgViewBox.toString()}
                            preserveAspectRatio={"true"}
                            dangerouslySetInnerHTML={{ __html: svg.innerHTML }}
                        />
                    </div>
                </animated.div>,
                document.querySelector("#SideBarItemHolder")
            )}
        </>
    );
}
