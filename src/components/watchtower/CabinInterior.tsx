import * as THREE from 'three';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import TypewriterTerminal from './TypewriterTerminal';
import VintageRadio from './VintageRadio';
import DeskLamp from './DeskLamp';

/**
 * Firewatch-style cabin interior — all procedural geometry.
 * Positioned relative to cabin floor (y=0 is floor level).
 * Cabin is 4×4 units, so x/z range from -2 to +2.
 * Front wall (door): z = -2, Back wall: z = +2
 */

// ─── INTERIOR PALETTE ───
const I = {
  darkWood: '#6B4226',
  midWood: '#8B6914',
  lightWood: '#C4A265',
  cream: '#EAE2D6',
  plank: '#3d2314', // dark brown wooden boards
  plankAlt: '#351c0e', // slightly different dark brown
  stove: '#2A2A2A',
  stovePipe: '#3A3A3A',
  metal: '#8A8A8A',
  metalDark: '#555555',
  red: '#8B2500',
  redBright: '#CC3333',
  green: '#6B8E5A',
  mapGreen: '#B8C49A',
  mapRim: '#8A8A90',
  white: '#F0EDE8',
  bedSheet: '#E8E0D0',
  pillow: '#D4C8B0',
  rugRed: '#8B3A3A',
  rugDark: '#5C2A2A',
  lamp: '#C89040',
  lampShade: '#E8C878',
  typewriter: '#4A6A5A',
  poster: '#E8D8C0',
  posterAlt: '#D0C8B8',
  fridge: '#D8D0C0',
  dustbin: '#7A7068',
  kettle: '#5A7A6A',
  counter: '#E0D5C5',
  counterTop: '#A8B898',
  burner: '#333333',
};

// ─── FIRE FINDER (center pedestal with compass map) ───
const FireFinder = ({ y }: { y: number }) => {
  const [mapTex, setMapTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Attempt to load 'map.png' or 'map.jpg', safely handling color encoding
    const loader = new THREE.TextureLoader();

    const applyColorSpace = (t: THREE.Texture) => {
      if ('colorSpace' in t) t.colorSpace = (THREE as any).SRGBColorSpace;
      else if ('encoding' in t) (t as any).encoding = 3001; // THREE.sRGBEncoding fallback
      t.needsUpdate = true;
      return t;
    };

    loader.load('/map.jpg', (tex) => {
      setMapTex(applyColorSpace(tex));
    }, undefined, () => {
      // Silently fail if map image isn't available
    });
  }, []);

  return (
    <group position={[0, y, 0]}>
      {/* Detailed Pedestal base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} flatShading />
      </mesh>
      {/* Map table top */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.0, 0.08, 1.0]} />
        <meshStandardMaterial color={I.midWood} roughness={0.85} flatShading />
      </mesh>

      {/* Map circle (green topographic base or actual custom map image) */}
      <mesh position={[0, 1.091, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 32]} />
        {mapTex ? (
          <meshBasicMaterial map={mapTex} />
        ) : (
          <meshStandardMaterial color={I.mapGreen} roughness={0.7} />
        )}
      </mesh>

      {/* Map rim / metal casing */}
      <mesh position={[0, 1.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.46, 32]} />
        <meshStandardMaterial color={I.mapRim} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Outer glass cover (Fix: removed incorrect 90-degree rotation) */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
        <meshStandardMaterial color={I.white} transparent opacity={0.15} roughness={0.1} />
      </mesh>

      {/* Compass Pivot Mechanism */}
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.05, 12]} />
        <meshStandardMaterial color={I.metalDark} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Sighting Arm (Alidade) */}
      <group position={[0, 1.18, 0]} rotation={[0, 0.6, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.02, 0.03]} />
          <meshStandardMaterial color={I.metalDark} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Sighting vanes (upright tabs on the ends) */}
        <mesh position={[-0.4, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.1, 0.04]} />
          <meshStandardMaterial color={I.metal} metalness={0.6} />
        </mesh>
        <mesh position={[0.4, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.04]} />
          <meshStandardMaterial color={I.metal} metalness={0.6} />
        </mesh>
      </group>

      {/* Brass Plaque on front */}
      <mesh position={[0, 0.85, -0.31]}>
        <boxGeometry args={[0.25, 0.15, 0.02]} />
        <meshStandardMaterial color="#B08D57" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

