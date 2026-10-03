import React, { useMemo } from "react";
import type { BasemapFile } from "../data/types";
import type { Projection } from "../data/load";
import { COLORS, FONT_MONO } from "../theme";

interface Props {
  basemap: BasemapFile;
  projection: Projection;
  opacity: number;
  /** landmark labels fade in slightly after the roads. */
  labelOpacity?: number;
}

const KIND_GLYPH: Record<string, string> = {
  airport: "✈",
  terminal: "▣",
  stadium: "◆",
  university: "✦",
  landmark: "★",
};

// Orientation layer: major highways + well-known landmarks (both REAL OSM
// geometry — © OpenStreetMap contributors, credited on screen). Sits above the
// choropleth, below the incident dots, so a viewer can instantly tell where in
// the city they're looking.
export const BasemapLayer: React.FC<Props> = ({ basemap, projection, opacity, labelOpacity }) => {
  // project all highway segments once
  const roads = useMemo(
    () =>
      basemap.highways.map((h) => ({
        ref: h.ref,
        paths: h.segs.map((seg) =>
          seg
            .map(([lng, lat], i) => {
              const [x, y] = projection.project(lng, lat);
              return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" "),
        ),
      })),
    [basemap, projection],
  );
  const marks = useMemo(() => {
    const ms = basemap.landmarks.map((l) => {
      const [x, y] = projection.project(l.lng, l.lat);
      return { ...l, x, y, labelSide: 1, dy: 0 };
    });
    // Place full text boxes, not just anchor points. Keep labels clear of the
    // side panels and annotation band; leader lines retain the true location.
    ms.sort((a, b) => a.y - b.y);
    const placed: {left:number;right:number;top:number;bottom:number}[]=[];
    for(const mark of ms){
      const width=(mark.name.replace(/\s*✈\s*/g, "").length+2)*12;
      let found=false;
      for(const dy of [0,-30,30,-60,60,-90,90,-120,120]){
        for(const side of [1,-1]){
          const left=side===1?mark.x+12:mark.x-12-width;
          const box={left,right:left+width,top:mark.y+dy-19,bottom:mark.y+dy+9};
          if(box.left<470||box.right>1400||box.top<165||box.bottom>685)continue;
          if(placed.some(p=>box.left<p.right+10&&box.right>p.left-10&&box.top<p.bottom+6&&box.bottom>p.top-6))continue;
          mark.labelSide=side;mark.dy=dy;placed.push(box);found=true;break;
        }
        if(found)break;
      }
      if(!found)mark.labelSide=0; // retain location dot when no clear label slot exists
    }
    return ms;
  }, [basemap, projection]);
  if (opacity <= 0.001) return null;
  const lblO = (labelOpacity ?? opacity) * 0.95;

  // shields only for clean interstate refs — anything else is clutter
  const shieldFor = (ref: string) => /^I[- ]?\d+$/.test(ref.trim());

  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}
    >
      {/* highways */}
      {roads.map((r, ri) =>
        r.paths.map((d, si) => (
          <path
            key={`${ri}-${si}`}
            d={d}
            fill="none"
            stroke="#c9d6e6"
            strokeOpacity={0.22}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        )),
      )}
      {/* one small route shield per named interstate/US route */}
      {roads
        .filter((r) => shieldFor(r.ref))
        .map((r, i) => {
          // anchor at the midpoint of the longest segment
          const longest = r.paths.reduce((a, b) => (b.length > a.length ? b : a), "");
          const coords = longest.match(/[ML]([\d.]+),([\d.]+)/g) ?? [];
          if (!coords.length) return null;
          const mid = coords[Math.floor(coords.length / 2)];
          const m = mid.match(/[ML]([\d.]+),([\d.]+)/);
          if (!m) return null;
          const x = Number(m[1]);
          const y = Number(m[2]);
          if (x < 30 || x > 1890 || y < 30 || y > 1050) return null;
          return (
            <g key={`sh${i}`} opacity={lblO * 0.9}>
              <rect x={x - 27} y={y - 13} width={54} height={26} rx={5} fill="rgba(8,11,16,0.85)" stroke="rgba(201,214,230,0.35)" strokeWidth={0.8} />
              <text x={x} y={y + 5} fill="#c9d6e6" fontSize={15} fontFamily={FONT_MONO} textAnchor="middle">
                {r.ref}
              </text>
            </g>
          );
        })}
      {/* landmarks (labels de-collided: side flips + line pushes) */}
      {marks.map((l, i) => (
        <g key={i} opacity={lblO}>
          <circle cx={l.x} cy={l.y} r={4.5} fill="#ffffff" fillOpacity={0.9} stroke="rgba(0,0,0,0.7)" strokeWidth={1.4} />
          {l.labelSide!==0&&<>
          {l.dy!==0&&<line x1={l.x} y1={l.y} x2={l.x+8*l.labelSide} y2={l.y+l.dy} stroke={COLORS.inkDim} strokeWidth={1}/>}
          <text
            x={l.x + 12 * l.labelSide}
            y={l.y + 5 + l.dy}
            fill={COLORS.ink}
            fontSize={19}
            fontFamily={FONT_MONO}
            fontWeight={700}
            textAnchor={l.labelSide === 1 ? "start" : "end"}
            paintOrder="stroke"
            stroke="rgba(4,6,10,0.9)"
            strokeWidth={3.5}
          >
            {`${KIND_GLYPH[l.kind] ?? "•"} ${l.name.replace(/\s*✈\s*/g, "")}`}
          </text></>}
        </g>
      ))}
    </svg>
  );
};
