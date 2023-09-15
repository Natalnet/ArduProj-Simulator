import React from "react";
import { createPortal } from "react-dom";
import "./SvgGridItemStyle.css";
import { AppContext } from "../../App";
import uuid from "react-uuid";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { createConnectors } from "../../helpers/functionHelpers";
import { addConnectortToMatrix } from "../../helpers/connectivitysMatricesObjHelper";
import { ComponentModelClass } from "../../@types/ComponentModelClass";

export default function SvgGridItem({ svg, name, breadboard, part, behavior }) {
    const {
        setDragMap,
        dragMap,
        connectivityMtx,
        setConnectivityMtx,
        eletronicMtx,
        setEletronicMtx,
    } = React.useContext(AppContext);

    function dragMapHandler(xy) {
        // Aqui é criado um novo componente como objeto
        let tempMap = [...dragMap];
        let id = uuid();
        let connectors = createConnectors(
            part,
            breadboard,
            id,
            name,
            behavior
        ).connectorList;
        let componentToPush = new ComponentModelClass(
            name,
            behavior,
            breadboard,
            part,
            connectors,
            id,
            xy
        );
        tempMap.push(componentToPush);

        // É chamada a função helper para a atualização da matriz de conectividade e do seu maping
        let matrixParams = addConnectortToMatrix(
            id,
            connectors,
            connectivityMtx
        );

        //Atualização dos states do contexto
        setConnectivityMtx(matrixParams);
        setDragMap(tempMap);
    }

    const [{ x, y, scale, zIndex, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        height: "10%",
    }));

    const bind = useDrag((params) => {
        api.start({
            x: params.down ? params.movement[0] : 0,
            y: params.down ? params.movement[1] : 0,
            scale: params.down ? 1.2 : 1,
            zIndex: params.down ? 5 : 0,
        });

        if (params.down === false) {
            dragMapHandler(params.xy);
        }
    });

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