// ─── DESK + CHAIR + TYPEWRITER + LAMP ───
const DeskArea = ({ y }: { y: number }) => (
  // Omitted changes, kept same code as original! 
  // For brevity while making the massive edit.
  <group position={[-1.9, y, -2.15]}>
    {/* Desk surface */}
    <mesh position={[0, 0.72, 0]}>
      <boxGeometry args={[1.1, 0.05, 0.6]} />
      <meshStandardMaterial color={I.lightWood} roughness={0.85} flatShading />
    </mesh>
    {/* Desk legs */}
    {[[-0.5, 0, -0.25], [0.5, 0, -0.25], [-0.5, 0, 0.25], [0.5, 0, 0.25]].map(([x, , z], i) => (
      <mesh key={`dl-${i}`} position={[x, 0.36, z]}>
        <boxGeometry args={[0.05, 0.72, 0.05]} />
        <meshStandardMaterial color={I.midWood} roughness={0.9} flatShading />
      </mesh>
    ))}
    {/* Desk drawer front */}
    <mesh position={[0, 0.58, -0.28]}>
      <boxGeometry args={[0.8, 0.12, 0.02]} />
      <meshStandardMaterial color={I.midWood} roughness={0.85} />
    </mesh>
    {/* Drawer handle */}
    <mesh position={[0, 0.58, -0.3]}>
      <boxGeometry args={[0.15, 0.02, 0.02]} />
      <meshStandardMaterial color={I.metal} metalness={0.5} roughness={0.4} />
    </mesh>

    {/* Books and scattered papers on desk */}
    {/* Books and scattered papers on desk */}
    <mesh position={[-0.4, 0.795, 0.2]} rotation={[0, 0.2, 0]}>
      <boxGeometry args={[0.25, 0.05, 0.35]} />
      <meshStandardMaterial color="#5C3A21" roughness={0.9} />
    </mesh>
    <mesh position={[-0.45, 0.84, 0.15]} rotation={[0, -0.1, 0]}>
      <boxGeometry args={[0.22, 0.04, 0.3]} />
      <meshStandardMaterial color="#2B463C" roughness={0.9} />
    </mesh>
    {/* Shifted papers securely toward desk center to eliminate diagonal 'cardboard' edge-bleed over the desk rim */}
    <mesh position={[0.25, 0.771, 0.05]} rotation={[-Math.PI / 2, 0, 0.5]}>
      <planeGeometry args={[0.25, 0.3]} />
      <meshStandardMaterial color={I.white} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0.2, 0.772, 0.1]} rotation={[-Math.PI / 2, 0, -0.2]}>
      <planeGeometry args={[0.25, 0.3]} />
      <meshStandardMaterial color="#F5F5DC" side={THREE.DoubleSide} />
    </mesh>

    {/* Coffee Mug */}
    <group position={[0.45, 0.77, -0.15]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color="#D84B20" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.005, 12]} />
        <meshStandardMaterial color="#3B2516" roughness={1.0} /> {/* Coffee inside */}
      </mesh>
      <mesh position={[0.04, 0.06, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#D84B20" roughness={0.6} />
      </mesh>
    </group>

    {/* Typewriter - Massive Interactive Detail Upgrade */}
    <TypewriterTerminal position={[0.05, 0.77, -0.05]} palette={I} />

    {/* Interactive Toggleable Desk Lamp */}
    <DeskLamp position={[-0.45, 0.77, -0.15]} rotation={[0, 0.5, 0]} palette={I} />

    {/* Chair */}
    <group position={[0, 0, 0.55]} rotation={[0, Math.PI, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color={I.cream} roughness={0.85} flatShading />
      </mesh>
      {/* Chair legs */}
      {[[-0.15, 0, -0.15], [0.15, 0, -0.15], [-0.15, 0, 0.15], [0.15, 0, 0.15]].map(([x, , z], i) => (
        <mesh key={`cl-${i}`} position={[x, 0.2, z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 5]} />
          <meshStandardMaterial color={I.cream} roughness={0.8} />
        </mesh>
      ))}
      {/* Back */}
      <mesh position={[0, 0.65, -0.18]}>
        <boxGeometry args={[0.36, 0.5, 0.03]} />
        <meshStandardMaterial color={I.cream} roughness={0.85} flatShading />
      </mesh>
      {/* Back slats */}
      {[0.55, 0.75].map((yy, i) => (
        <mesh key={`bs-${i}`} position={[0, yy, -0.16]}>
          <boxGeometry args={[0.3, 0.06, 0.015]} />
          <meshStandardMaterial color={I.cream} roughness={0.8} />
        </mesh>
      ))}
    </group>
  </group>
);

// ─── BED + PILLOW + RUG ───
const BedArea = ({ y }: { y: number }) => (
  // Bed stretched along Z axis to look like a proper bed
  <group position={[-2.0, y, 1.5]}>
    {/* Bed frame */}
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[0.9, 0.08, 1.8]} />
      <meshStandardMaterial color={I.darkWood} roughness={0.9} flatShading />
    </mesh>
    {/* Frame legs */}
    {[[-0.4, 0, -0.85], [0.4, 0, -0.85], [-0.4, 0, 0.85], [0.4, 0, 0.85]].map(([x, , z], i) => (
      <mesh key={`bl-${i}`} position={[x, 0.15, z]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} />
      </mesh>
    ))}
    {/* Headboard */}
    <mesh position={[0, 0.55, 0.88]}>
      <boxGeometry args={[0.9, 0.7, 0.04]} />
      <meshStandardMaterial color={I.darkWood} roughness={0.9} flatShading />
    </mesh>
    {/* Mattress - Standard Height */}
    <mesh position={[0, 0.42, 0]}>
      <boxGeometry args={[0.84, 0.15, 1.74]} />
      <meshStandardMaterial color={I.bedSheet} roughness={0.95} />
    </mesh>
    {/* Pillows */}
    <mesh position={[-0.22, 0.52, 0.65]}>
      <boxGeometry args={[0.38, 0.08, 0.28]} />
      <meshStandardMaterial color={I.pillow} roughness={0.95} />
    </mesh>
    <mesh position={[0.22, 0.52, 0.65]}>
      <boxGeometry args={[0.38, 0.08, 0.28]} />
      <meshStandardMaterial color={I.pillow} roughness={0.95} />
    </mesh>
    {/* Blanket - draped over the lower half */}
    <mesh position={[0, 0.425, -0.3]}>
      <boxGeometry args={[0.86, 0.16, 1.0]} />
      <meshStandardMaterial color={I.rugDark} roughness={0.9} />
    </mesh>
    {/* Red blanket stripe */}
    <mesh position={[0, 0.43, -0.3]}>
      <boxGeometry args={[0.87, 0.17, 0.8]} />
      <meshStandardMaterial color={I.redBright} roughness={0.9} />
    </mesh>

    {/* Bedside Table - Shifted inward to prevent lantern wall-clipping */}
    <group position={[-0.3, 0, -1.05]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color={I.midWood} roughness={0.9} />
      </mesh>
      {/* Table Legs */}
      {[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([x, z], i) => (
        <mesh key={`nt-${i}`} position={[x, 0.2, z]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial color={I.darkWood} roughness={0.9} />
        </mesh>
      ))}
      {/* Lantern / Oil Lamp on table */}
      <group position={[0, 0.45, 0]}>
        {/* Base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.04, 12]} />
          <meshStandardMaterial color="#B08D57" metalness={0.8} />
        </mesh>
        {/* Glass globe */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.06, 0.04, 0.16, 12]} />
          <meshStandardMaterial color="#FFFAEE" transparent opacity={0.6} roughness={0.1} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.04, 12]} />
          <meshStandardMaterial color="#B08D57" metalness={0.8} />
        </mesh>
        {/* Lantern Handle ring */}
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.005, 4, 16]} />
          <meshStandardMaterial color={I.metalDark} />
        </mesh>
        {/* Tiny light inside the lantern */}
        <pointLight intensity={0.5} color="#FF9933" distance={2} decay={2} position={[0, 0.12, 0]} />
      </group>
    </group>

    {/* Highly detailed Rug - Braided circular style */}
    <group position={[-0.1, 0.02, -1.0]} rotation={[-Math.PI / 2, 0, 0.1]}>
      {[0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].map((r, i) => (
        <mesh key={`rug-${i}`} position={[0, 0, i * 0.001]}>
          <circleGeometry args={[r, 32]} />
          <meshStandardMaterial color={i % 2 === 0 ? I.rugDark : I.rugRed} roughness={1.0} />
        </mesh>
      ))}
    </group>
  </group>
);

