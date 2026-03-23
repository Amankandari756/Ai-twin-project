import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// City data with coordinates
const cities = [
  { name: 'Berlin', lat: 52.52, lon: 13.41, population: 3669495, risk: 'medium', congestion: 6.5 },
  { name: 'Munich', lat: 48.14, lon: 11.58, population: 1488202, risk: 'low', congestion: 7.2 },
  { name: 'Hamburg', lat: 53.55, lon: 9.99, population: 1847253, risk: 'medium', congestion: 5.8 },
  { name: 'Cologne', lat: 50.94, lon: 6.96, population: 1087863, risk: 'low', congestion: 6.0 },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68, population: 764104, risk: 'medium', congestion: 6.8 },
  { name: 'Stuttgart', lat: 48.78, lon: 9.18, population: 635911, risk: 'low', congestion: 7.5 },
  { name: 'Dusseldorf', lat: 51.23, lon: 6.78, population: 629047, risk: 'low', congestion: 5.5 },
  { name: 'Leipzig', lat: 51.34, lon: 12.37, population: 601866, risk: 'medium', congestion: 4.8 },
  { name: 'Dortmund', lat: 51.51, lon: 7.47, population: 593317, risk: 'low', congestion: 5.2 },
  { name: 'Essen', lat: 51.46, lon: 7.01, population: 582415, risk: 'low', congestion: 5.0 },
];

// Convert lat/lon to 3D position (Germany-centered)
const latLonToPosition = (lat: number, lon: number): [number, number, number] => {
  const scale = 0.18;
  const x = (lon - 10) * scale;
  const z = (52 - lat) * scale;
  return [x, 0, z];
};

interface CityNodeProps {
  position: [number, number, number];
  name: string;
  population: number;
  risk: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

const CityNode: React.FC<CityNodeProps> = ({ 
  position, 
  name, 
  population, 
  risk, 
  isSelected,
  isHovered,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    if (risk === 'high') return '#ef4444';
    if (risk === 'medium') return '#f59e0b';
    return '#22c55e';
  }, [risk]);
  
  const size = useMemo(() => {
    return Math.sqrt(population) / 900;
  }, [population]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });
  
  const isActive = isSelected || isHovered;
  
  return (
    <group position={position}>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.8, size * 1.0, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* City pillar */}
      <mesh
        ref={meshRef}
        position={[0, size / 2, 0]}
        onClick={onClick}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <cylinderGeometry args={[size * 0.25, size * 0.4, size, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          transparent
          opacity={0.95}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, size / 2, 0]}>
        <sphereGeometry args={[size * 0.6, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isActive ? 0.25 : 0.1}
        />
      </mesh>
      
      {/* City label */}
      {(isActive || population > 1000000) && (
        <Html position={[0, size + 0.6, 0]} center distanceFactor={8}>
          <div style={{
            color: isSelected ? '#60a5fa' : '#fff',
            fontSize: isSelected ? '14px' : '12px',
            fontWeight: isSelected ? 'bold' : '500',
            textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Connection lines between major cities
const CityConnections: React.FC = () => {
  const lines = useMemo(() => {
    const connections: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
    const majorCities = cities.slice(0, 6);
    
    for (let i = 0; i < majorCities.length; i++) {
      for (let j = i + 1; j < majorCities.length; j++) {
        const dist = Math.sqrt(
          Math.pow(majorCities[i].lon - majorCities[j].lon, 2) +
          Math.pow(majorCities[i].lat - majorCities[j].lat, 2)
        );
        if (dist < 8) {
          connections.push({
            start: new THREE.Vector3(...latLonToPosition(majorCities[i].lat, majorCities[i].lon)),
            end: new THREE.Vector3(...latLonToPosition(majorCities[j].lat, majorCities[j].lon))
          });
        }
      }
    }
    return connections;
  }, []);
  
  return (
    <>
      {lines.map((line, idx) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([line.start, line.end]);
        return (
          <primitive key={idx} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#3b82f6', transparent: true, opacity: 0.12 }))} />
        );
      })}
    </>
  );
};

// Germany outline (simplified)
const GermanyOutline: React.FC = () => {
  const outlinePoints = useMemo(() => {
    // Simplified Germany border points
    const points = [
      [5.8, 55.1], [8.5, 55.1], [11.3, 54.8], [13.0, 54.4], [14.3, 53.9],
      [14.2, 52.4], [14.7, 51.5], [15.0, 51.0], [12.5, 50.2], [10.5, 49.7],
      [8.2, 49.1], [6.3, 49.7], [6.0, 50.8], [5.8, 52.5], [5.8, 55.1]
    ];
    
    return points.map(([lon, lat]) => new THREE.Vector3(...latLonToPosition(lat, lon)));
  }, []);
  
  const geometry = new THREE.BufferGeometry().setFromPoints(outlinePoints);
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#334155', transparent: true, opacity: 0.3 }))} />
  );
};

// Ground plane with grid
const GroundPlane: React.FC = () => {
  return (
    <>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial 
          color="#0f172a" 
          transparent 
          opacity={0.9}
          roughness={0.8}
        />
      </mesh>
      <gridHelper 
        args={[16, 32, '#1e293b', '#1e293b']} 
        position={[0, 0, 0]}
      />
    </>
  );
};

interface GermanyMap3DProps {
  selectedCity: string;
  hoveredCity: string | null;
  onCitySelect: (cityName: string) => void;
  onCityHover: (cityName: string | null) => void;
}

const GermanyMap3D: React.FC<GermanyMap3DProps> = ({ 
  selectedCity, 
  hoveredCity,
  onCitySelect,
  onCityHover
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 9, 10], fov: 45 }}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, 8, -10]} intensity={0.6} color="#3b82f6" />
        <pointLight position={[0, 5, 10]} intensity={0.4} color="#8b5cf6" />
        
        <GroundPlane />
        <GermanyOutline />
        <CityConnections />
        
        {cities.map((city) => (
          <CityNode
            key={city.name}
            position={latLonToPosition(city.lat, city.lon)}
            name={city.name}
            population={city.population}
            risk={city.risk}
            isSelected={selectedCity === city.name}
            isHovered={hoveredCity === city.name}
            onClick={() => onCitySelect(city.name)}
            onHover={(hovered) => onCityHover(hovered ? city.name : null)}
          />
        ))}
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default GermanyMap3D;
