'use client'
import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { TextFieldClientComponent, TextField } from 'payload'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

// Define Color Types
type THSL = { h: number; s: number; l: number };
type TRGB = { r: number; g: number; b: number };
type TLCH = { l: number; c: number; h: number };

// --- Start: Mathematical Color Conversion Logic ---

// Helper Functions
const hslToString = (hsl: THSL): string => {
  const { h, s, l } = hsl;
  return `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, ${l.toFixed(2)}%)`;
};
const rgbToString = (rgb: TRGB): string => {
  const { r, g, b } = rgb;
  return `rgb(${r}, ${g}, ${b})`;
};

// Core Conversion Functions
const rgbToHex = (rgb: TRGB): string => {
  const { r, g, b } = rgb;
  const toHex = (c: number): string => {
    // Ensure value is within 0-255 before converting
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHSL = (rgb: TRGB): THSL => {
  let { r, g, b } = rgb;
  (r /= 255), (g /= 255), (b /= 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const oklchToRGB = (lch: TLCH): TRGB => {
    // Convert Oklch to Oklab
    const { l, c, h } = lch
    // Convert L from 0-100 range back to 0-1 if needed for formulas
    const l_lab = l / 100;
    const hRad = h * (Math.PI / 180); // Convert hue degrees to radians
    const a_lab = c * Math.cos(hRad);
    const b_lab = c * Math.sin(hRad);

    // Convert Oklab to Linear LMS (using approximated inverse Oklab matrix)
    // Note: These constants are derived from the forward transformation
    const l_ = l_lab + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
    const m_ = l_lab - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
    const s_ = l_lab - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

    // Non-linearity inverse (cube)
    const lms_L = l_ * l_ * l_;
    const lms_M = m_ * m_ * m_;
    const lms_S = s_ * s_ * s_;

    // Convert Linear LMS to Linear RGB (using sRGB matrix inverse)
    let lr = +4.0767416621 * lms_L - 3.3077115913 * lms_M + 0.2309699292 * lms_S;
    let lg = -1.2684380046 * lms_L + 2.6097574011 * lms_M - 0.3413193965 * lms_S;
    let lb = -0.0041960863 * lms_L - 0.7034186147 * lms_M + 1.7076147010 * lms_S;

    // Convert Linear RGB to sRGB
    const srgb_R = lr > 0.0031308 ? 1.055 * Math.pow(lr, 1/2.4) - 0.055 : 12.92 * lr;
    const srgb_G = lg > 0.0031308 ? 1.055 * Math.pow(lg, 1/2.4) - 0.055 : 12.92 * lg;
    const srgb_B = lb > 0.0031308 ? 1.055 * Math.pow(lb, 1/2.4) - 0.055 : 12.92 * lb;

    return {
        r: Math.round(Math.max(0, Math.min(1, srgb_R)) * 255),
        g: Math.round(Math.max(0, Math.min(1, srgb_G)) * 255),
        b: Math.round(Math.max(0, Math.min(1, srgb_B)) * 255)
    };
};


const rgbToOklch = (rgb: TRGB): TLCH => {
  const r_srgb = rgb.r / 255;
  const g_srgb = rgb.g / 255;
  const b_srgb = rgb.b / 255;

  // Convert sRGB to Linear RGB
  const r_linear = r_srgb <= 0.04045 ? r_srgb / 12.92 : Math.pow((r_srgb + 0.055) / 1.055, 2.4);
  const g_linear = g_srgb <= 0.04045 ? g_srgb / 12.92 : Math.pow((g_srgb + 0.055) / 1.055, 2.4);
  const b_linear = b_srgb <= 0.04045 ? b_srgb / 12.92 : Math.pow((b_srgb + 0.055) / 1.055, 2.4);

  // Convert Linear RGB to Linear LMS (cone responses using sRGB CAT02 matrix)
  const l_ =  0.4122214708 * r_linear + 0.5363325363 * g_linear + 0.0514459929 * b_linear;
  const m_ =  0.2119034982 * r_linear + 0.6806995451 * g_linear + 0.1073969566 * b_linear;
  const s_ =  0.0193339 * r_linear + 0.119192 * g_linear + 0.9503041 * b_linear; // XYZ D65 conversion needed first? Check formulas

  // Apply non-linearity (typically cube root)
  const l_cubed = Math.cbrt(l_);
  const m_cubed = Math.cbrt(m_);
  const s_cubed = Math.cbrt(s_);

  // Convert LMS to Oklab (using transformation matrix)
  const l_lab = 0.2104542553 * l_cubed + 0.7936177850 * m_cubed - 0.0040720468 * s_cubed;
  const a_lab = 1.9779984951 * l_cubed - 2.4285922050 * m_cubed + 0.4505937099 * s_cubed;
  const b_lab = 0.0259040371 * l_cubed + 0.7827717662 * m_cubed - 0.8086757660 * s_cubed;

  // Convert Oklab to Oklch
  const c = Math.sqrt(a_lab * a_lab + b_lab * b_lab);
  let h = Math.atan2(b_lab, a_lab) * (180 / Math.PI);
  if (h < 0) h += 360;

  // Scale L to 0-100 range for typical CSS/UI representation
  const scaledL = l_lab * 100;

  return {
    l: parseFloat(scaledL.toFixed(3)), // Adjust precision as needed
    c: parseFloat(c.toFixed(4)),     // Adjust precision as needed
    h: parseFloat(h.toFixed(2)),     // Adjust precision as needed
  };
};

const hexToRGB = (hex: string): TRGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }; // Default to black if parsing fails
};


// Composite Conversion Functions
const oklchToHex = (oklch: TLCH): string => {
  const rgb = oklchToRGB(oklch);
  return rgbToHex(rgb);
};

const hexToOklchString = (hex: string): string => {
  const rgb = hexToRGB(hex);
  const { l, c, h } = rgbToOklch(rgb);
  // Format according to CSS spec: oklch(L% C H)
  // Note: L is percentage here (0-100), C is number, H is degrees (unitless in spec)
  return `oklch(${l.toFixed(1)}% ${c.toFixed(4)} ${h.toFixed(1)})`;
};

// Helper to parse oklch string
const parseOklchString = (oklchString: string): TLCH | null => {
    // Matches oklch(L% C H) or oklch(L C H / A) potentially with spaces
    // Handles L with or without %
    const match = oklchString.match(/oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)/);
    if (!match) {
        console.error("Failed to parse OKLCH string:", oklchString);
        return null;
    }

    let l = parseFloat(match[1]);
    const isPercent = match[2] === '%';
    const c = parseFloat(match[3]);
    const h = parseFloat(match[4]);

    // Handle potential NaN from parseFloat
    if (isNaN(l) || isNaN(c) || isNaN(h)) {
        console.error("Parsed invalid numbers from OKLCH string:", oklchString);
        return null;
    }

    // Normalize L to 0-100 range
    // If it wasn't a percentage, assume it was 0-1 and scale up
    if (!isPercent) {
        l = l * 100;
    }

    // Ensure L is clamped 0-100 just in case
    l = Math.max(0, Math.min(100, l));

    return { l, c, h };
};

// --- End: Mathematical Color Conversion Logic ---



const ColorPickerField: TextFieldClientComponent = (props) => {
  const { path, field } = props;
  // Explicitly type value as string | null | undefined based on Payload expectations
  const { value, setValue } = useField<string | null | undefined>({ path });
  const [hexColor, setHexColor] = useState('#000000');
  const [internalOklch, setInternalOklch] = useState<TLCH | null>(null); // Store parsed LCH


  // Convert OKLCH string from Payload to Hex for the color picker
  useEffect(() => {
      console.log('[Effect] Value changed:', value);
      if (value && typeof value === 'string' && value.startsWith('oklch')) {
          const parsedLCH = parseOklchString(value);
          if (parsedLCH) {
              setInternalOklch(parsedLCH); // Store the parsed LCH values
              const calculatedHex = oklchToHex(parsedLCH);
              setHexColor(calculatedHex);
              console.log('[Effect] Parsed OKLCH:', parsedLCH, 'Calculated Hex:', calculatedHex);
          } else {
              // Handle parsing failure - maybe reset to a default?
              setHexColor('#000000');
              setInternalOklch(null);
               console.warn('[Effect] Failed to parse OKLCH string:', value);
          }
      } else if (!value) {
          // Handle case where value is null/undefined (e.g., new document)
          setHexColor('#000000');
          setInternalOklch(null);
          console.log('[Effect] Value is null/undefined, resetting hex.');
      }
  }, [value]);

  // Handle color change from picker or text input
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = e.target.value;
    console.log('[handleColorChange] New Hex from input:', newHexColor);
    setHexColor(newHexColor); // Update UI immediately

    // Convert to OKLCH string and update Payload value
    const oklchString = hexToOklchString(newHexColor);
    const parsedLCH = parseOklchString(oklchString); // Parse back to check conversion
    setInternalOklch(parsedLCH); // Update internal LCH state

    console.log('[handleColorChange] Calculated OKLCH String:', oklchString);
    console.log('[handleColorChange] Parsed LCH from String:', parsedLCH);

    setValue(oklchString); // Update Payload field
    console.log('[handleColorChange] Called setValue with:', oklchString);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor={path} style={{ fontWeight: 600, marginBottom: '4px' }}>
        {String(field.label) || 'Color'}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          id={path} // Add id for label association
          type="color"
          value={hexColor} // Show current hex
          onChange={handleColorChange}
          style={{
            width: '48px', // Equivalent to w-12
            height: '32px', // Equivalent to h-8
            padding: '4px', // Equivalent to p-1
            cursor: 'pointer',
            border: '1px solid #ccc', // Add a subtle border
            borderRadius: '4px',
          }}
        />
        <input
          type="text"
          value={hexColor} // Show and allow editing hex
          onChange={handleColorChange}
          style={{
            fontFamily: 'monospace', // Equivalent to font-mono
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            flexGrow: 1, // Allow text input to take remaining space
          }}
        />
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}> {/* text-sm text-gray-500 */}
          {/* Display the value from Payload, which should be the oklch string */}
          Stored as: {String(value || 'N/A')}
          {/* Optionally display internal LCH for debugging */}
          {/* {internalOklch && ` (L: ${internalOklch.l}, C: ${internalOklch.c}, H: ${internalOklch.h})`} */}
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '32px', // Equivalent to h-8
          borderRadius: '0.375rem', // Equivalent to rounded-md
          border: '1px solid #e5e7eb', // Equivalent to border
          backgroundColor: hexColor, // Preview uses hex
        }}
      />
    </div>
  );
};

export default ColorPickerField;