// ─── WOOD STOVE + CHIMNEY ───
const WoodStove = ({ y }: { y: number }) => (
  // Stove pushed tight against the X=2, Z=2 wall gap beside the counter
  <group position={[2.1, y, 2.1]}>
    {/* Stove base/ash-catcher */}
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[0.55, 0.1, 0.45]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.9} flatShading />
    </mesh>

    {/* Stack of Firewood next to the stove - Pulled forward and left to clear both the stove chassis and the exterior wall */}
    <group position={[-0.55, 0.1, -0.05]}>
      {/* Logs lying in a pile */}
      {[
        [0, 0, 0], [0.15, 0, 0], [0.07, 0.12, 0],
        [0, 0, 0.1], [0.15, 0, 0.1], [0.07, 0.12, 0.1],
        [-0.05, 0.22, 0.05], [0.12, 0.22, 0.05]
      ].map(([x, yy, z], i) => (
        <mesh key={`log-${i}`} position={[x, yy, z]} rotation={[Math.PI / 2, 0, 0.1 * i]}>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
          <meshStandardMaterial color="#5C3A21" roughness={1.0} />
        </mesh>
      ))}
    </group>
    {/* Stove body */}
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.5, 0.4, 0.4]} />
      <meshStandardMaterial color={I.stove} roughness={0.8} flatShading />
    </mesh>
    {/* Stove legs */}
    {[[-0.2, 0, -0.15], [0.2, 0, -0.15], [-0.2, 0, 0.15], [0.2, 0, 0.15]].map(([x, , z], i) => (
      <mesh key={`sl-${i}`} position={[x, 0.05, z]}>
        <cylinderGeometry args={[0.025, 0.03, 0.1, 6]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.5} />
      </mesh>
    ))}
    {/* Stove door with glass window showing crackling fire inside */}
    <group position={[-0.26, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[0.02, 0.25, 0.25]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.6} />
      </mesh>
      {/* Glowing fire interior */}
      <mesh position={[0.015, 0, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.2]} />
        <meshStandardMaterial color="#FF4500" emissive="#FF2200" emissiveIntensity={0.8} />
      </mesh>
      {/* Inner fire pointlight */}
      <pointLight position={[0.1, 0, 0]} intensity={1.5} color="#FF6600" distance={2} />
    </group>
    {/* Door grill lines (Texture) */}
    {[-0.05, 0, 0.05].map(z => (
      <mesh key={`grill-${z}`} position={[-0.27, 0.4, z]}>
        <boxGeometry args={[0.01, 0.15, 0.02]} />
        <meshStandardMaterial color={I.stovePipe} roughness={0.6} />
      </mesh>
    ))}
    {/* Door handle */}
    <mesh position={[-0.28, 0.4, -0.08]}>
      <boxGeometry args={[0.015, 0.015, 0.06]} />
      <meshStandardMaterial color={I.metal} metalness={0.5} roughness={0.3} />
    </mesh>
    {/* Stove top surface */}
    <mesh position={[0, 0.61, 0]}>
      <boxGeometry args={[0.52, 0.02, 0.42]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} metalness={0.3} />
    </mesh>
    {/* Air vents on side */}
    {[0.3, 0.4, 0.5].map(yy => (
      <mesh key={`vent-${yy}`} position={[0, yy, 0.21]}>
        <boxGeometry args={[0.2, 0.02, 0.01]} />
        <meshStandardMaterial color={I.stovePipe} roughness={0.9} />
      </mesh>
    ))}

    {/* Chimney pipe going up through ceiling */}
    <mesh position={[0.1, 1.8, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
      <meshStandardMaterial color={I.stovePipe} roughness={0.6} />
    </mesh>
    {/* 90-degree elbow (horizontal section) */}
    <mesh position={[0.05, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
      <meshStandardMaterial color={I.stovePipe} roughness={0.6} />
    </mesh>
  </group>
);

// ─── KITCHEN COUNTER + STOVETOP ───
const KitchenCounter = ({ y }: { y: number }) => (
  // Counter along the right wall. The gap between Z=1.2 and Z=2 is for the stove.
  <group position={[2.1, y, -0.2]}>
    {/* Counter body (long, along right wall) */}
    <mesh position={[0, 0.42, 0]}>
      <boxGeometry args={[0.6, 0.84, 2.6]} />
      <meshStandardMaterial color={I.counter} roughness={0.85} flatShading />
    </mesh>
    {/* Countertop */}
    <mesh position={[0, 0.85, 0]}>
      <boxGeometry args={[0.65, 0.04, 2.7]} />
      <meshStandardMaterial color={I.counterTop} roughness={0.7} />
    </mesh>

    {/* Overhead Cabinets (Hang over) */}
    <group position={[0.1, 2.2, 0]}>
      <mesh>
        <boxGeometry args={[0.4, 0.6, 2.6]} />
        <meshStandardMaterial color={I.counter} roughness={0.9} flatShading />
      </mesh>
      {/* Cabinet doors with indent detailing */}
      {[-0.9, -0.3, 0.3, 0.9].map((z, i) => (
        <group key={`oh-cab-${i}`}>
          <mesh position={[-0.21, 0, z]}>
            <boxGeometry args={[0.02, 0.55, 0.55]} />
            <meshStandardMaterial color={I.cream} roughness={0.8} />
          </mesh>
          <mesh position={[-0.22, 0, z]}>
            <boxGeometry args={[0.01, 0.45, 0.45]} />
            <meshStandardMaterial color={I.counter} roughness={0.9} />
          </mesh>
          {/* Handle */}
          <mesh position={[-0.23, -0.2, z + (i % 2 === 0 ? 0.2 : -0.2)]}>
            <boxGeometry args={[0.015, 0.08, 0.015]} />
            <meshStandardMaterial color={I.metal} metalness={0.4} />
          </mesh>
        </group>
      ))}
      {/* Hanging Hooks & Mugs underneath the counter */}
      {[-0.8, -0.5, -0.2].map(z => (
        <group key={`hook-${z}`} position={[-0.1, -0.32, z]}>
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.05, 4]} />
            <meshStandardMaterial color={I.metalDark} />
          </mesh>
          {/* Hanging Mug */}
          <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.035, 0.08, 12]} />
            <meshStandardMaterial color="#6B8E5A" roughness={0.4} />
          </mesh>
        </group>
      ))}
      <pointLight position={[-0.1, -0.3, 0]} intensity={0.5} color="#FFEAC0" distance={3} />
    </group>

    {/* Oven built into the counter */}
    <group position={[-0.31, 0.35, -0.45]}>
      <mesh>
        <boxGeometry args={[0.02, 0.45, 0.5]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.6} />
      </mesh>
      {/* Oven window flush against door face */}
      <mesh position={[-0.012, -0.03, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.34, 0.26]} />
        <meshStandardMaterial color="#111" roughness={0.1} />
      </mesh>
      {/* Oven Handle */}
      <mesh position={[-0.028, 0.14, 0]}>
        <boxGeometry args={[0.018, 0.018, 0.38]} />
        <meshStandardMaterial color={I.metal} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Handle mounts */}
      <mesh position={[-0.018, 0.14, -0.16]}>
        <boxGeometry args={[0.018, 0.018, 0.02]} />
        <meshStandardMaterial color={I.metal} metalness={0.5} />
      </mesh>
      <mesh position={[-0.018, 0.14, 0.16]}>
        <boxGeometry args={[0.018, 0.018, 0.02]} />
        <meshStandardMaterial color={I.metal} metalness={0.5} />
      </mesh>
    </group>

    {/* Drawer fronts (remaining spaces around oven) */}
    {[-1.00, 0.10, 0.85].map((z, i) => (
      <group key={`drawer-${i}`}>
        <mesh position={[-0.31, 0.65, z]}>
          <boxGeometry args={[0.01, 0.2, i === 2 ? 0.55 : 0.45]} />
          <meshStandardMaterial color={I.cream} roughness={0.8} />
        </mesh>
        <mesh position={[-0.33, 0.65, z]}>
          <boxGeometry args={[0.02, 0.02, 0.08]} />
          <meshStandardMaterial color={I.metal} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    ))}

    {/* Lower cabinet doors */}
    {[-1.00, 0.10, 0.85].map((z, i) => (
      <mesh key={`cab-${i}`} position={[-0.31, 0.25, z]}>
        <boxGeometry args={[0.01, 0.45, i === 2 ? 0.55 : 0.45]} />
        <meshStandardMaterial color={I.cream} roughness={0.85} />
      </mesh>
    ))}

    {/* Black built-in electric stovetop base beneath the burners */}
    <mesh position={[0.075, 0.875, -0.45]}>
      <boxGeometry args={[0.35, 0.015, 0.5]} />
      <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.2} />
    </mesh>

    {/* Stovetop burners */}
    {[[0, 0.89, -0.6], [0.15, 0.89, -0.6], [0, 0.89, -0.3], [0.15, 0.89, -0.3]].map(([x, yy, z], i) => (
      <mesh key={`burn-${i}`} position={[x, yy, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 12]} />
        <meshStandardMaterial color={I.redBright} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    ))}

    {/* Prominent Sink Basin - Safely dialed to 1.8x width and anchored strictly to the left to preserve the cutting board */}
    <group position={[0, 0.86, 0.45]} scale={[1, 1, 1.8]}>
      {/* Sink Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 16]} />
        <meshStandardMaterial color={I.metal} side={THREE.DoubleSide} />
      </mesh>
      {/* Sink Basin */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color={I.metalDark} />
      </mesh>
      {/* Faucet - Inverse scaled on Z to prevent it from visually stretching with the massive basin */}
      <mesh position={[0.16, 0.1, 0]} scale={[1, 1, 1/1.8]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        <meshStandardMaterial color={I.metal} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.09, 0.18, 0]} rotation={[0, 0, 1.0]} scale={[1, 1, 1/1.8]}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        <meshStandardMaterial color={I.metal} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>

    {/* Stack of Ceramic Plates on Counter - Softly nudged just away from the sink per request */}
    <group position={[0.1, 0.88, -0.05]}>
      {[0, 0.015, 0.03, 0.045].map((yy) => (
        <mesh key={`plate-${yy}`} position={[0, yy, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      ))}
    </group>

    {/* Wooden Cutting Board with Kitchen Knife - Reset completely unaltered to original coordinate */}
    <group position={[0, 0.88, 0.95]}>
        <mesh>
          <boxGeometry args={[0.25, 0.02, 0.35]} />
          <meshStandardMaterial color="#C4A265" roughness={0.9} />
        </mesh>
        {/* Knife blade */}
        <mesh position={[0.05, 0.02, 0]} rotation={[0, 0.3, -Math.PI / 2]}>
          <boxGeometry args={[0.002, 0.12, 0.03]} />
          <meshStandardMaterial color={I.metal} metalness={0.8} />
        </mesh>
        {/* Knife handle */}
        <mesh position={[0, 0.02, 0.08]} rotation={[0, 0.3, -Math.PI / 2]}>
          <boxGeometry args={[0.015, 0.08, 0.02]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

    {/* Water Storing Can (Jerry Can) - Dropped to floor level explicitly to clear the cupboards */}
    <group position={[0.4, 0.125, 0.9]}>
      <mesh>
        <boxGeometry args={[0.15, 0.25, 0.25]} />
        <meshStandardMaterial color="#2E5A88" roughness={0.6} flatShading />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        <meshStandardMaterial color="#F0F0F0" />
      </mesh>
    </group>

    {/* Cast Iron Frying Pan on front burner - Physically centered over electric plate */}
    <group position={[0, 0.89, -0.5]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.03, 16]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      <mesh position={[0.1, 0.03, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>

    {/* Stylish Kettle on back stovetop - Physically centered perfectly over electric plate */}
    <group position={[0, 0.89, -0.8]}>
      {/* Tapered body */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 16]} />
        <meshStandardMaterial color={I.kettle} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Kettle Lid */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.02, 16]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.6} />
      </mesh>
      {/* Nice Cone Spout */}
      <mesh position={[0.06, 0.04, 0]} rotation={[0, 0, -1.0]}>
        <cylinderGeometry args={[0.008, 0.015, 0.06, 8]} />
        <meshStandardMaterial color={I.kettle} roughness={0.5} />
      </mesh>
      {/* Clean D-shaped Handle */}
      <mesh position={[-0.05, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.01]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.02, 0.08, 0]}>
        <boxGeometry args={[0.06, 0.015, 0.01]} />
        <meshStandardMaterial color={I.metalDark} roughness={0.5} />
      </mesh>
    </group>
  </group>
);

// ─── MINI REFRIGERATOR ("SAFE CASE") ───
const MiniFridge = ({ y }: { y: number }) => (
  // Fridge beside the desk
  <group position={[2.0, y, -2.1]}>
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[0.5, 0.7, 0.45]} />
      <meshStandardMaterial color={I.fridge} roughness={0.8} flatShading />
    </mesh>
    {/* Door line */}
    <mesh position={[0, 0.35, -0.23]}>
      <boxGeometry args={[0.45, 0.65, 0.01]} />
      <meshStandardMaterial color={I.cream} roughness={0.8} />
    </mesh>
    {/* Handle */}
    <mesh position={[-0.15, 0.45, -0.24]}>
      <boxGeometry args={[0.02, 0.15, 0.02]} />
      <meshStandardMaterial color={I.metal} metalness={0.4} roughness={0.5} />
    </mesh>
  </group>
);

// ─── FIRE EXTINGUISHER ───
const FireExtinguisher = ({ y }: { y: number }) => (
  // Moved closer to the stove area/corner
  <group position={[2.2, y, 0.7]}>
    {/* Body */}
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
      <meshStandardMaterial color={I.redBright} roughness={0.7} flatShading />
    </mesh>
    {/* Top valve */}
    <mesh position={[0, 0.38, 0]}>
      <cylinderGeometry args={[0.02, 0.04, 0.05, 6]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} />
    </mesh>
    {/* Handle */}
    <mesh position={[0.04, 0.38, 0]} rotation={[0, 0, -0.5]}>
      <boxGeometry args={[0.06, 0.015, 0.015]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} />
    </mesh>
  </group>
);

// ─── DUSTBIN ───
const Dustbin = ({ y }: { y: number }) => (
  // Moved out from in front of the door, tucked near the desk/fridge
  <group position={[-2.2, y, -0.5]}>
    {/* Bin body */}
    <mesh position={[0, 0.15, 0]}>
      <cylinderGeometry args={[0.12, 0.1, 0.3, 6]} />
      <meshStandardMaterial color={I.dustbin} roughness={0.9} flatShading />
    </mesh>
    {/* Bin rim */}
    <mesh position={[0, 0.305, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.125, 6]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

// ─── WALL CLOCK ───
const WallClock = ({ y }: { y: number }) => (
  // Clock placed prominently above the door so the player easily spots it when looking around
  <group position={[0, y + 2.4, -2.45]}>
    {/* Clock body rotated correctly to not intersect hands/walls! */}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} />
    </mesh>
    {/* Clock face */}
    <mesh position={[0, 0, 0.02]}>
      <circleGeometry args={[0.17, 24]} />
      <meshStandardMaterial color={I.white} />
    </mesh>
    {/* Hour hand */}
    <mesh position={[0, 0.04, 0.025]} rotation={[0, 0, -0.8]}>
      <boxGeometry args={[0.015, 0.1, 0.01]} />
      <meshStandardMaterial color={I.stove} />
    </mesh>
    {/* Minute hand */}
    <mesh position={[0, -0.01, 0.03]} rotation={[0, 0, 0.5]}>
      <boxGeometry args={[0.01, 0.14, 0.01]} />
      <meshStandardMaterial color={I.stove} />
    </mesh>
  </group>
);

// ─── PROCEDURAL PHYSICAL GRAVITY CATENARY THREAD WITH KNOTS & LOOSE TAILS ───
const RedThread = ({
  p1,
  p2,
  sag = 0.05,
  color = "#dc2626",
  thickness = 0.0022,
  tension = 1.0,
  tailLength = 0.04
}: {
  p1: [number, number, number];
  p2: [number, number, number];
  sag?: number;
  color?: string;
  thickness?: number;
  tension?: number; // Higher tension = straighter yarn, lower tension = heavier catenary hang
  tailLength?: number;
}) => {
  const { mainCurve, tail1Curve, tail2Curve } = useMemo(() => {
    const v1 = new THREE.Vector3(...p1);
    const v2 = new THREE.Vector3(...p2);

    // Pull starting points slightly outward along local Z so they loop cleanly around the pin head
    v1.z += 0.005;
    v2.z += 0.005;

    const span = v1.distanceTo(v2);
    // Dynamic catenary droop based on distance and tension
    const actualSag = (sag * (span / 0.5) * 0.9) / Math.max(tension, 0.2);

    // Generate catenary curve points with gravitational drop (Y-axis down)
    const points: THREE.Vector3[] = [];
    const segments = 16;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Linear interpolation between the two pins
      const pt = new THREE.Vector3().lerpVectors(v1, v2, t);

      // Catenary parabolic droop formula: y = 4 * sag * t * (1 - t)
      const droop = actualSag * 4 * t * (1 - t);
      pt.y -= droop;

      // Slight forward bow along Z so thread floats cleanly in front of paper cards
      pt.z += 0.012 * Math.sin(t * Math.PI);

      points.push(pt);
    }

    const mainCurve = new THREE.CatmullRomCurve3(points);

    // Knot and loose hanging tail at Pin 1 (drooping naturally with gravity)
    const tail1Points = [
      new THREE.Vector3(v1.x, v1.y, v1.z),
      new THREE.Vector3(v1.x + 0.008, v1.y - tailLength * 0.45, v1.z + 0.003),
      new THREE.Vector3(v1.x + 0.004, v1.y - tailLength, v1.z + 0.002)
    ];
    const tail1Curve = new THREE.CatmullRomCurve3(tail1Points);

    // Knot and loose hanging tail at Pin 2
    const tail2Points = [
      new THREE.Vector3(v2.x, v2.y, v2.z),
      new THREE.Vector3(v2.x - 0.006, v2.y - tailLength * 0.5, v2.z + 0.003),
      new THREE.Vector3(v2.x - 0.003, v2.y - tailLength * 1.1, v2.z + 0.001)
    ];
    const tail2Curve = new THREE.CatmullRomCurve3(tail2Points);

    return { mainCurve, tail1Curve, tail2Curve };
  }, [p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], sag, tension, tailLength]);

  return (
    <group>
      {/* Main Sagging Catenary Thread */}
      <mesh>
        <tubeGeometry args={[mainCurve, 36, thickness, 8, false]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Tiny Tie Knot / Wrap Loop Around Pin 1 */}
      <mesh position={[p1[0], p1[1], p1[2] + 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.008, thickness * 1.2, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Loose Hanging Tail 1 */}
      <mesh>
        <tubeGeometry args={[tail1Curve, 12, thickness * 0.85, 6, false]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Tiny Tie Knot / Wrap Loop Around Pin 2 */}
      <mesh position={[p2[0], p2[1], p2[2] + 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.008, thickness * 1.2, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Loose Hanging Tail 2 */}
      <mesh>
        <tubeGeometry args={[tail2Curve, 12, thickness * 0.85, 6, false]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
};

// ─── DETECTIVE CONSPIRACY BOARD (FLUSH AGAINST BED SIDE LEFT WALL AT X=-2.45, EXACTLY IN THE MIDDLE Z=0) ───
const DetectiveBoard = ({ y }: { y: number }) => {
  // Left wall inner surface is at X = -2.46. Board center at X = -2.45, Z = 0 places the back frame exactly flush against the wall.
  // Project pin coordinates relative to corkboard center [0, 0, 0], with positive Z facing into the room.
  const pProteus: [number, number, number]   = [-0.42, 0.26, 0.038];   // Top-Left: Proteus
  const pIni: [number, number, number]       = [0.0, 0.28, 0.038];     // Top-Center: ini CLI
  const pWcheck: [number, number, number]    = [0.44, 0.25, 0.038];    // Top-Right: wcheck scanner
  const pGifted: [number, number, number]    = [-0.44, 0.0, 0.038];    // Mid-Left: Gifted India Initiative
  const pPortfolio: [number, number, number] = [0.0, 0.0, 0.038];      // Center Hub: 3D Portfolio
  const pRobotics: [number, number, number]  = [0.44, -0.02, 0.038];   // Mid-Right: Line Follower & Micromouse
  const pCloud: [number, number, number]     = [-0.42, -0.27, 0.038];  // Bottom-Left: Personal Cloud Server & Homelab
  const pDiscord: [number, number, number]   = [0.42, -0.27, 0.038];   // Bottom-Right: Discord Bot Platform

  return (
    <group position={[-2.45, y + 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Dedicated spotlight illuminating the Detective Project Board from inside the room */}
      <pointLight position={[0, 0.3, 0.8]} intensity={1.3} color="#FFF5E4" distance={3.2} decay={2} />

      {/* ─── CORKBOARD & WOOD FRAME ─── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.32, 0.84, 0.02]} />
        <meshStandardMaterial color="#9F784B" roughness={0.9} />
      </mesh>
      {/* Top Wood Frame Rail */}
      <mesh position={[0, 0.445, 0.005]}>
        <boxGeometry args={[1.42, 0.05, 0.03]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} />
      </mesh>
      {/* Bottom Wood Frame Rail */}
      <mesh position={[0, -0.445, 0.005]}>
        <boxGeometry args={[1.42, 0.05, 0.03]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} />
      </mesh>
      {/* Left Wood Frame Rail */}
      <mesh position={[-0.685, 0, 0.005]}>
        <boxGeometry args={[0.05, 0.84, 0.03]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} />
      </mesh>
      {/* Right Wood Frame Rail */}
      <mesh position={[0.685, 0, 0.005]}>
        <boxGeometry args={[0.05, 0.84, 0.03]} />
        <meshStandardMaterial color={I.darkWood} roughness={0.9} />
      </mesh>

      {/* ─── TOP BOARD HEADER: "ACTIVE CASE: WOETER LABS" ─── */}
      <group position={[0, 0.395, 0.024]}>
        <mesh>
          <boxGeometry args={[0.48, 0.05, 0.002]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        <Text
          position={[0, 0, 0.003]}
          fontSize={0.022}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          ACTIVE CASE: WOETER LABS
        </Text>
      </group>

      {/* ══════════════ PROJECT 1: PROTEUS (TOP-LEFT) ══════════════ */}
      {/* Nanoprecipitation Simulation Pipeline: Python, RDKit, LAMMPS, 3D Web */}
      <group>
        <mesh position={[-0.42, 0.22, 0.024]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.26, 0.22, 0.003]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Blueprint Wireframe Grid Decal */}
        <mesh position={[-0.42, 0.21, 0.027]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.23, 0.14, 0.001]} />
          <meshStandardMaterial color="#38bdf8" wireframe />
        </mesh>
        <Text
          position={[-0.42, 0.285, 0.028]}
          rotation={[0, 0, -0.06]}
          fontSize={0.022}
          color="#38bdf8"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          PROTEUS SIMULATOR
        </Text>
        <Text
          position={[-0.42, 0.135, 0.028]}
          rotation={[0, 0, -0.06]}
          fontSize={0.013}
          color="#94a3b8"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Python · RDKit · LAMMPS · 3D
        </Text>
        {/* Push Pin */}
        <mesh position={pProteus} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color={I.redBright} roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 2: INI CLI (TOP-CENTER) ══════════════ */}
      {/* Universal Project Initializer: Go, Charm.sh, Cobra, go:embed */}
      <group>
        <mesh position={[0.0, 0.24, 0.024]} rotation={[0, 0, 0.03]}>
          <boxGeometry args={[0.28, 0.20, 0.003]} />
          <meshStandardMaterial color="#1e1e2e" roughness={0.7} />
        </mesh>
        <mesh position={[0.0, 0.23, 0.027]} rotation={[0, 0, 0.03]}>
          <boxGeometry args={[0.25, 0.12, 0.001]} />
          <meshStandardMaterial color="#cba6f7" />
        </mesh>
        <Text
          position={[0.0, 0.30, 0.028]}
          rotation={[0, 0, 0.03]}
          fontSize={0.024}
          color="#f38ba8"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          ini — TUI / CLI
        </Text>
        <Text
          position={[0.0, 0.24, 0.029]}
          rotation={[0, 0, 0.03]}
          fontSize={0.014}
          color="#11111b"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Universal 39+ Lang Scaffolder
        </Text>
        <Text
          position={[0.0, 0.18, 0.029]}
          rotation={[0, 0, 0.03]}
          fontSize={0.012}
          color="#313244"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Go · Charm.sh · go:embed
        </Text>
        {/* Push Pin */}
        <mesh position={pIni} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 3: WCHECK SCANNER (TOP-RIGHT) ══════════════ */}
      {/* Headless Web Stress Scanner: Go, chromedp, DevTools, Worker Pool */}
      <group>
        <mesh position={[0.44, 0.20, 0.024]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.25, 0.22, 0.003]} />
          <meshStandardMaterial color="#fef08a" roughness={0.7} />
        </mesh>
        {/* Warning Stamp Tag */}
        <mesh position={[0.44, 0.28, 0.028]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.18, 0.035, 0.002]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <Text
          position={[0.44, 0.28, 0.030]}
          rotation={[0, 0, -0.04]}
          fontSize={0.014}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          STRESS TEST
        </Text>
        <Text
          position={[0.44, 0.225, 0.028]}
          rotation={[0, 0, -0.04]}
          fontSize={0.021}
          color="#0f172a"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          wcheck
        </Text>
        <Text
          position={[0.44, 0.155, 0.028]}
          rotation={[0, 0, -0.04]}
          fontSize={0.012}
          color="#475569"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.3}
        >
          Headless Chrome Scanner{"\n"}Go · chromedp · Concurrency
        </Text>
        {/* Push Pin */}
        <mesh position={pWcheck} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color={I.redBright} roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 4: GIFTED INDIA INITIATIVE (MID-LEFT) ══════════════ */}
      {/* Official Production Platform: Next.js 15, Node.js, Express, MySQL, Three.js */}
      <group>
        <mesh position={[-0.44, -0.04, 0.024]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.27, 0.20, 0.003]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        <mesh position={[-0.44, 0.02, 0.027]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.24, 0.035, 0.001]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <Text
          position={[-0.44, 0.02, 0.029]}
          rotation={[0, 0, 0.05]}
          fontSize={0.013}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          PRODUCTION DEPLOYED
        </Text>
        <Text
          position={[-0.44, -0.035, 0.028]}
          rotation={[0, 0, 0.05]}
          fontSize={0.018}
          color="#0f172a"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Gifted India
        </Text>
        <Text
          position={[-0.44, -0.095, 0.028]}
          rotation={[0, 0, 0.05]}
          fontSize={0.012}
          color="#64748b"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.3}
        >
          Core Web Engineer{"\n"}Next.js · Node · Three.js · MySQL
        </Text>
        {/* Push Pin */}
        <mesh position={pGifted} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 5: 3D PORTFOLIO (CENTER HUB) ══════════════ */}
      {/* Firewatch Watchtower Interactive Experience: React 19, Three.js, R3F, GSAP */}
      <group>
        <mesh position={[0.0, -0.04, 0.024]} rotation={[0, 0, -0.02]}>
          <boxGeometry args={[0.32, 0.22, 0.003]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.6} />
        </mesh>
        {/* Inner Hub Badge */}
        <mesh position={[0.0, 0.04, 0.027]} rotation={[0, 0, -0.02]}>
          <boxGeometry args={[0.28, 0.04, 0.001]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        <Text
          position={[0.0, 0.04, 0.029]}
          rotation={[0, 0, -0.02]}
          fontSize={0.016}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          ★ 3D PORTFOLIO HUB ★
        </Text>
        <Text
          position={[0.0, -0.02, 0.028]}
          rotation={[0, 0, -0.02]}
          fontSize={0.020}
          color="#431407"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Watchtower Scene
        </Text>
        <Text
          position={[0.0, -0.085, 0.028]}
          rotation={[0, 0, -0.02]}
          fontSize={0.012}
          color="#7c2d12"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.3}
        >
          Three.js · R3F · Drei · GSAP{"\n"}Procedural Shaders & Audio
        </Text>
        {/* Push Pin */}
        <mesh position={pPortfolio} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.025, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 6: LINE FOLLOWER & MICROMOUSE (MID-RIGHT) ══════════════ */}
      {/* Robotics & Embedded Systems: C++, AVR/ARM, PID Controls, Hardware */}
      <group>
        <mesh position={[0.44, -0.06, 0.024]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.26, 0.20, 0.003]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0.44, 0.01, 0.027]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.22, 0.035, 0.001]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <Text
          position={[0.44, 0.01, 0.029]}
          rotation={[0, 0, 0.08]}
          fontSize={0.013}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          HARDWARE & ROBOTICS
        </Text>
        <Text
          position={[0.44, -0.045, 0.028]}
          rotation={[0, 0, 0.08]}
          fontSize={0.017}
          color="#f8fafc"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Micromouse Robot
        </Text>
        <Text
          position={[0.44, -0.105, 0.028]}
          rotation={[0, 0, 0.08]}
          fontSize={0.012}
          color="#94a3b8"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.3}
        >
          C++ · AVR/ARM · Maze Solving{"\n"}PID Speed & Feedback Loop
        </Text>
        {/* Push Pin */}
        <mesh position={pRobotics} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 7: PERSONAL CLOUD & HOMELAB (BOTTOM-LEFT) ══════════════ */}
      {/* Linux, Docker, Containers, Networking, Self-hosted */}
      <group>
        <mesh position={[-0.42, -0.28, 0.024]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.26, 0.18, 0.003]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <Text
          position={[-0.42, -0.23, 0.028]}
          rotation={[0, 0, -0.05]}
          fontSize={0.018}
          color="#0f172a"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          Personal Cloud
        </Text>
        <Text
          position={[-0.42, -0.285, 0.028]}
          rotation={[0, 0, -0.05]}
          fontSize={0.013}
          color="#475569"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Self-Hosted Homelab Server
        </Text>
        <Text
          position={[-0.42, -0.33, 0.028]}
          rotation={[0, 0, -0.05]}
          fontSize={0.011}
          color="#64748b"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Linux · Docker · Remote Access · SSH
        </Text>
        {/* Push Pin */}
        <mesh position={pCloud} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color={I.redBright} roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ PROJECT 8: DISCORD BOT PLATFORM (BOTTOM-RIGHT) ══════════════ */}
      {/* Real-time Event Driven Go Daemon, WebSockets, Raspberry Pi */}
      <group>
        <mesh position={[0.42, -0.28, 0.024]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[0.26, 0.18, 0.003]} />
          <meshStandardMaterial color="#5865f2" roughness={0.7} />
        </mesh>
        <Text
          position={[0.42, -0.23, 0.028]}
          rotation={[0, 0, 0.06]}
          fontSize={0.018}
          color="#ffffff"
          font="./space-grotesk.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          Discord Bot Daemon
        </Text>
        <Text
          position={[0.42, -0.285, 0.028]}
          rotation={[0, 0, 0.06]}
          fontSize={0.013}
          color="#e0e7ff"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Real-time Event Engine
        </Text>
        <Text
          position={[0.42, -0.33, 0.028]}
          rotation={[0, 0, 0.06]}
          fontSize={0.011}
          color="#c7d2fe"
          font="./outfit.ttf"
          anchorX="center"
          anchorY="middle"
        >
          Go · discordgo · WebSockets · RPi
        </Text>
        {/* Push Pin */}
        <mesh position={pDiscord} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════ 3D CATENARY GRAVITY THREAD CONNECTIONS (COMMON GROUNDS) ══════════════ */}
      {/* 1. Go / Systems Tooling Cluster (ini <-> wcheck <-> Discord Bot) */}
      <RedThread p1={pIni} p2={pWcheck} sag={0.06} tension={0.9} color="#ff2222" thickness={0.0024} tailLength={0.035} />
      <RedThread p1={pIni} p2={pDiscord} sag={0.11} tension={0.8} color="#dc2626" thickness={0.0022} tailLength={0.045} />
      <RedThread p1={pWcheck} p2={pDiscord} sag={0.08} tension={0.85} color="#dc2626" thickness={0.0022} tailLength={0.04} />

      {/* 2. Web & Three.js 3D Ecosystem (Portfolio Hub <-> Gifted India <-> Proteus Web) */}
      <RedThread p1={pPortfolio} p2={pGifted} sag={0.065} tension={0.95} color="#dc2626" thickness={0.0024} tailLength={0.038} />
      <RedThread p1={pPortfolio} p2={pProteus} sag={0.085} tension={0.85} color="#ff3333" thickness={0.0024} tailLength={0.042} />

      {/* 3. Dev Testing & Web Stress (wcheck <-> Gifted India <-> Portfolio) */}
      <RedThread p1={pWcheck} p2={pPortfolio} sag={0.075} tension={0.9} color="#eab308" thickness={0.0022} tailLength={0.032} />
      <RedThread p1={pWcheck} p2={pGifted} sag={0.12} tension={0.75} color="#b91c1c" thickness={0.0020} tailLength={0.048} />

      {/* 4. Linux & Infrastructure Backbone (Cloud Homelab <-> Discord RPi <-> Robotics) */}
      <RedThread p1={pCloud} p2={pDiscord} sag={0.07} tension={0.9} color="#eab308" thickness={0.0022} tailLength={0.035} />
      <RedThread p1={pCloud} p2={pRobotics} sag={0.13} tension={0.7} color="#dc2626" thickness={0.0020} tailLength={0.05} />
      <RedThread p1={pRobotics} p2={pDiscord} sag={0.08} tension={0.85} color="#b91c1c" thickness={0.0022} tailLength={0.038} />

      {/* 5. C++ / Computational Simulation (Proteus LAMMPS <-> Micromouse AVR/ARM C++) */}
      <RedThread p1={pProteus} p2={pRobotics} sag={0.14} tension={0.7} color="#ff2222" thickness={0.0022} tailLength={0.052} />

      {/* 6. Automation & Docker Integration (Proteus <-> Cloud Server) */}
      <RedThread p1={pProteus} p2={pCloud} sag={0.07} tension={0.9} color="#dc2626" thickness={0.0022} tailLength={0.036} />
    </group>
  );
};



// ─── FLOOR PLANKING ───
const FloorPlanking = ({ y, size }: { y: number; size: number }) => {
  const plankCount = 12;
  const plankWidth = size / plankCount;
  return (
    <group>
      {Array.from({ length: plankCount }).map((_, i) => {
        const z = -size / 2 + plankWidth / 2 + i * plankWidth;
        const isAlt = i % 2 === 0;
        return (
          <mesh key={`plank-${i}`} position={[0, y + 0.01, z]}>
            <boxGeometry args={[size - 0.1, 0.04, plankWidth - 0.01]} />
            <meshStandardMaterial
              color={isAlt ? I.plank : I.plankAlt}
              roughness={0.95}
            />
          </mesh>
        );
      })}
    </group>
  );
};
// --- PROCEDURAL HIGH-FIDELITY TEXTURE ENGINE ---
let _woodBump: THREE.CanvasTexture | null = null;
let _fabricBump: THREE.CanvasTexture | null = null;
let _metalNoise: THREE.CanvasTexture | null = null;

const ensureTextures = () => {
  if (_woodBump && _fabricBump && _metalNoise) return;

  // 1. Procedural Wood Grain Engine (Fast, lean canvas)
  const c1 = document.createElement('canvas');
  c1.width = 256; c1.height = 256;
  const ctx1 = c1.getContext('2d')!;
  ctx1.fillStyle = '#808080'; ctx1.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 200; i++) {
    ctx1.globalAlpha = Math.random() * 0.15;
    ctx1.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    const x = Math.random() * 256;
    ctx1.fillRect(x, 0, Math.random() * 2 + 1, 256);
  }
  _woodBump = new THREE.CanvasTexture(c1);
  _woodBump.wrapS = THREE.RepeatWrapping; _woodBump.wrapT = THREE.RepeatWrapping;

  // 2. Procedural High-Frequency Fabric Weave (Direct ImageData buffer for <1ms execution)
  const c2 = document.createElement('canvas');
  c2.width = 128; c2.height = 128;
  const ctx2 = c2.getContext('2d')!;
  const imgData2 = ctx2.createImageData(128, 128);
  const data32 = new Uint32Array(imgData2.data.buffer);
  for (let i = 0; i < data32.length; i++) {
    const v = (128 + (Math.random() > 0.5 ? 20 : -20)) | 0;
    data32[i] = (255 << 24) | (v << 16) | (v << 8) | v;
  }
  ctx2.putImageData(imgData2, 0, 0);
  _fabricBump = new THREE.CanvasTexture(c2);
  _fabricBump.wrapS = THREE.RepeatWrapping; _fabricBump.wrapT = THREE.RepeatWrapping;
  _fabricBump.repeat.set(8, 8);

  // 3. Fast Metal Noise Bump (Direct ImageData buffer)
  const c3 = document.createElement('canvas');
  c3.width = 128; c3.height = 128;
  const ctx3 = c3.getContext('2d')!;
  const imgData3 = ctx3.createImageData(128, 128);
  const buf32 = new Uint32Array(imgData3.data.buffer);
  for (let i = 0; i < buf32.length; i++) {
    const v = (128 + ((Math.random() - 0.5) * 35)) | 0;
    buf32[i] = (255 << 24) | (v << 16) | (v << 8) | v;
  }
  ctx3.putImageData(imgData3, 0, 0);
  _metalNoise = new THREE.CanvasTexture(c3);
  _metalNoise.wrapS = THREE.RepeatWrapping; _metalNoise.wrapT = THREE.RepeatWrapping;
};

// ─── CEILING PENDANT LIGHT FIXTURE ───
// Replaces naked/leaking ceiling point light with an authentic downward enamel industrial pendant shade
const CeilingPendantLight = ({ y }: { y: number }) => (
  <group position={[0, y + 2.65, 0]}>
    {/* Ceiling Mount Flange */}
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.04, 12]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.6} />
    </mesh>
    {/* Downward Conduit Rod */}
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
      <meshStandardMaterial color={I.metalDark} roughness={0.5} />
    </mesh>
    {/* Enamel Industrial Dome Shade (pointing down) */}
    <mesh position={[0, -0.05, 0]}>
      <coneGeometry args={[0.35, 0.16, 16, 1, true]} />
      <meshStandardMaterial color={I.stove} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
    {/* Warm Glowing Edison Bulb inside Dome */}
    <mesh position={[0, -0.08, 0]}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color="#FFE5B4" emissive="#FFC870" emissiveIntensity={1.5} roughness={0.2} />
    </mesh>
    {/* Downward warm cabin illumination (distance bounded so it never leaks onto outside roof) */}
    <pointLight position={[0, -0.12, 0]} intensity={0.75} color="#FFD090" distance={3.8} decay={2} />
  </group>
);

interface CabinInteriorProps {
  y: number;
  size: number;
}

const CabinInterior = ({ y, size }: CabinInteriorProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    ensureTextures();

    // Autonomously traverse the 120+ objects in the room and procedurally upgrade their shaders based on hex-mapping
    groupRef.current.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat || !mat.color) return;

        const hex = ('#' + mat.color.getHexString()).toUpperCase();
        const match = (paletteHex: string) => hex === paletteHex.toUpperCase();

        // High-Fidelity Wood Grain Overlay
        if ([I.darkWood, I.midWood, I.lightWood, I.cream, I.plank, I.plankAlt, I.counter].some(match)) {
           mat.bumpMap = _woodBump;
           mat.bumpScale = 0.05; 
           mat.needsUpdate = true;
        }
        // Extruded Physical Metal Shader Overhaul
        else if ([I.metal, I.metalDark, I.stove, I.stovePipe, I.mapRim, I.burner].some(match)) {
           mesh.material = new THREE.MeshPhysicalMaterial({
             color: mat.color,
             metalness: Math.max(mat.metalness || 0, 0.7),
             roughness: mat.roughness,
             bumpMap: _metalNoise,
             bumpScale: 0.02,
             clearcoat: 0.4,
             clearcoatRoughness: 0.3
           });
        }
        // Dense Cotton/Wool Woven Overlay
        else if ([I.red, I.redBright, I.green, I.mapGreen, I.bedSheet, I.pillow, I.rugRed, I.rugDark].some(match)) {
           mat.bumpMap = _fabricBump;
           mat.bumpScale = 0.08;
           mat.roughness = 1.0;
           mat.needsUpdate = true;
        }
      }
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Authentic Industrial Ceiling Pendant Shade Fixture */}
      <CeilingPendantLight y={y} />
      <pointLight position={[-1.9, y + 1.2, -1.9]} intensity={0.3} color="#FFC060" distance={3} decay={2} />

      {/* Floor planking */}
      <FloorPlanking y={y} size={size} />

      {/* Furniture pieces */}
      <FireFinder y={y} />
      <DeskArea y={y} />
      <BedArea y={y} />
      <WoodStove y={y} />
      <KitchenCounter y={y} />
      <MiniFridge y={y} />
      <FireExtinguisher y={y} />
      <Dustbin y={y} />
      <WallClock y={y} />
      <DetectiveBoard y={y} />
      <VintageRadio y={y} />
    </group>
  );
};
export default CabinInterior;
